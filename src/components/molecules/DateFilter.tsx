import { useEffect, useState } from 'react'
import { getAvailableYears } from '../../services/patientService'

interface DateFilterProps {
  dateFilter: string
  onDateFilterChange: (year: string) => Promise<void>
}

export function DateFilter({ dateFilter, onDateFilterChange }: DateFilterProps) {
  const [years, setYears] = useState<number[]>([])

  useEffect(() => {
    getAvailableYears().then(setYears).catch(() => setYears([]))
  }, [])

  const options = ['all', ...years.map(String)]

  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      {options.map(year => (
        <button
          key={year}
          onClick={() => onDateFilterChange(year)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{
            backgroundColor: dateFilter === year ? 'var(--accent)' : 'var(--bg-card)',
            color: dateFilter === year ? 'white' : 'var(--text-secondary)',
            border: `1px solid ${dateFilter === year ? 'var(--accent)' : 'var(--bg-card-border)'}`,
            transition: 'background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease',
          }}
        >
          {year === 'all' ? 'Todos los años' : year}
        </button>
      ))}
    </div>
  )
}
