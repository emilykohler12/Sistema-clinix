import { StatCard } from '../molecules/StatCard'

interface StatsBarProps {
  total: number
  favorites: number
  addedThisSession: number
  showingNewOnly: boolean
  onToggleNewOnly: () => void
}

export function StatsBar({ total, favorites, addedThisSession, showingNewOnly, onToggleNewOnly }: StatsBarProps) {
  const cards = [
    { label: 'Total pacientes', value: total, icon: '👥', color: '#4c6f87', clickable: false },
    { label: 'Favoritos', value: favorites, icon: '⭐', color: '#f59e0b', clickable: false },
    { label: 'Agregados hoy', value: addedThisSession, icon: '✚', color: '#6aa6aa', clickable: true },
  ]

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {cards.map(card => (
        <StatCard
          key={card.label}
          label={card.label}
          value={card.value}
          icon={card.icon}
          color={card.color}
          clickable={card.clickable}
          active={showingNewOnly}
          onClick={onToggleNewOnly}
        />
      ))}
    </div>
  )
}