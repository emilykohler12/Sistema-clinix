import { useEffect, useState } from 'react'
import { Sidebar } from '../components/organisms/Sidebar'
import { PatientCard } from '../components/organisms/PatientCard'
import { PatientCardSkeleton } from '../components/atoms/Skeleton'
import { useClinicStore } from '../store/useClinicStore'

export function Archived() {
  const { archivedPatients, archivedLoading, loadArchived, restorePatient, sidebarOpen } = useClinicStore()
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('clinix_theme') === 'dark')

  useEffect(() => {
    loadArchived()
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('clinix_theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-page)' }}>
      <Sidebar darkMode={darkMode} onToggleDarkMode={() => setDarkMode(prev => !prev)} />

      <div className="flex-1 min-w-0">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6">
            {!sidebarOpen && <div className="w-10 h-10 flex-shrink-0" />}
            <div>
              <h2 className="text-2xl font-bold text-primary">Archivados</h2>
              <p className="text-sm text-secondary">Pacientes eliminados — se pueden restaurar</p>
            </div>
          </div>

          {!archivedLoading && archivedPatients.length === 0 && (
            <div className="text-center py-16 flex flex-col items-center gap-3">
              <p className="font-bold text-lg text-primary">No hay pacientes archivados</p>
              <p className="text-sm text-secondary">Los pacientes que elimines van a aparecer acá</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {archivedPatients.map(p => (
              <PatientCard
                key={p.id}
                patient={p}
                isFavorite={false}
                onToggleFavorite={() => {}}
                onEdit={() => {}}
                onDelete={() => {}}
                onViewDetail={() => {}}
                archived
                onRestore={(patient) => restorePatient(patient.id)}
              />
            ))}
            {archivedLoading && Array.from({ length: 3 }).map((_, i) => <PatientCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
