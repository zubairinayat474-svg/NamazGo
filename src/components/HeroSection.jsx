import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiMagnifyingGlass, HiMapPin, HiShare } from 'react-icons/hi2'
import { formatHijriDate, formatGregorianDate } from '../utils/hijriUtils'
import { formatLiveClock } from '../utils/timeUtils'
import { useCountdown } from '../hooks/useCountdown'
import { prayers } from '../data/prayers'

export default function HeroSection({
  locationInfo,
  hijri,
  gregorian,
  nextPrayer,
  onOpenSearch,
  onDetectLocation,
  onShare,
  use24Hour,
  isDark,
  loading,
}) {
  const [now, setNow] = useState(new Date())
  const timeLeft = useCountdown(nextPrayer?.time)
  const prayerInfo = prayers.find((p) => p.key === nextPrayer?.name)

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const cityName = locationInfo?.city || 'Detecting location...'
  const countryName = locationInfo?.countryName || locationInfo?.country || ''

  return (
    <section className="relative px-4 pt-10 pb-2 overflow-hidden">
      <div
        className={`absolute inset-0 pointer-events-none ${
          isDark
            ? 'bg-gradient-to-b from-green-islam/20 via-transparent to-transparent'
            : 'bg-gradient-to-b from-green-islam/10 via-transparent to-transparent'
        }`}
      />
      <div className="absolute inset-0 islamic-pattern opacity-[0.04] pointer-events-none" />

      <div className="relative max-w-2xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-amiri text-4xl sm:text-5xl font-bold gold-gradient-text mb-6 tracking-wide"
        >
          NamazGo
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="flex items-center justify-center gap-2 mb-1"
        >
          <HiMapPin className={`text-sm shrink-0 ${isDark ? 'text-gold' : 'text-green-islam'}`} aria-hidden />
          <h1 className={`text-2xl sm:text-3xl font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            {loading ? 'Loading...' : cityName}
          </h1>
        </motion.div>

        {countryName && (
          <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{countryName}</p>
        )}

        {hijri && (
          <p className="font-amiri text-lg sm:text-xl text-gold mb-0.5">{formatHijriDate(hijri)}</p>
        )}
        {gregorian && (
          <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {formatGregorianDate(gregorian)}
          </p>
        )}

        <p className="font-mono text-xl sm:text-2xl font-semibold gold-gradient-text mb-6">
          {formatLiveClock(now, use24Hour)}
        </p>

        {nextPrayer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12 }}
            className={`mb-6 mx-auto max-w-md rounded-2xl px-5 py-6 border ${
              isDark
                ? 'bg-dark-surface/70 border-gold/25 shadow-[0_0_40px_rgba(201,168,76,0.12)]'
                : 'bg-white/70 border-green-islam/20 shadow-lg shadow-green-islam/5'
            }`}
          >
            <p
              className={`text-xs uppercase tracking-[0.2em] mb-2 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Next Prayer
            </p>
            <div className="flex items-center justify-center gap-2 mb-3">
              <h2 className="font-amiri text-3xl sm:text-4xl font-bold gold-gradient-text">
                {nextPrayer.name}
              </h2>
              {prayerInfo?.arabic && (
                <span className="font-amiri text-xl text-gold/70" lang="ar" dir="rtl">
                  {prayerInfo.arabic}
                </span>
              )}
            </div>
            <p
              className="font-mono text-4xl sm:text-5xl font-bold gold-gradient-text tracking-wider tabular-nums"
              aria-live="polite"
              aria-atomic="true"
            >
              {timeLeft}
            </p>
          </motion.div>
        )}

        <div className="flex gap-2 max-w-md mx-auto">
          <button
            type="button"
            onClick={onOpenSearch}
            className={`flex-1 flex items-center gap-2 px-4 py-3.5 rounded-xl border transition-all ${
              isDark
                ? 'bg-dark-surface/60 border-dark-border text-gray-400 hover:border-gold/30'
                : 'bg-white/60 border-green-islam/20 text-gray-500 hover:border-green-islam/40'
            }`}
          >
            <HiMagnifyingGlass className="text-lg" aria-hidden />
            <span className="text-sm">Find a city</span>
          </button>
          <button
            type="button"
            onClick={onDetectLocation}
            className="px-4 py-3.5 rounded-xl bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 transition-all"
            title="Use my location"
            aria-label="Use my location"
          >
            <HiMapPin className="text-lg" />
          </button>
          {onShare && locationInfo?.city && (
            <button
              type="button"
              onClick={onShare}
              className={`px-4 py-3.5 rounded-xl border transition-all ${
                isDark
                  ? 'border-dark-border text-gray-400 hover:border-gold/30 hover:text-gold'
                  : 'border-green-islam/20 text-gray-500 hover:border-green-islam/40'
              }`}
              title="Share this city"
              aria-label="Share prayer times for this city"
            >
              <HiShare className="text-lg" />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
