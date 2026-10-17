import { HiPlus, HiXMark } from 'react-icons/hi2'

const FAVORITES_KEY = 'namazgo-favorites'

export const loadFavorites = () => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export const saveFavorites = (favorites) => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
}

export default function FavoriteCities({
  favorites,
  onSelect,
  onAdd,
  onRemove,
  currentLocation,
  isDark,
}) {
  const isCurrentSaved = favorites.some(
    (f) => f.city === currentLocation?.city && f.country === currentLocation?.country
  )

  return (
    <section className="px-4 pb-8">
      <div className="max-w-2xl mx-auto">
        <h3 className={`font-amiri text-lg mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Favorite Cities
        </h3>
        <div className="flex flex-wrap gap-2">
          {favorites.map((fav) => (
            <button
              key={`${fav.city}-${fav.country}`}
              onClick={() => onSelect(fav)}
              className={`group flex items-center gap-1 px-4 py-2 rounded-full text-sm transition-all ${
                currentLocation?.city === fav.city
                  ? 'bg-gold/20 border border-gold/40 text-gold'
                  : isDark
                    ? 'bg-dark-surface border border-dark-border text-gray-300 hover:border-gold/30'
                    : 'bg-white border border-green-islam/20 text-gray-700 hover:border-green-islam/40'
              }`}
            >
              {fav.display || `${fav.city}, ${fav.country}`}
              <HiXMark
                className="opacity-0 group-hover:opacity-100 transition-opacity text-xs ml-1"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(fav)
                }}
              />
            </button>
          ))}
          {currentLocation?.city && !isCurrentSaved && (
            <button
              onClick={onAdd}
              className="flex items-center gap-1 px-4 py-2 rounded-full text-sm border border-dashed border-gold/40 text-gold hover:bg-gold/10 transition-all"
            >
              <HiPlus className="text-sm" />
              Add {currentLocation.city}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
