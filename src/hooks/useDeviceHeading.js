import { useState, useEffect, useCallback } from 'react'

const getCompassHeading = (event) => {
  if (event.webkitCompassHeading != null && !Number.isNaN(event.webkitCompassHeading)) {
    return event.webkitCompassHeading
  }
  if (event.alpha == null || Number.isNaN(event.alpha)) return null
  if (event.absolute) {
    return (360 - event.alpha) % 360
  }
  return (360 - event.alpha) % 360
}

export const useDeviceHeading = () => {
  const [heading, setHeading] = useState(null)
  const [permissionState, setPermissionState] = useState('unknown')

  useEffect(() => {
    if (!window.DeviceOrientationEvent) {
      setPermissionState('unsupported')
      return
    }
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      setPermissionState('prompt')
    } else {
      setPermissionState('granted')
    }
  }, [])

  const requestPermission = useCallback(async () => {
    if (!window.DeviceOrientationEvent) {
      setPermissionState('unsupported')
      return false
    }

    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const result = await DeviceOrientationEvent.requestPermission()
        const granted = result === 'granted'
        setPermissionState(granted ? 'granted' : 'denied')
        return granted
      } catch {
        setPermissionState('denied')
        return false
      }
    }

    setPermissionState('granted')
    return true
  }, [])

  useEffect(() => {
    if (permissionState !== 'granted') return

    const onOrientation = (event) => {
      const value = getCompassHeading(event)
      if (value != null) setHeading(value)
    }

    window.addEventListener('deviceorientationabsolute', onOrientation, true)
    window.addEventListener('deviceorientation', onOrientation, true)

    return () => {
      window.removeEventListener('deviceorientationabsolute', onOrientation, true)
      window.removeEventListener('deviceorientation', onOrientation, true)
    }
  }, [permissionState])

  return {
    heading,
    permissionState,
    requestPermission,
    isLive: permissionState === 'granted' && heading != null,
  }
}
