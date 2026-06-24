interface NavbarProps {
  darkMode: boolean
  onToggleDarkMode: () => void
  viewMode: 'grid' | 'list'
  onToggleViewMode: () => void
  onAddPatient: () => void
  search: string
  onSearchChange: (value: string) => void
  sortOption: 'az' | 'za'
  onSortChange: (value: 'az' | 'za') => void
}

export function Navbar({ darkMode, onToggleDarkMode, viewMode, onToggleViewMode, onAddPatient, search, onSearchChange, sortOption, onSortChange }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 navbar-gradient">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16d-xl flex items-center justify-center overflow-hidden navbar-icon-box">
              <img src="/logo.jpg" alt="Clinix" className="w-16 h-16-contain rounded-xl" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white tracking-tight">Clinix</h1>
              <p className="text-xs navbar-subtitle">Gestión de pacientes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onAddPatient} className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 btn-add-patient">
              + Nuevo paciente
            </button>
            <button onClick={onToggleViewMode} className="w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all hover:scale-105 navbar-icon-btn text-white">
              {viewMode === 'grid' ? '☰' : '⊞'}
            </button>
            <button onClick={onToggleDarkMode} className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 navbar-icon-btn">
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm navbar-search-icon">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Buscar paciente por nombre..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 navbar-input"
            />
            {search && (
              <button onClick={() => onSearchChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white">×</button>
            )}
          </div>
          <select
            value={sortOption}
            onChange={e => onSortChange(e.target.value as 'az' | 'za')}
            className="px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/30 navbar-input"
          >
            <option value="az" className="navbar-select-option">A → Z</option>
            <option value="za" className="navbar-select-option">Z → A</option>
          </select>
        </div>
      </div>
    </header>
  )
}