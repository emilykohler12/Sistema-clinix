import type { CSSProperties } from 'react'

interface StatCardProps {
  label: string
  value: number
  icon: string
  color: string
  clickable?: boolean
  active?: boolean
  onClick?: () => void
}

export function StatCard({ label, value, icon, color, clickable = false, active = false, onClick }: StatCardProps) {
  return (
    <div
      onClick={clickable ? onClick : undefined}
      className={`rounded-2xl p-2 sm:p-4 flex items-center gap-2 sm:gap-3 transition-all hover:shadow-md stat-card ${clickable ? 'stat-card-clickable hover:scale-105' : ''} ${active && clickable ? 'active' : ''}`}
      style={{ '--stat-color': color } as CSSProperties}
    >
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-base sm:text-lg flex-shrink-0 stat-icon">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-lg sm:text-2xl font-bold font-display stat-value leading-none">{value}</p>
        <p className="text-xs text-muted truncate">{label}</p>
      </div>
      {clickable && (
        <span className="text-sm stat-arrow hidden sm:block">
          {active ? '✕' : '→'}
        </span>
      )}
    </div>
  )
}