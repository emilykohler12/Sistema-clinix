import { NavLink, useNavigate } from 'react-router-dom'
import { useClinicStore } from '../../store/useClinicStore'
import type { AuthUser } from '../../types'
import {
  IconUsers, IconCalendar, IconArchive, IconStethoscope,
  IconSun, IconMoon, IconLogout, IconChevronLeft, IconChevronRight, IconClose,
} from '../atoms/icons'

interface SidebarProps {
  darkMode: boolean
  onToggleDarkMode: () => void
}

const navItems = [
  { to: '/', end: true, label: 'Pacientes', Icon: IconUsers },
  { to: '/calendario', end: false, label: 'Calendario', Icon: IconCalendar },
  { to: '/archivados', end: false, label: 'Archivados', Icon: IconArchive },
  { to: '/profesionales', end: false, label: 'Profesionales', Icon: IconStethoscope },
]

const railLinkClass = ({ isActive }: { isActive: boolean }) =>
  `w-10 h-10 rounded-xl flex items-center justify-center transition-all sidebar-rail-icon ${isActive ? 'active' : ''}`

const wideLinkClass = ({ isActive }: { isActive: boolean }) =>
  `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white transition-all hover:bg-white/10 ${isActive ? 'sidebar-nav-active' : ''}`

interface RailContentProps {
  darkMode: boolean
  onToggleDarkMode: () => void
  onLogout: () => void
  onExpand: () => void
}

function RailContent({ darkMode, onToggleDarkMode, onLogout, onExpand }: RailContentProps) {
  return (
    <div className="flex flex-col items-center h-full sidebar-rail-bg py-4 gap-2">
      <img src="/logo.jpg" alt="Clinix" className="w-9 h-9 object-contain rounded-lg mb-2" />
      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map(({ to, end, label, Icon }) => (
          <NavLink key={to} to={to} end={end} className={railLinkClass} title={label}>
            <Icon />
          </NavLink>
        ))}
      </nav>
      <button onClick={onToggleDarkMode} className="w-10 h-10 rounded-xl flex items-center justify-center sidebar-rail-icon" title="Cambiar tema">
        {darkMode ? <IconSun /> : <IconMoon />}
      </button>
      <button onClick={onLogout} className="w-10 h-10 rounded-xl flex items-center justify-center sidebar-rail-icon" title="Cerrar sesión">
        <IconLogout />
      </button>
      <button onClick={onExpand} className="w-10 h-10 rounded-xl flex items-center justify-center sidebar-rail-icon" title="Expandir">
        <IconChevronRight />
      </button>
    </div>
  )
}

interface WideContentProps {
  darkMode: boolean
  onToggleDarkMode: () => void
  onLogout: () => void
  authUser: AuthUser | null
  onClose?: () => void
}

function WideContent({ darkMode, onToggleDarkMode, onLogout, authUser, onClose }: WideContentProps) {
  return (
    <div className="flex flex-col h-full sidebar-bg">
      <div className="p-5 border-b sidebar-border flex flex-col items-center text-center relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          {onClose ? <IconClose /> : <IconChevronLeft />}
        </button>
        <img src="/logo.jpg" alt="Clinix" className="w-14 h-14 object-contain rounded-xl mb-3" />
        <h1 className="text-xl font-bold text-white tracking-wide">CLINIX</h1>
        <p className="text-xs mt-0.5 sidebar-subtitle">Sistema de Gestión Clínica</p>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1">
        {navItems.map(({ to, end, label, Icon }) => (
          <NavLink key={to} to={to} end={end} onClick={onClose} className={wideLinkClass}>
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t sidebar-border flex flex-col gap-1">
        {authUser && (
          <div className="px-4 pb-2 text-white/80">
            <p className="text-sm font-medium truncate">{authUser.name}</p>
            <p className="text-xs sidebar-subtitle truncate">{authUser.email}</p>
          </div>
        )}
        <button
          onClick={onToggleDarkMode}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white transition-all hover:bg-white/10"
        >
          {darkMode ? <IconSun /> : <IconMoon />}
          {darkMode ? 'Modo claro' : 'Modo oscuro'}
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white transition-all hover:bg-white/10"
        >
          <IconLogout />
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

export function Sidebar({ darkMode, onToggleDarkMode }: SidebarProps) {
  const { sidebarOpen, setSidebarOpen, authUser, logout } = useClinicStore()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Riel de íconos — colapsado, visible en cualquier tamaño de pantalla */}
      {!sidebarOpen && (
        <div className="flex-shrink-0 h-screen sticky top-0" style={{ width: '4.5rem' }}>
          <RailContent darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} onLogout={handleLogout} onExpand={() => setSidebarOpen(true)} />
        </div>
      )}

      {/* Overlay mobile — solo cuando está expandido en pantallas chicas */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Drawer mobile expandido (por encima del contenido) */}
      {sidebarOpen && (
        <div className="lg:hidden fixed left-0 top-0 h-full w-64 z-50 animate-slideIn">
          <WideContent
            darkMode={darkMode}
            onToggleDarkMode={onToggleDarkMode}
            onLogout={handleLogout}
            authUser={authUser}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Sidebar expandido en desktop — parte del layout normal */}
      {sidebarOpen && (
        <div className="hidden lg:flex flex-shrink-0 h-screen sticky top-0" style={{ width: '16rem' }}>
          <WideContent darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} onLogout={handleLogout} authUser={authUser} />
        </div>
      )}
    </>
  )
}
