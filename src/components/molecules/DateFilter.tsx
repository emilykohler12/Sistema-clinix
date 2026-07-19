import { useClinicStore } from '../../store/useClinicStore'

interface DateFilterProps {
  dateFilter: string
  onDateFilterChange: (year: string) => Promise<void>
}

export function DateFilter({ dateFilter, onDateFilterChange }: DateFilterProps) {
  const { apiPatients, localPatients } = useClinicStore()

  const allForYears = [...apiPatients, ...localPatients]
  const dynamicYears = Array.from(
    new Set(allForYears.map(p => new Date(p.createdAt).getFullYear().toString()))
  ).sort()

  const years = ['all', ...dynamicYears]

  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      {years.map(year => (
        <button
          key={year}
          onClick={() => onDateFilterChange(year)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            backgroundColor: dateFilter === year ? '#4c6f87' : 'var(--bg-card)',
            color: dateFilter === year ? 'white' : 'var(--text-secondary)',
            border: `1px solid ${dateFilter === year ? '#4c6f87' : 'var(--bg-card-border)'}`,
          }}
        >
          {year === 'all' ? 'Todos los años' : year}
        </button>
      ))}
    </div>
  )
}