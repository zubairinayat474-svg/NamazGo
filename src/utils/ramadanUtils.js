import { parseTimeToDate } from './timeUtils'

export const isRamadan = (hijriMonth) => hijriMonth === 9

export const getRamadanTimes = (timings) => {
  if (!timings) return null
  return {
    sehri: timings.Imsak || timings.Fajr,
    iftar: timings.Maghrib,
  }
}

export const getRamadanCountdown = (timings) => {
  if (!timings) return null

  const now = new Date()
  const maghrib = parseTimeToDate(timings.Maghrib)
  const fajr = parseTimeToDate(timings.Fajr)

  if (now < maghrib) {
    return { label: 'Iftar in', target: maghrib }
  }

  const tomorrowFajr = new Date(fajr)
  tomorrowFajr.setDate(tomorrowFajr.getDate() + 1)
  return { label: 'Sehri in', target: tomorrowFajr }
}
