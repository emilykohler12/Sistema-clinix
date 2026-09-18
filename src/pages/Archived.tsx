import { useEffect, useState } from 'react'
import { Sidebar } from '../components/organisms/Sidebar'
import { PatientCard } from '../components/organisms/PatientCard'
import { PatientCardSkeleton } from '../components/atoms/Skeleton'
import { Avatar } from '../components/atoms/Avatar'
import { useClinicStore } from '../store/useClinicStore'

type Tab = 'pacientes' | 'medicos'

export function Archived() {
  const {
    archivedPatients, archivedLoading, loadArchived, restorePatient,
    archivedDoctors, archivedDoctorsLoading, loadArchivedDoctors, restoreDoctor,
  } = useClinicStore()
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('clinix_theme') === 'dark')
  const [tab, setTab] = useState<Tab>('pacientes')

  useEffect(() => {
    loadArchived()
    loadArchivedDoctors()
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('clinix_theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const tabClass = (active: boolean) =>
    `px-4 py-2 rounded-xl text-sm font-medium transition-all ${active ? 'btn-save-gradient text-white' : 'card text-secondary'}`

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-page)' }}>
      <Sidebar darkMode={darkMode} onToggleDarkMode={() => setDarkMode(prev => !prev)} />

      <div className="flex-1 min-w-0">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-primary">Archivados</h2>
              <p className="text-sm text-secondary">Se pueden restaurar en cualquier momento</p>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <button className={tabClass(tab === 'pacientes')} onClick={() => setTab('pacientes')}>
              Pacientes {archivedPatients.length > 0 && `(${archivedPatients.length})`}
            </button>
            <button className={tabClass(tab === 'medicos')} onClick={() => setTab('medicos')}>
              Profesionales {archivedDoctors.length > 0 && `(${archivedDoctors.length})`}
            </button>
          </div>

          {tab === 'pacientes' && (
            <>
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
            </>
          )}

          {tab === 'medicos' && (
            <>
              {!archivedDoctorsLoading && archivedDoctors.length === 0 && (
                <div className="text-center py-16 flex flex-col items-center gap-3">
                  <p className="font-bold text-lg text-primary">No hay profesionales archivados</p>
                  <p className="text-sm text-secondary">Los profesionales que elimines van a aparecer acá</p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {archivedDoctors.map(d => (
                  <div key={d.id} className="card rounded-2xl p-4 flex items-center gap-3">
                    <Avatar avatar={d.avatar ?? ''} name={d.name} id={d.id} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate text-primary">{d.name}</p>
                      <p className="text-xs truncate text-muted">{d.email}</p>
                    </div>
                    <button
                      onClick={() => restoreDoctor(d.id)}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium icon-btn-edit flex-shrink-0"
                    >
                      Restaurar
                    </button>
                  </div>
                ))}
                {archivedDoctorsLoading && <p className="text-secondary">Cargando...</p>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
