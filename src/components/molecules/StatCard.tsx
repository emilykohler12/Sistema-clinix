interface StatCardProps {
  label: string
  value: number
  active?: boolean
  onClick?: () => void
}

export function StatCard({ label, value, active = false, onClick }: StatCardProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl p-2 sm:p-4 flex flex-col items-start text-left transition-all hover:shadow-md stat-card ${active ? 'active' : ''}`}
    >
      <p className="text-lg sm:text-2xl font-bold stat-value leading-none">{value}</p>
      <p className="text-xs text-muted truncate mt-1">{label}</p>
    </button>
  )
}
