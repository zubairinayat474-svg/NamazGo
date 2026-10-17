import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiXMark } from 'react-icons/hi2'
import { calculationMethods } from '../data/prayers'
import { defaultSettings } from '../utils/api'
import { useFocusTrap } from '../hooks/useFocusTrap'

export default function SettingsDrawer({ isOpen, onClose, settings, onUpdate, isDark, onEnableNotifications }) {
  const panelRef = useRef(null)
  useFocusTrap(isOpen, onClose, panelRef)

  const update = (key, value) => {
    onUpdate({ ...settings, [key]: value })
  }

  const handleReminderChange = async (value) => {
    const minutes = Number(value)
    update('notificationMinutes', minutes)
    if (minutes > 0 && onEnableNotifications) {
      await onEnableNotifications()
    }
  }

  const handleReset = () => {
    onUpdate(defaultSettings)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-drawer-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed right-0 top-0 h-full w-full max-w-sm z-50 overflow-y-auto ${
              isDark ? 'bg-dark-surface' : 'bg-white'
            } shadow-2xl`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2
                  id="settings-drawer-title"
                  className={`font-amiri text-2xl ${isDark ? 'text-gray-100' : 'text-gray-900'}`}
                >
                  Settings
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-gold/10"
                  aria-label="Close settings"
                >
                  <HiXMark className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="calc-method"
                    className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    Calculation Method
                  </label>
                  <select
                    id="calc-method"
                    value={settings.method}
                    onChange={(e) => update('method', Number(e.target.value))}
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:border-gold/50 ${
                      isDark
                        ? 'bg-dark-bg border-dark-border text-gray-300'
                        : 'bg-light-bg border-green-islam/20 text-gray-700'
                    }`}
                  >
                    {calculationMethods.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="asr-school"
                    className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    Asr Juristic Method
                  </label>
                  <select
                    id="asr-school"
                    value={settings.school}
                    onChange={(e) => update('school', Number(e.target.value))}
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:border-gold/50 ${
                      isDark
                        ? 'bg-dark-bg border-dark-border text-gray-300'
                        : 'bg-light-bg border-green-islam/20 text-gray-700'
                    }`}
                  >
                    <option value={0}>Standard (Shafi, Maliki, Hanbali)</option>
                    <option value={1}>Hanafi</option>
                  </select>
                </div>

                <div>
                  <span className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Time Format
                  </span>
                  <div className="flex gap-2" role="group" aria-label="Time format">
                    {['12', '24'].map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => update('timeFormat', fmt)}
                        aria-pressed={settings.timeFormat === fmt}
                        className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                          settings.timeFormat === fmt
                            ? 'bg-gold/20 border border-gold/40 text-gold'
                            : isDark
                              ? 'bg-dark-bg border border-dark-border text-gray-400'
                              : 'bg-light-bg border border-green-islam/20 text-gray-600'
                        }`}
                      >
                        {fmt === '12' ? '12 Hour' : '24 Hour'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="prayer-reminder"
                    className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    Prayer Reminder
                  </label>
                  <select
                    id="prayer-reminder"
                    value={settings.notificationMinutes}
                    onChange={(e) => handleReminderChange(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:border-gold/50 ${
                      isDark
                        ? 'bg-dark-bg border-dark-border text-gray-300'
                        : 'bg-light-bg border-green-islam/20 text-gray-700'
                    }`}
                  >
                    <option value={0}>Off</option>
                    <option value={5}>5 minutes before</option>
                    <option value={10}>10 minutes before</option>
                    <option value={15}>15 minutes before</option>
                  </select>
                  <p className={`mt-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Reminders work while NamazGo is open in a browser tab.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className={`w-full py-3 rounded-xl text-sm border transition-all ${
                    isDark
                      ? 'border-dark-border text-gray-400 hover:border-gold/30 hover:text-gold'
                      : 'border-green-islam/20 text-gray-600 hover:border-green-islam/40'
                  }`}
                >
                  Reset to Default
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
