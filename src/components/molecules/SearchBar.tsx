import type { SortOption, ViewMode } from '../../types'

interface SearchBarProps {
  search: string
  onSearchChange: (value: string) => void
  sortOption: SortOption
  onSortChange: (value: SortOption) => void
  viewMode: ViewMode
  onViewModeToggle: () => void
  onAddPatient: () => void
}

export function SearchBar({ search, onSearchChange, sortOption, onSortChange, viewMode, onViewModeToggle, onAddPatient }: SearchBarProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">🔍</span>
        <input
          type="text"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Buscar paciente..."
          className="navbar-input pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 text-primary"
          style={{ minWidth: '200px' }}
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
          >
            ×
          </button>
        )}
      </div>
      <select
        value={sortOption}
        onChange={e => onSortChange(e.target.value as SortOption)}
        className="card px-3 py-2 rounded-xl text-sm focus:outline-none text-primary"
      >
        <option value="az">A → Z</option>
        <option value="za">Z → A</option>
      </select>
      <button
        onClick={onViewModeToggle}
        className="card w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 text-primary"
      >
        {viewMode === 'grid' ? '☰' : '⊞'}
      </button>
      <button
        onClick={onAddPatient}
        className="btn-save-gradient px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
      >
        + Nuevo Paciente
      </button>
    </div>
  )
}