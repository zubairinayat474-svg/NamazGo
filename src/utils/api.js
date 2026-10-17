const SETTINGS_KEY = 'namazgo-settings'

export const defaultSettings = {
  method: 2,
  school: 0,
  timeFormat: '12',
  notificationMinutes: 10,
}

export const loadSettings = () => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY)
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings
  } catch {
    return defaultSettings
  }
}

export const saveSettings = (settings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export const formatDateStr = (date = new Date()) => {
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
}

export const getPrayerTimesByCoords = async (lat, lng, method = 2, school = 0) => {
  const dateStr = formatDateStr()
  const response = await fetch(
    `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=${method}&school=${school}`
  )
  if (!response.ok) throw new Error('Failed to fetch prayer times')
  const json = await response.json()
  return json.data
}

export const getPrayerTimesByCity = async (city, country, method = 2, school = 0) => {
  const dateStr = formatDateStr()
  const response = await fetch(
    `https://api.aladhan.com/v1/timingsByCity/${dateStr}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}&school=${school}`
  )
  if (!response.ok) throw new Error('Failed to fetch prayer times')
  const json = await response.json()
  return json.data
}

export const getQiblaDirection = async (lat, lng) => {
  const response = await fetch(`https://api.aladhan.com/v1/qibla/${lat}/${lng}`)
  if (!response.ok) throw new Error('Failed to fetch qibla direction')
  const json = await response.json()
  return json.data.direction
}

const NOMINATIM_HEADERS = {
  'Accept-Language': 'en',
  Accept: 'application/json',
}

export const reverseGeocode = async (lat, lng) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
    { headers: NOMINATIM_HEADERS }
  )
  if (!response.ok) throw new Error('Failed to reverse geocode')
  const data = await response.json()
  const address = data.address || {}
  const city =
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    address.county ||
    'Unknown'
  const country = address.country || ''
  const countryCode = address.country_code?.toUpperCase() || ''
  return { city, country, countryCode, displayName: data.display_name }
}

export const searchCities = async (query) => {
  if (!query || query.length < 2) return []
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=8&featuretype=city`,
    { headers: NOMINATIM_HEADERS }
  )
  if (!response.ok) return []
  const results = await response.json()
  return results.map((item) => ({
    name: item.name || item.display_name.split(',')[0],
    country: item.address?.country || '',
    countryCode: item.address?.country_code?.toUpperCase() || '',
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
    displayName: item.display_name,
  }))
}

export const cachePrayerData = (data) => {
  try {
    localStorage.setItem('namazgo-last-prayer-data', JSON.stringify(data))
  } catch {
    // ignore storage errors
  }
}

export const loadCachedPrayerData = () => {
  try {
    const stored = localStorage.getItem('namazgo-last-prayer-data')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}
