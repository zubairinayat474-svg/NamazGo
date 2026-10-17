const normalizeAngle = (deg) => ((deg % 360) + 360) % 360

export default function QiblaCompass({
  direction,
  heading,
  loading,
  isDark,
  permissionState,
  onRequestPermission,
  isLive,
}) {
  const needsPermission = permissionState === 'prompt'
  const permissionDenied = permissionState === 'denied'
  const noSensor = permissionState === 'granted' && !isLive && !loading

  const needleRotation =
    isLive && heading != null && direction != null
      ? normalizeAngle(direction - heading)
      : (direction ?? 0)

  return (
    <section className="px-4 mb-6">
      <div className="max-w-2xl mx-auto">
        <div
          className={`glass-card p-6 text-center ${
            isDark ? 'glass-card-dark' : 'glass-card-light'
          }`}
        >
          <h3 className={`font-amiri text-xl mb-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            Qibla Direction
          </h3>

          {needsPermission && (
            <button
              type="button"
              onClick={onRequestPermission}
              className="mb-4 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-gold-dark to-gold text-black hover:opacity-90 transition-opacity"
            >
              Enable Compass
            </button>
          )}

          <div className="relative w-48 h-48 mx-auto mb-4">
            <div
              className={`absolute inset-0 rounded-full border-2 ${
                isDark ? 'border-gold/20' : 'border-green-islam/20'
              }`}
            />
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <div className="absolute inset-2 rounded-full border border-gold/10" />
                <span className="absolute top-1 left-1/2 -translate-x-1/2 text-xs text-gold font-mono">
                  N
                </span>
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-mono">
                  S
                </span>
                <span className="absolute left-1 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-mono">
                  W
                </span>
                <span className="absolute right-1 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-mono">
                  E
                </span>

                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    transform: `rotate(${needleRotation}deg)`,
                    transition: isLive ? 'transform 0.3s ease-out' : undefined,
                  }}
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div
                      className="w-1 h-20 bg-gradient-to-t from-gold-dark via-gold to-gold-light rounded-full origin-bottom"
                      style={{ transform: 'translateY(-40px)' }}
                    />
                    <div className="absolute w-4 h-4 bg-gold rounded-full shadow-lg shadow-gold/30" />
                    <span className="absolute -top-2 text-lg">🕋</span>
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-3 h-3 bg-gold/80 rounded-full border border-gold-light/50" />
                </div>
              </>
            )}
          </div>

          <p className="font-mono text-2xl font-bold gold-gradient-text">
            {loading ? '...' : `${direction ?? '--'}°`}
          </p>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Direction toward Mecca
          </p>

          {isLive && (
            <p className="text-sm mt-2 text-green-islam">Live compass active</p>
          )}

          {noSensor && (
            <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Open on a phone for live compass — most laptops have no compass sensor
            </p>
          )}

          {permissionDenied && (
            <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Compass access denied. Enable motion sensors in your browser settings.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
