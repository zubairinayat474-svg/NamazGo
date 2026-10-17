import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiMoon, HiSun, HiCog6Tooth, HiArrowDownTray } from 'react-icons/hi2'

export default function Navbar({ isDark, onToggleTheme, onOpenSettings, onInstall, canInstall }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      await deferredPrompt.userChoice
      setDeferredPrompt(null)
    }
    onInstall?.()
  }

  return (
    <nav
      className={`sticky top-0 z-50 glass-card border-b px-4 py-3 ${
        isDark ? 'glass-card-dark' : 'glass-card-light'
      }`}
    >
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group" aria-label="NamazGo home">
          <HiMoon className="text-gold text-2xl group-hover:scale-110 transition-transform" aria-hidden />
          <span className="font-amiri text-2xl font-bold gold-gradient-text">NamazGo</span>
        </Link>

        <div className="flex items-center gap-2">
          {canInstall !== false && deferredPrompt && (
            <button
              onClick={handleInstall}
              className="p-2 rounded-xl hover:bg-gold/10 transition-colors text-gold"
              title="Install App"
              aria-label="Install App"
            >
              <HiArrowDownTray className="text-xl" />
            </button>
          )}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl hover:bg-gold/10 transition-colors"
            title={isDark ? 'Light mode' : 'Dark mode'}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <HiSun className="text-xl text-gold" />
            ) : (
              <HiMoon className="text-xl text-green-islam" />
            )}
          </button>
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl hover:bg-gold/10 transition-colors"
            title="Settings"
            aria-label="Settings"
          >
            <HiCog6Tooth className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-700'}`} />
          </button>
        </div>
      </div>
    </nav>
  )
}
