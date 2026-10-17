import { useState, useEffect } from 'react'

export const useCountdown = (targetTime) => {
  const [timeLeft, setTimeLeft] = useState('00:00:00')

  useEffect(() => {
    if (!targetTime) {
      setTimeLeft('00:00:00')
      return
    }

    const update = () => {
      const now = new Date()
      const diff = targetTime - now

      if (diff <= 0) {
        setTimeLeft('00:00:00')
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      )
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [targetTime])

  return timeLeft
}
