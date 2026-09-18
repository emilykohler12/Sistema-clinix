import { StatCard } from '../molecules/StatCard'

interface StatsBarProps {
  total: number
  favorites: number
  showingFavoritesOnly: boolean
  onSelectAll: () => void
  onSelectFavorites: () => void
}

export function StatsBar({ total, favorites, showingFavoritesOnly, onSelectAll, onSelectFavorites }: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-6">
      <StatCard label="Total" value={total} active={!showingFavoritesOnly} onClick={onSelectAll} />
      <StatCard label="Favoritos" value={favorites} active={showingFavoritesOnly} onClick={onSelectFavorites} />
    </div>
  )
}
