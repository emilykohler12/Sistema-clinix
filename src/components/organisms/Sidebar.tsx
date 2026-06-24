import { useState } from 'react'

interface SidebarProps {
  darkMode: boolean
  onToggleDarkMode: () => void
  onAddPatient: () => void
}

export function Sidebar({ darkMode, onToggleDarkMode, onAddPatient }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const SidebarContent = () => (
    <div className="flex flex-col h-full sidebar-bg">
      <div className="p-5 border-b sidebar-border">
        <img src="/logo.jpg" alt="Clinix" className="w-12 h-12 object-contain rounded-xl mb-3" />
        <h1 className="font-display text-xl font-bold text-white tracking-wide">CLINIX</h1>
        <p className="text-xs mt-0.5 sidebar-subtitle">Sistema de Gestión Clínica</p>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1">
        <button
          onClick={() => { onAddPatient(); setMobileOpen(false) }}
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
      <button
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg sidebar-bg"
        onClick={() => setMobileOpen(true)}
      >
        ☰
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {mobileOpen && (
        <div className="lg:hidden fixed left-0 top-0 h-full w-64 z-50 animate-slideIn">
          <SidebarContent />
        </div>
      )}

      <div className="hidden lg:flex w-64 flex-shrink-0 h-screen sticky top-0">
        <div className="w-full">
          <SidebarContent />
        </div>
      </div>
    </>
  )
}