import { motion } from 'framer-motion'
import { useCountdown } from '../hooks/useCountdown'
import { getRamadanTimes, getRamadanCountdown } from '../utils/ramadanUtils'
import { formatTime } from '../utils/timeUtils'

export default function RamadanBanner({ timings, use24Hour, isDark }) {
  const ramadanTimes = getRamadanTimes(timings)
  const countdown = getRamadanCountdown(timings)
  const timeLeft = useCountdown(countdown?.target)

  if (!ramadanTimes) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 mb-6"
    >
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl bg-gradient-to-r from-green-islam to-green-light p-5 text-white shadow-lg">
          <h3 className="font-amiri text-2xl font-bold text-center mb-3">
            Ramadan Mubarak 🌙
          </h3>
          <div className="flex justify-center gap-8 mb-3">
            <div className="text-center">
              <p className="text-xs uppercase tracking-wider opacity-80">Sehri</p>
              <p className="font-mono text-lg font-semibold">
                {formatTime(ramadanTimes.sehri, use24Hour)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-wider opacity-80">Iftar</p>
              <p className="font-mono text-lg font-semibold">
                {formatTime(ramadanTimes.iftar, use24Hour)}
              </p>
            </div>
          </div>
          {countdown && (
            <div className="text-center">
              <p className="text-sm opacity-90">{countdown.label}</p>
              <p className="font-mono text-2xl font-bold">{timeLeft}</p>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  )
}
