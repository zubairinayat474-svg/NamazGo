import { useEffect } from 'react'

const SITE_URL = 'https://namazgo.app'
const DEFAULT_TITLE = 'NamazGo — Global Prayer Times'
const DEFAULT_DESCRIPTION =
  'Accurate prayer times, Qibla compass, and Ramadan Sehri & Iftar for every city worldwide. Free PWA — NamazGo.'

const setMeta = (attr, key, content) => {
  if (!content) return
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

const setCanonical = (href) => {
  let link = document.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

/**
 * Keep document title + social meta in sync with the current city view.
 */
export function useDocumentMeta({ city, country, path = '/' } = {}) {
  useEffect(() => {
    const hasCity = Boolean(city)
    const title = hasCity
      ? `Prayer Times in ${city}${country ? `, ${country}` : ''} Today — NamazGo`
      : DEFAULT_TITLE
    const description = hasCity
      ? `Today's Fajr, Dhuhr, Asr, Maghrib & Isha prayer times in ${city}${
          country ? `, ${country}` : ''
        }. Live countdown, Qibla direction, and Hijri date — NamazGo.`
      : DEFAULT_DESCRIPTION
    const url = `${SITE_URL}${path === '/' ? '/' : path}`

    document.title = title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setCanonical(url)
  }, [city, country, path])
}
