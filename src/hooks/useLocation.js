import { useState, useCallback } from 'react'
import { reverseGeocode } from '../utils/api'

export const useLocation = () => {
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const detectLocation = useCallback(async () => {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setLoading(false)
      return null
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude: lat, longitude: lng } = position.coords
            const geo = await reverseGeocode(lat, lng)
            const loc = { lat, lng, ...geo }
            setLocation(loc)
            setLoading(false)
            resolve(loc)
          } catch {
            const loc = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              city: 'Current Location',
              country: '',
              countryCode: '',
            }
            setLocation(loc)
            setLoading(false)
            resolve(loc)
          }
        },
        (err) => {
          setError(err.message || 'Unable to detect location')
          setLoading(false)
          resolve(null)
        },
        { enableHighAccuracy: true, timeout: 15000 }
      )
    })
  }, [])

  return { location, loading, error, detectLocation, setLocation }
}
