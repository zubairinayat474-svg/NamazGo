import { useState, useEffect, useCallback } from 'react'
import {
  getPrayerTimesByCoords,
  getPrayerTimesByCity,
  cachePrayerData,
  loadCachedPrayerData,
} from '../utils/api'

export const usePrayerTimes = (settings) => {
  const [prayerData, setPrayerData] = useState(() => loadCachedPrayerData())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [locationInfo, setLocationInfo] = useState(null)

  const fetchByCoords = useCallback(
    async (lat, lng, info = {}) => {
      setLoading(true)
      setError(null)
      try {
        const data = await getPrayerTimesByCoords(lat, lng, settings.method, settings.school)
        const payload = {
          timings: data.timings,
          hijri: data.date.hijri,
          gregorian: data.date.gregorian,
          meta: data.meta,
          location: {
            lat,
            lng,
            city: info.city || 'Current Location',
            country: info.country || '',
            countryCode: info.countryCode || '',
          },
        }
        setPrayerData(payload)
        setLocationInfo(payload.location)
        cachePrayerData(payload)
        return payload
      } catch (err) {
        setError(err.message || 'Failed to load prayer times')
        return null
      } finally {
        setLoading(false)
      }
    },
    [settings.method, settings.school]
  )

  const fetchByCity = useCallback(
    async (city, country, countryCode = '') => {
      setLoading(true)
      setError(null)
      try {
        const data = await getPrayerTimesByCity(city, country, settings.method, settings.school)
        const payload = {
          timings: data.timings,
          hijri: data.date.hijri,
          gregorian: data.date.gregorian,
          meta: data.meta,
          location: {
            lat: data.meta.latitude,
            lng: data.meta.longitude,
            city,
            country,
            countryCode,
          },
        }
        setPrayerData(payload)
        setLocationInfo(payload.location)
        cachePrayerData(payload)
        return payload
      } catch (err) {
        setError(err.message || 'Failed to load prayer times')
        return null
      } finally {
        setLoading(false)
      }
    },
    [settings.method, settings.school]
  )

  useEffect(() => {
    const interval = setInterval(() => {
      if (!locationInfo) return
      if (locationInfo.lat && locationInfo.lng) {
        fetchByCoords(locationInfo.lat, locationInfo.lng, locationInfo)
      } else if (locationInfo.city) {
        fetchByCity(locationInfo.city, locationInfo.country, locationInfo.countryCode)
      }
    }, 60 * 60 * 1000)

    return () => clearInterval(interval)
  }, [locationInfo, fetchByCoords, fetchByCity])

  return {
    prayerData,
    loading,
    error,
    locationInfo,
    fetchByCoords,
    fetchByCity,
    setLocationInfo,
  }
}
