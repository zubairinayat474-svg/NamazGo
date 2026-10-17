import { prayers } from '../data/prayers'
import { getPrayerStatus } from '../utils/timeUtils'
import PrayerCard from './PrayerCard'

export default function PrayerGrid({ timings, use24Hour, isDark }) {
  if (!timings) return null

  return (
    <section className="px-4 mb-6">
      <div className="max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-3">
        {prayers.map((prayer, index) => (
          <PrayerCard
            key={prayer.key}
            prayer={prayer}
            time={timings[prayer.key]}
            status={getPrayerStatus(timings, prayer.key)}
            use24Hour={use24Hour}
            isDark={isDark}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}
