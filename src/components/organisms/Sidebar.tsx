import { useClinicStore } from '../../store/useClinicStore'

interface SidebarProps {
  darkMode: boolean
  onToggleDarkMode: () => void
  onAddPatient: () => void
}

export function Sidebar({ darkMode, onToggleDarkMode, onAddPatient }: SidebarProps) {
  const { sidebarOpen, setSidebarOpen } = useClinicStore()

  const SidebarContent = ({ onClose }: { onClose?: () => void }) => (
    <div className="flex flex-col h-full sidebar-bg">
      <div className="p-5 border-b sidebar-border flex flex-col items-center text-center relative">
        <button
          onClick={onClose ?? (() => setSidebarOpen(false))}
          className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm"
        >
          ✕
        </button>
        <img src="/logo.jpg" alt="Clinix" className="w-14 h-14 object-contain rounded-xl mb-3" />
        <h1 className="font-display text-xl font-bold text-white tracking-wide">CLINIX</h1>
        <p className="text-xs mt-0.5 sidebar-subtitle">Sistema de Gestión Clínica</p>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1">
        <button
          onClick={() => { onAddPatient(); onClose?.() }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white transition-all hover:bg-white/10 sidebar-nav-active"
        >
          <span className="text-lg">👥</span>
          Pacientes
        </button>
      </nav>

      <div className="p-4 border-t sidebar-border">
        <button
          onClick={onToggleDarkMode}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white transition-all hover:bg-white/10"
        >
          <span className="text-lg">{darkMode ? '☀️' : '🌙'}</span>
          {darkMode ? 'Modo claro' : 'Modo oscuro'}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Botón hamburguesa — solo visible cuando sidebar cerrado, solo en mobile */}
      {!sidebarOpen && (
        <button
          className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg sidebar-bg"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>
      )}

      {/* Botón abrir en desktop — solo visible cuando sidebar cerrado */}
      {!sidebarOpen && (
        <button
          className="hidden lg:flex fixed top-6 left-6 z-50 w-10 h-10 rounded-xl items-center justify-center text-white shadow-lg sidebar-bg"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>
      )}

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar mobile */}
      {sidebarOpen && (
        <div className="lg:hidden fixed left-0 top-0 h-full w-64 z-50 animate-slideIn">
          <SidebarContent onClose={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar desktop */}
      {sidebarOpen && (
        <div className="hidden lg:flex w-64 flex-shrink-0 h-screen sticky top-0">
          <div className="w-full">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  )
}