import { motion } from 'framer-motion'
import { formatTime } from '../utils/timeUtils'

export default function PrayerCard({ prayer, time, status, use24Hour, isDark, index }) {
  const isPast = status === 'past'
  const isNext = status === 'next'
  const isCurrent = status === 'current'
  const isActive = isNext || isCurrent

  const cardContent = (
    <div
      className={`glass-card p-4 text-center transition-all duration-300 ${
        isDark ? 'glass-card-dark' : 'glass-card-light'
      } ${isPast ? 'opacity-50' : ''} ${isActive ? 'animate-pulse-gold' : ''} ${
        isNext ? 'ring-1 ring-gold/30' : ''
      }`}
    >
      <span className="text-2xl mb-2 block">{prayer.icon}</span>
      <h3 className={`font-amiri text-lg font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
        {prayer.english}
      </h3>
      <p className="font-amiri text-sm text-gold/80 mb-2">{prayer.arabic}</p>
      <p className={`font-mono text-lg font-semibold ${isActive ? 'gold-gradient-text' : isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {time ? formatTime(time, use24Hour) : '--:--'}
      </p>
    </div>
  )

  if (isActive) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="gold-gradient-border rounded-2xl"
      >
        {cardContent}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {cardContent}
    </motion.div>
  )
}
