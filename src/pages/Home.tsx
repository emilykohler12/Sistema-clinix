import { useEffect, useRef, useCallback, useState } from 'react'
import { PatientCard } from '../components/organisms/PatientCard'
import { ConfirmModal } from '../components/organisms/ConfirmModal'
import { PatientDetailModal } from '../components/organisms/PatientDetailModal'
import { Sidebar } from '../components/organisms/Sidebar'
import { PatientCardSkeleton } from '../components/atoms/Skeleton'
import { StatsBar } from '../components/organisms/StatsBar'
import { ProgressBar } from '../components/atoms/ProgressBar'
import { SearchBar } from '../components/molecules/SearchBar'
import { DateFilter } from '../components/molecules/DateFilter'
import { FilterBar } from '../components/molecules/FilterBar'
import { useClinicStore } from '../store/useClinicStore'
import { useDebounce } from '../hooks/useDebounce'
import type { Patient, SortOption, ViewMode } from '../types'

export function Home() {
  const {
    patients, totalCount, loading, error, hasMore, loadMore, searchPatients, resetAndLoad,
    deletePatient, isFavorite, toggleFavorite, favorites,
    addToast, openEdit, openAdd,
    dateFilter, setDateFilter, isFiltered, sidebarOpen,
    filters, setFilters, doctors, loadDoctors,
  } = useClinicStore()

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('clinix_theme') === 'dark')
  const [viewMode, setViewMode] = useState<ViewMode>(() => (localStorage.getItem('clinix_view') as ViewMode) ?? 'grid')
  const [search, setSearch] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('az')
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [showingFavoritesOnly, setShowingFavoritesOnly] = useState(false)
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)

  const debouncedSearch = useDebounce(search, 300)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const initialized = useRef(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const isChangingView = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      loadMore()
      loadDoctors()
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('clinix_theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('clinix_view', viewMode)
  }, [viewMode])

  useEffect(() => {
    if (debouncedSearch.trim() === '') {
      if (isSearchMode) {
        setIsSearchMode(false)
        resetAndLoad()
      }
      return
    }
    setIsSearchMode(true)
    searchPatients(debouncedSearch)
  }, [debouncedSearch])

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    if (
      entries[0].isIntersecting &&
      hasMore &&
      !loading &&
      !isSearchMode &&
      !isFiltered &&
      !isChangingView.current &&
      !showingFavoritesOnly
    ) {
      loadMore()
    }
  }, [hasMore, loading, isSearchMode, isFiltered, showingFavoritesOnly])

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect()
    observerRef.current = new IntersectionObserver(handleObserver, { threshold: 0.1 })
    if (bottomRef.current) observerRef.current.observe(bottomRef.current)
    return () => observerRef.current?.disconnect()
  }, [handleObserver])

  const sortedPatients = [...patients].sort((a, b) => {
    if (sortOption === 'za') return b.name.trim().localeCompare(a.name.trim())
    return a.name.trim().localeCompare(b.name.trim())
  })

  const displayedPatients = showingFavoritesOnly
    ? sortedPatients.filter(p => isFavorite(p.id))
    : sortedPatients

  function handleDelete() {
    if (!patientToDelete) return
    const id = patientToDelete.id
    setRemovingId(id)
    setPatientToDelete(null)
    setTimeout(async () => {
      try {
        await deletePatient(id)
        addToast('Paciente eliminado', 'success')
      } catch {
        addToast('No se pudo eliminar el paciente', 'error')
      } finally {
        setRemovingId(null)
      }
    }, 250)
  }

  function handleViewModeToggle() {
    isChangingView.current = true
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid')
    setTimeout(() => { isChangingView.current = false }, 500)
  }

  function handleClearAll() {
    setShowingFavoritesOnly(false)
    setSearch('')
    setDateFilter('all')
    setFilters({})
  }

  function handleRetry() {
    if (isSearchMode) {
      searchPatients(debouncedSearch)
    } else if (isFiltered) {
      setDateFilter(dateFilter)
    } else {
      resetAndLoad()
    }
  }

  const gridClass = viewMode === 'grid'
    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'
    : 'flex flex-col gap-2'

  const hasActiveFilters = Object.values(filters).some(Boolean)
  const hasDateFilter = dateFilter !== 'all'
  const showClearButton = isFiltered || isSearchMode || hasActiveFilters

  let sectionTitle: string
  if (isSearchMode) {
    sectionTitle = `${totalCount} resultado${totalCount !== 1 ? 's' : ''} para "${debouncedSearch}"`
  } else if (hasDateFilter && !hasActiveFilters) {
    sectionTitle = `Pacientes del año ${dateFilter}`
  } else if (hasDateFilter || hasActiveFilters) {
    sectionTitle = 'Pacientes filtrados'
  } else if (showingFavoritesOnly) {
    sectionTitle = 'Pacientes favoritos'
  } else {
    sectionTitle = 'Todos los pacientes'
  }

  let emptyMessage: string
  if (isSearchMode) {
    emptyMessage = `No se encontraron pacientes con "${debouncedSearch}"`
  } else if (hasDateFilter && !hasActiveFilters) {
    emptyMessage = `No hay pacientes registrados en ${dateFilter}`
  } else if (hasDateFilter || hasActiveFilters) {
    emptyMessage = 'No se encontraron pacientes con esos filtros'
  } else if (showingFavoritesOnly) {
    emptyMessage = 'No tenés pacientes favoritos'
  } else {
    emptyMessage = 'No se encontraron pacientes'
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-page)' }}>
      <Sidebar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(prev => !prev)}
      />

      <div className="flex-1 min-w-0">
        <ProgressBar loading={loading} />

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              {/* Espacio para el botón hamburguesa cuando sidebar está cerrado */}
              {!sidebarOpen && (
                <div className="w-10 h-10 flex-shrink-0 lg:hidden" />
              )}
              <div>
                <h2 className="text-2xl font-bold text-primary">Pacientes</h2>
                <p className="text-sm text-secondary">Gestión del historial clínico</p>
              </div>
            </div>
            <SearchBar
              search={search}
              onSearchChange={setSearch}
              sortOption={sortOption}
              onSortChange={setSortOption}
              viewMode={viewMode}
              onViewModeToggle={handleViewModeToggle}
              onAddPatient={openAdd}
            />
          </div>

          <StatsBar
            total={totalCount}
            favorites={favorites.length}
            showingFavoritesOnly={showingFavoritesOnly}
            onSelectAll={() => setShowingFavoritesOnly(false)}
            onSelectFavorites={() => setShowingFavoritesOnly(prev => !prev)}
          />

          <DateFilter
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
          />

          <FilterBar filters={filters} onChange={setFilters} doctors={doctors} />

          <section>
            <h3 className="font-bold mb-3 flex items-center gap-2 text-primary">
              {sectionTitle}
              <span className="badge-id text-xs px-2 py-0.5 rounded-full font-sans font-medium">
                {displayedPatients.length}
              </span>
              {showClearButton && (
                <button
                  onClick={handleClearAll}
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
                  onClick={handleRetry}
                  className="px-4 py-2 text-sm text-white rounded-lg btn-save-gradient"
                >
                  Reintentar
                </button>
              </div>
            )}

            {!error && displayedPatients.length === 0 && !loading && (
              <div className="text-center py-16 flex flex-col items-center gap-3">
                <p className="font-bold text-lg text-primary">{emptyMessage}</p>
                {showClearButton && (
                  <button onClick={handleClearAll} className="badge-id text-sm px-4 py-2 rounded-lg">
                    Ver todos los pacientes
                  </button>
                )}
              </div>
            )}

            <div className={`${gridClass} transition-opacity duration-300 ${loading ? 'opacity-40' : 'opacity-100'}`}>
              {displayedPatients.map(p => (
                <PatientCard
                  key={p.id}
                  patient={p}
                  isFavorite={isFavorite(p.id)}
                  isRemoving={removingId === p.id}
                  onToggleFavorite={toggleFavorite}
                  onEdit={openEdit}
                  onDelete={setPatientToDelete}
                  onViewDetail={(p) => setSelectedPatientId(p.id)}
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

      {selectedPatientId && patients.find(p => p.id === selectedPatientId) && (
        <PatientDetailModal
          patient={patients.find(p => p.id === selectedPatientId)!}
          onClose={() => setSelectedPatientId(null)}
        />
      )}
    </div>
  )
}
