import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiXMark, HiMagnifyingGlass, HiClock } from 'react-icons/hi2'
import { featuredCities } from '../data/cities'
import { searchCities } from '../utils/api'
import { useFocusTrap } from '../hooks/useFocusTrap'

const RECENT_KEY = 'namazgo-recent-searches'

const loadRecent = () => {
  try {
    const stored = localStorage.getItem(RECENT_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const saveRecent = (recent) => {
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, 8)))
}

export default function SearchModal({ isOpen, onClose, onSelectCity, onSelectCoords, isDark }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [recent, setRecent] = useState(loadRecent)
  const inputRef = useRef(null)
  const panelRef = useRef(null)

  useFocusTrap(isOpen, onClose, panelRef)

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setResults([])
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setSearching(true)
      const found = await searchCities(query)
      setResults(found)
      setSearching(false)
    }, 400)

    return () => clearTimeout(timer)
  }, [query])

  const handleSelect = (item) => {
    const entry = {
      city: item.city || item.name,
      country: item.country || item.countryCode,
      countryCode: item.countryCode || item.country || '',
      countryName: item.countryName || item.country || '',
      display: item.display || `${item.name || item.city}, ${item.countryName || item.country}`,
      lat: item.lat,
      lng: item.lng,
    }

    const updated = [entry, ...recent.filter((r) => r.city !== entry.city)].slice(0, 8)
    setRecent(updated)
    saveRecent(updated)

    if (entry.lat && entry.lng) {
      onSelectCoords(entry.lat, entry.lng, entry)
    } else {
      onSelectCity(entry.city, entry.country, entry.countryCode)
    }
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="search-modal-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[10%] left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-50"
          >
            <div
              className={`glass-card p-5 ${
                isDark ? 'glass-card-dark bg-dark-surface' : 'glass-card-light bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2
                  id="search-modal-title"
                  className={`font-amiri text-xl ${isDark ? 'text-gray-100' : 'text-gray-900'}`}
                >
                  Search City
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gold/10"
                  aria-label="Close search"
                >
                  <HiXMark className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>

              <div
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border mb-4 ${
                  isDark ? 'border-dark-border bg-dark-bg/50' : 'border-green-islam/20 bg-light-bg/50'
                }`}
              >
                <HiMagnifyingGlass className={isDark ? 'text-gray-400' : 'text-gray-500'} aria-hidden />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type city name..."
                  aria-label="Search for a city"
                  className={`flex-1 bg-transparent outline-none text-sm ${
                    isDark ? 'text-gray-100 placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-400'
                  }`}
                />
              </div>

              {searching && (
                <p className={`text-sm text-center py-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} role="status">
                  Searching...
                </p>
              )}

              {results.length > 0 && (
                <div className="mb-4 max-h-48 overflow-y-auto" role="listbox" aria-label="Search results">
                  {results.map((item, i) => (
                    <button
                      key={`${item.lat}-${item.lng}-${i}`}
                      role="option"
                      onClick={() => handleSelect(item)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        isDark ? 'hover:bg-gold/10 text-gray-300' : 'hover:bg-green-islam/10 text-gray-700'
                      }`}
                    >
                      {item.displayName || `${item.name}, ${item.country}`}
                    </button>
                  ))}
                </div>
              )}

              {recent.length > 0 && !query && (
                <div className="mb-4">
                  <div className="flex items-center gap-1 mb-2">
                    <HiClock className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`} aria-hidden />
                    <p className={`text-xs uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Recent
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recent.map((item, i) => (
                      <button
                        key={`${item.city}-${i}`}
                        onClick={() => handleSelect(item)}
                        className={`px-3 py-2 rounded-lg text-xs ${
                          isDark
                            ? 'bg-dark-bg border border-dark-border text-gray-400 hover:border-gold/30'
                            : 'bg-light-bg border border-green-islam/20 text-gray-600 hover:border-green-islam/40'
                        }`}
                      >
                        {item.display || item.city}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className={`text-xs uppercase tracking-wider mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Popular Cities
                </p>
                <div className="flex flex-wrap gap-2">
                  {featuredCities.map((city) => (
                    <button
                      key={city.city}
                      onClick={() => handleSelect(city)}
                      className={`px-3 py-2 rounded-lg text-xs transition-all ${
                        isDark
                          ? 'bg-dark-bg border border-dark-border text-gray-400 hover:border-gold/30 hover:text-gold'
                          : 'bg-light-bg border border-green-islam/20 text-gray-600 hover:border-green-islam/40'
                      }`}
                    >
                      {city.display}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
