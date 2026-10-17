import { useState, useEffect, useCallback } from 'react'
import { getQiblaDirection } from '../utils/api'

export const useQibla = (lat, lng) => {
  const [direction, setDirection] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchQibla = useCallback(async () => {
    if (lat == null || lng == null) return
    setLoading(true)
    try {
      const deg = await getQiblaDirection(lat, lng)
      setDirection(Math.round(deg))
    } catch {
      setDirection(null)
    } finally {
      setLoading(false)
    }
  }, [lat, lng])

  useEffect(() => {
    fetchQibla()
  }, [fetchQibla])

  return { direction, loading }
}
