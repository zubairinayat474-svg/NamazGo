import { PRAYER_KEYS } from '../data/prayers'

export const formatDateStr = (date = new Date()) => {
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
}

export const parseTimeToDate = (timeStr, baseDate = new Date()) => {
  const [hours, minutes] = timeStr.split(':').map(Number)
  const result = new Date(baseDate)
  result.setHours(hours, minutes, 0, 0)
  return result
}

export const formatTime = (timeStr, use24Hour = false) => {
  const [hours, minutes] = timeStr.split(':').map(Number)
  if (use24Hour) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  }
  const period = hours >= 12 ? 'PM' : 'AM'
  const h = hours % 12 || 12
  return `${h}:${String(minutes).padStart(2, '0')} ${period}`
}

export const getNextPrayer = (timings) => {
  if (!timings) return null

  const now = new Date()

  for (const key of PRAYER_KEYS) {
    const prayerTime = parseTimeToDate(timings[key])
    if (now < prayerTime) {
      return { name: key, time: prayerTime }
    }
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const fajrTime = parseTimeToDate(timings.Fajr, tomorrow)
  return { name: 'Fajr', time: fajrTime }
}

export const getCurrentPrayer = (timings) => {
  if (!timings) return null

  const now = new Date()
  let current = null

  for (const key of PRAYER_KEYS) {
    const prayerTime = parseTimeToDate(timings[key])
    if (now >= prayerTime) {
      current = key
    }
  }

  return current
}

export const getPrayerStatus = (timings, prayerKey) => {
  if (!timings) return 'upcoming'

  const next = getNextPrayer(timings)
  const current = getCurrentPrayer(timings)

  if (next?.name === prayerKey) return 'next'
  if (current === prayerKey) return 'current'
  if (parseTimeToDate(timings[prayerKey]) < new Date()) return 'past'
  return 'upcoming'
}

export const formatLiveClock = (date, use24Hour = false) => {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  if (use24Hour) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  const period = hours >= 12 ? 'PM' : 'AM'
  const h = hours % 12 || 12
  return `${h}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${period}`
}
