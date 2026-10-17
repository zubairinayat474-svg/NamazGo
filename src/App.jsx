import { useState, useEffect, useCallback, useRef } from 'react'
import { Routes, Route, useParams, useNavigate, useLocation as useRouterLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import PrayerGrid from './components/PrayerGrid'
import QiblaCompass from './components/QiblaCompass'
import RamadanBanner from './components/RamadanBanner'
import FavoriteCities, { loadFavorites, saveFavorites } from './components/FavoriteCities'
import SearchModal from './components/SearchModal'
import SettingsDrawer from './components/SettingsDrawer'
import { useDarkMode } from './hooks/useDarkMode'
import { useLocation } from './hooks/useLocation'
import { usePrayerTimes } from './hooks/usePrayerTimes'
import { useQibla } from './hooks/useQibla'
import { useDeviceHeading } from './hooks/useDeviceHeading'
import { useDocumentMeta } from './hooks/useDocumentMeta'
import { getNextPrayer, parseTimeToDate } from './utils/timeUtils'
import { isRamadan } from './utils/ramadanUtils'
import { loadSettings, saveSettings } from './utils/api'
import { PRAYER_KEYS } from './data/prayers'
import { findCityBySlug } from './data/cities'
import { cityPath, toCitySlug } from './utils/slug'

function PrayerApp() {
  const { citySlug } = useParams()
  const navigate = useNavigate()
  const routerLocation = useRouterLocation()
  const { isDark, toggle: toggleTheme } = useDarkMode()
  const [settings, setSettings] = useState(loadSettings)
  const [searchOpen, setSearchOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [favorites, setFavorites] = useState(loadFavorites)
  const notifiedRef = useRef(new Set())
  const loadedSlugRef = useRef(null)
  const skipUrlSyncRef = useRef(false)

  const { location, loading: locLoading, detectLocation, setLocation } = useLocation()
  const {
    prayerData,
    loading: prayerLoading,
    error,
    locationInfo,
    fetchByCoords,
    fetchByCity,
  } = usePrayerTimes(settings)

  const lat = prayerData?.location?.lat ?? location?.lat
  const lng = prayerData?.location?.lng ?? location?.lng
  const { direction: qiblaDirection, loading: qiblaLoading } = useQibla(lat, lng)
  const {
    heading: deviceHeading,
    permissionState,
    requestPermission,
    isLive: compassLive,
  } = useDeviceHeading()

  const use24Hour = settings.timeFormat === '24'
  const nextPrayer = prayerData?.timings ? getNextPrayer(prayerData.timings) : null
  const showRamadan = prayerData?.hijri && isRamadan(prayerData.hijri.month?.number)

  useDocumentMeta({
    city: locationInfo?.city,
    country: locationInfo?.countryName || locationInfo?.country,
    path: routerLocation.pathname,
  })

  // Load from URL slug on first visit / navigation
  useEffect(() => {
    if (!citySlug) {
      loadedSlugRef.current = null
      return
    }
    if (loadedSlugRef.current === citySlug) return

    const known = findCityBySlug(citySlug)
    loadedSlugRef.current = citySlug
    skipUrlSyncRef.current = true

    if (known) {
      if (known.lat && known.lng) {
        fetchByCoords(known.lat, known.lng, {
          city: known.city,
          country: known.countryName || known.country,
          countryCode: known.country,
          countryName: known.countryName,
        })
      } else {
        fetchByCity(known.city, known.country, known.country)
      }
    } else {
      const cityName = citySlug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
      fetchByCity(cityName, '', '')
    }
  }, [citySlug, fetchByCoords, fetchByCity])

  // Home: auto-detect GPS when no city in URL
  useEffect(() => {
    if (citySlug) return
    let cancelled = false
    ;(async () => {
      const loc = await detectLocation()
      if (cancelled || !loc) return
      skipUrlSyncRef.current = false
      await fetchByCoords(loc.lat, loc.lng, loc)
    })()
    return () => {
      cancelled = true
    }
  }, [citySlug, detectLocation, fetchByCoords])

  // Keep URL in sync when user picks a city
  useEffect(() => {
    if (!locationInfo?.city) return
    if (skipUrlSyncRef.current) {
      skipUrlSyncRef.current = false
      return
    }
    const nextPath = cityPath(locationInfo.city)
    if (routerLocation.pathname !== nextPath) {
      loadedSlugRef.current = toCitySlug(locationInfo.city)
      navigate(nextPath, { replace: true })
    }
  }, [locationInfo?.city, navigate, routerLocation.pathname])

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  useEffect(() => {
    if (locationInfo?.lat && locationInfo?.lng) {
      fetchByCoords(locationInfo.lat, locationInfo.lng, locationInfo)
    } else if (locationInfo?.city) {
      fetchByCity(locationInfo.city, locationInfo.country, locationInfo.countryCode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only refetch on method/school change
  }, [settings.method, settings.school])

  useEffect(() => {
    if (!prayerData?.timings || settings.notificationMinutes === 0) return
    if (!('Notification' in window)) return
    if (Notification.permission !== 'granted') return

    const checkNotifications = () => {
      const now = new Date()
      for (const key of PRAYER_KEYS) {
        const prayerTime = parseTimeToDate(prayerData.timings[key])
        const diff = prayerTime - now
        const minutesBefore = settings.notificationMinutes * 60 * 1000
        const notifyKey = `${key}-${prayerTime.toDateString()}`

        if (diff > 0 && diff <= minutesBefore + 60000 && diff >= minutesBefore - 60000) {
          if (!notifiedRef.current.has(notifyKey)) {
            notifiedRef.current.add(notifyKey)
            new Notification(`NamazGo — ${key} Prayer`, {
              body: `${key} prayer is in ${settings.notificationMinutes} minutes`,
              icon: '/icon-192.png',
            })
          }
        }
      }
    }

    const interval = setInterval(checkNotifications, 30000)
    return () => clearInterval(interval)
  }, [prayerData, settings.notificationMinutes])

  const handleEnableNotifications = useCallback(async () => {
    if (!('Notification' in window)) return false
    if (Notification.permission === 'granted') return true
    if (Notification.permission === 'denied') return false
    const result = await Notification.requestPermission()
    return result === 'granted'
  }, [])

  const handleSettingsUpdate = useCallback((newSettings) => {
    setSettings(newSettings)
  }, [])

  const handleSelectCity = useCallback(
    async (city, country, countryCode) => {
      skipUrlSyncRef.current = false
      await fetchByCity(city, country, countryCode)
    },
    [fetchByCity]
  )

  const handleSelectCoords = useCallback(
    async (latVal, lngVal, info) => {
      skipUrlSyncRef.current = false
      setLocation(info)
      await fetchByCoords(latVal, lngVal, info)
    },
    [fetchByCoords, setLocation]
  )

  const handleDetectLocation = useCallback(async () => {
    skipUrlSyncRef.current = false
    const loc = await detectLocation()
    if (loc) {
      await fetchByCoords(loc.lat, loc.lng, loc)
    }
  }, [detectLocation, fetchByCoords])

  const handleShare = useCallback(async () => {
    if (!locationInfo?.city) return
    const path = cityPath(locationInfo.city)
    const url = `${window.location.origin}${path}`
    const title = `Prayer Times in ${locationInfo.city} — NamazGo`
    const text = `Today's prayer times for ${locationInfo.city} on NamazGo`
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url })
      } else {
        await navigator.clipboard.writeText(url)
      }
    } catch {
      // user cancelled share
    }
  }, [locationInfo])

  const handleAddFavorite = useCallback(() => {
    if (!locationInfo) return
    const entry = {
      city: locationInfo.city,
      country: locationInfo.country || locationInfo.countryCode,
      countryCode: locationInfo.countryCode || '',
      countryName: locationInfo.countryName || locationInfo.country || '',
      display: `${locationInfo.city}${
        locationInfo.countryName || locationInfo.country
          ? `, ${locationInfo.countryName || locationInfo.country}`
          : ''
      }`,
      lat: locationInfo.lat,
      lng: locationInfo.lng,
    }
    const updated = [...favorites.filter((f) => f.city !== entry.city), entry]
    setFavorites(updated)
    saveFavorites(updated)
  }, [locationInfo, favorites])

  const handleRemoveFavorite = useCallback(
    (fav) => {
      const updated = favorites.filter((f) => f.city !== fav.city)
      setFavorites(updated)
      saveFavorites(updated)
    },
    [favorites]
  )

  const handleSelectFavorite = useCallback(
    async (fav) => {
      skipUrlSyncRef.current = false
      if (fav.lat && fav.lng) {
        await handleSelectCoords(fav.lat, fav.lng, fav)
      } else {
        await handleSelectCity(fav.city, fav.country, fav.countryCode)
      }
    },
    [handleSelectCity, handleSelectCoords]
  )

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-dark-bg text-gray-100' : 'bg-light-bg text-gray-900'
      }`}
    >
      <Navbar
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main>
        <HeroSection
          locationInfo={locationInfo || location}
          hijri={prayerData?.hijri}
          gregorian={prayerData?.gregorian}
          nextPrayer={nextPrayer}
          onOpenSearch={() => setSearchOpen(true)}
          onDetectLocation={handleDetectLocation}
          onShare={handleShare}
          use24Hour={use24Hour}
          isDark={isDark}
          loading={locLoading || prayerLoading}
        />

        {error && (
          <div className="px-4 mb-4">
            <div
              className="max-w-2xl mx-auto p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center"
              role="alert"
            >
              {error}
              <button type="button" onClick={handleDetectLocation} className="ml-2 underline">
                Retry
              </button>
            </div>
          </div>
        )}

        <PrayerGrid timings={prayerData?.timings} use24Hour={use24Hour} isDark={isDark} />

        {showRamadan && (
          <RamadanBanner timings={prayerData.timings} use24Hour={use24Hour} isDark={isDark} />
        )}

        <QiblaCompass
          direction={qiblaDirection}
          heading={deviceHeading}
          loading={qiblaLoading}
          isDark={isDark}
          permissionState={permissionState}
          onRequestPermission={requestPermission}
          isLive={compassLive}
        />

        <FavoriteCities
          favorites={favorites}
          onSelect={handleSelectFavorite}
          onAdd={handleAddFavorite}
          onRemove={handleRemoveFavorite}
          currentLocation={locationInfo}
          isDark={isDark}
        />
      </main>

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectCity={handleSelectCity}
        onSelectCoords={handleSelectCoords}
        isDark={isDark}
      />

      <SettingsDrawer
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onUpdate={handleSettingsUpdate}
        isDark={isDark}
        onEnableNotifications={handleEnableNotifications}
      />
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<PrayerApp />} />
      <Route path="/prayer-times/:citySlug" element={<PrayerApp />} />
      <Route path="*" element={<PrayerApp />} />
    </Routes>
  )
}

export default App
