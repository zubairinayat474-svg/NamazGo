import { motion } from 'framer-motion'
import { useCountdown } from '../hooks/useCountdown'
import { prayers } from '../data/prayers'

export default function CountdownCard({ nextPrayer, isDark }) {
  const timeLeft = useCountdown(nextPrayer?.time)
  const prayerInfo = prayers.find((p) => p.key === nextPrayer?.name)

  if (!nextPrayer) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 mb-6"
    >
      <div className="max-w-2xl mx-auto animate-pulse-gold rounded-2xl">
        <div
          className={`glass-card text-center py-8 px-6 ${
            isDark ? 'glass-card-dark' : 'glass-card-light'
          }`}
        >
          <p className={`text-sm uppercase tracking-widest mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Next Prayer
          </p>
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl">{prayerInfo?.icon}</span>
            <h2 className="font-amiri text-4xl font-bold gold-gradient-text">
              {nextPrayer.name}
            </h2>
            {prayerInfo?.arabic && (
              <span className="font-amiri text-2xl text-gold/70">{prayerInfo.arabic}</span>
            )}
          </div>
          <p className="font-mono text-5xl md:text-6xl font-bold gold-gradient-text tracking-wider">
            {timeLeft}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
