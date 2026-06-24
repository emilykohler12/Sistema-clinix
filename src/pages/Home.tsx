import { useEffect, useRef, useCallback, useState } from 'react'
import { useDebounce } from '../hooks/useDebounce'
import { PatientCard } from '../components/organisms/PatientCard'
import { ConfirmModal } from '../components/organisms/ConfirmModal'
import { Sidebar } from '../components/organisms/Sidebar'
import { PatientCardSkeleton } from '../components/atoms/Skeleton'
import { StatsBar } from '../components/organisms/StatsBar'
import { ProgressBar } from '../components/atoms/ProgressBar'
import { SearchBar } from '../components/molecules/SearchBar'
import { DateFilter } from '../components/molecules/DateFilter'
import { useClinicStore } from '../store/useClinicStore'
import type { Patient, SortOption, ViewMode } from '../types'

export function Home() {
  const {
    patients, loading, error, hasMore, loadMore,
    deletePatient, isFavorite, toggleFavorite, favorites,
    addToast, openEdit, openAdd, newPatientIds, removeNewPatientId,
  } = useClinicStore()

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('clinix_theme') === 'dark')
  const [viewMode, setViewMode] = useState<ViewMode>(() => (localStorage.getItem('clinix_view') as ViewMode) ?? 'grid')
  const [search, setSearch] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('az')
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null)
  const [showingNewOnly, setShowingNewOnly] = useState(false)
  const [dateFilter, setDateFilter] = useState<string>('all')

  const debouncedSearch = useDebounce(search, 300)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      loadMore()
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('clinix_theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('clinix_view', viewMode)
  }, [viewMode])

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && hasMore && !loading) loadMore()
  }, [hasMore, loading, loadMore])

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 })
    if (bottomRef.current) observer.observe(bottomRef.current)
    return () => observer.disconnect()
  }, [handleObserver])

  const filteredAndSorted = patients
    .filter(p => p.name.trim().toLowerCase().includes(debouncedSearch.toLowerCase()))
    .filter(p => showingNewOnly ? newPatientIds.has(p.id) : true)
    .filter(p => {
      if (dateFilter === 'all') return true
      return new Date(p.createdAt).getFullYear().toString() === dateFilter
    })
    .sort((a, b) => {
      if (sortOption === 'za') return b.name.trim().localeCompare(a.name.trim())
      return a.name.trim().localeCompare(b.name.trim())
    })

  const favoritePatients = filteredAndSorted.filter(p => isFavorite(p.id))
  const allPatients = filteredAndSorted.filter(p => !isFavorite(p.id))

  function handleDelete() {
    if (!patientToDelete) return
    deletePatient(patientToDelete.id)
    removeNewPatientId(patientToDelete.id)
    addToast('Paciente eliminado', 'success')
    setPatientToDelete(null)
  }

  const gridClass = viewMode === 'grid'
    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'
    : 'flex flex-col gap-2'

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-page)' }}>
      <Sidebar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(prev => !prev)}
        onAddPatient={openAdd}
      />

      <div className="flex-1 min-w-0">
        <ProgressBar loading={loading} />

        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-primary">Pacientes</h2>
              <p className="text-sm text-secondary">Gestión del historial clínico</p>
            </div>
            <SearchBar
              search={search}
              onSearchChange={setSearch}
              sortOption={sortOption}
              onSortChange={setSortOption}
              viewMode={viewMode}
              onViewModeToggle={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}
              onAddPatient={openAdd}
            />
          </div>

          <StatsBar
            total={patients.length}
            favorites={favorites.length}
            addedThisSession={newPatientIds.size}
            showingNewOnly={showingNewOnly}
            onToggleNewOnly={() => setShowingNewOnly(prev => !prev)}
          />

          <DateFilter
  dateFilter={dateFilter}
  onDateFilterChange={setDateFilter}
  patients={patients}
/>

          {favoritePatients.length > 0 && (
            <section className="mb-8">
              <h3 className="font-display font-bold mb-3 flex items-center gap-2 star-active">
                ⭐ Favoritos
                <span className="text-xs px-2 py-0.5 rounded-full font-sans font-medium" style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}>
                  {favoritePatients.length}
                </span>
              </h3>
              <div className={gridClass}>
                {favoritePatients.map(p => (
                  <PatientCard
                    key={p.id}
                    patient={p}
                    isFavorite={true}
                    isNew={newPatientIds.has(p.id)}
                    onToggleFavorite={toggleFavorite}
                    onEdit={openEdit}
                    onDelete={setPatientToDelete}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            </section>
          )}

          <section>
            <h3 className="font-display font-bold mb-3 flex items-center gap-2 text-primary">
              {showingNewOnly ? '✚ Agregados en esta sesión' : 'Todos los pacientes'}
              <span className="badge-id text-xs px-2 py-0.5 rounded-full font-sans font-medium">
                {allPatients.length}
              </span>
              {showingNewOnly && (
                <button
                  onClick={() => setShowingNewOnly(false)}
                  className="icon-btn-delete text-xs px-2 py-0.5 rounded-full ml-1 font-sans"
                >
                  × Limpiar
                </button>
              )}
            </h3>

            {error && (
              <div className="text-center py-12">
                <p className="text-error mb-3">{error}</p>
                <button
                  onClick={loadMore}
                  className="px-4 py-2 text-sm text-white rounded-lg"
                  style={{ backgroundColor: '#4c6f87' }}
                >
                  Reintentar
                </button>
              </div>
            )}

            {!error && allPatients.length === 0 && !loading && (
              <div className="text-center py-16 flex flex-col items-center gap-3">
                <span className="text-5xl">{showingNewOnly ? '✚' : '🔍'}</span>
                <p className="font-display font-bold text-lg text-primary">
                  {showingNewOnly ? 'No agregaste pacientes en esta sesión' : 'No se encontraron pacientes'}
                </p>
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="badge-id text-sm px-4 py-2 rounded-lg"
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            )}

            <div className={gridClass}>
              {allPatients.map(p => (
                <PatientCard
                  key={p.id}
                  patient={p}
                  isFavorite={false}
                  isNew={newPatientIds.has(p.id)}
                  onToggleFavorite={toggleFavorite}
                  onEdit={openEdit}
                  onDelete={setPatientToDelete}
                  viewMode={viewMode}
                />
              ))}
              {loading && Array.from({ length: 6 }).map((_, i) => <PatientCardSkeleton key={i} />)}
            </div>
            <div ref={bottomRef} className="h-4" />
          </section>
        </div>
      </div>

      {patientToDelete && (
        <ConfirmModal
          patientName={patientToDelete.name}
          onConfirm={handleDelete}
          onClose={() => setPatientToDelete(null)}
        />
      )}
    </div>
  )
}