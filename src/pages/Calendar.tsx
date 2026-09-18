import { Fragment, useEffect, useMemo, useState } from 'react'
import { Sidebar } from '../components/organisms/Sidebar'
import { AppointmentModal } from '../components/organisms/AppointmentModal'
import { useClinicStore } from '../store/useClinicStore'
import {
  addDays, endOfDay, getMonthGrid, getWeekDays, isSameDay, startOfDay,
  WEEKDAY_LABELS, MONTH_LABELS, HOUR_SLOTS, formatHour, formatTime,
} from '../utils/calendarUtils'
import type { Appointment } from '../types'

type ViewMode = 'dia' | 'semana' | 'mes' | 'año'

const statusClass: Record<Appointment['status'], string> = {
  programado: 'badge-status-waiting',
  confirmado: 'badge-status-active',
  completado: 'badge-status-discharged',
  cancelado: 'badge-status-admitted',
}

export function CalendarPage() {
  const { appointments, loadAppointments, doctors, loadDoctors, sidebarOpen } = useClinicStore()
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('clinix_theme') === 'dark')
  const [viewMode, setViewMode] = useState<ViewMode>('mes')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [professionalFilter, setProfessionalFilter] = useState('')
  const [modalState, setModalState] = useState<{ date: Date; appointment?: Appointment } | null>(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('clinix_theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    if (doctors.length === 0) loadDoctors()
  }, [])

  const range = useMemo(() => {
    if (viewMode === 'dia') return { start: startOfDay(currentDate), end: endOfDay(currentDate) }
    if (viewMode === 'semana') {
      const days = getWeekDays(currentDate)
      return { start: startOfDay(days[0]), end: endOfDay(days[6]) }
    }
    if (viewMode === 'año') {
      return { start: new Date(currentDate.getFullYear(), 0, 1), end: new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59) }
    }
    const grid = getMonthGrid(currentDate)
    return { start: startOfDay(grid[0]), end: endOfDay(grid[grid.length - 1]) }
  }, [viewMode, currentDate])

  useEffect(() => {
    loadAppointments({
      start: range.start.toISOString(),
      end: range.end.toISOString(),
      professional: professionalFilter || undefined,
    })
  }, [range.start.getTime(), range.end.getTime(), professionalFilter])

  const appointmentsByDay = useMemo(() => {
    const map = new Map<string, Appointment[]>()
    for (const a of appointments) {
      const key = startOfDay(new Date(a.date)).toDateString()
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(a)
    }
    for (const list of map.values()) list.sort((a, b) => a.date.localeCompare(b.date))
    return map
  }, [appointments])

  function appointmentsFor(date: Date): Appointment[] {
    return appointmentsByDay.get(startOfDay(date).toDateString()) ?? []
  }

  function navigate(delta: number) {
    if (viewMode === 'dia') setCurrentDate(prev => addDays(prev, delta))
    else if (viewMode === 'semana') setCurrentDate(prev => addDays(prev, delta * 7))
    else if (viewMode === 'año') setCurrentDate(prev => new Date(prev.getFullYear() + delta, prev.getMonth(), 1))
    else setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1))
  }

  function openCreateModal(date: Date, hour?: number) {
    const d = new Date(date)
    d.setHours(hour ?? 9, 0, 0, 0)
    setModalState({ date: d })
  }

  function openEditModal(appointment: Appointment) {
    setModalState({ date: new Date(appointment.date), appointment })
  }

  const periodLabel = viewMode === 'año'
    ? String(currentDate.getFullYear())
    : viewMode === 'mes'
    ? `${MONTH_LABELS[currentDate.getMonth()]} ${currentDate.getFullYear()}`
    : viewMode === 'semana'
    ? `Semana del ${getWeekDays(currentDate)[0].getDate()} de ${MONTH_LABELS[getWeekDays(currentDate)[0].getMonth()]}`
    : currentDate.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-page)' }}>
      <Sidebar darkMode={darkMode} onToggleDarkMode={() => setDarkMode(prev => !prev)} />

      <div className="flex-1 min-w-0">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              {!sidebarOpen && <div className="w-10 h-10 flex-shrink-0" />}
              <div>
                <h2 className="text-2xl font-bold text-primary">Calendario</h2>
                <p className="text-sm text-secondary">Turnos y agenda</p>
              </div>
            </div>
            <button
              onClick={() => openCreateModal(new Date())}
              className="btn-save-gradient px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
            >
              + Nuevo turno
            </button>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="flex gap-2">
              {(['dia', 'semana', 'mes', 'año'] as ViewMode[]).map(v => (
                <button
                  key={v}
                  onClick={() => setViewMode(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${viewMode === v ? 'btn-save-gradient text-white' : 'card text-secondary'}`}
                >
                  {v}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => navigate(-1)} className="card w-8 h-8 rounded-lg flex items-center justify-center text-primary">←</button>
              <button onClick={() => setCurrentDate(new Date())} className="card px-3 py-1.5 rounded-lg text-xs font-medium text-secondary">Hoy</button>
              <button onClick={() => navigate(1)} className="card w-8 h-8 rounded-lg flex items-center justify-center text-primary">→</button>
              <span className="text-sm font-semibold text-primary ml-2 capitalize">{periodLabel}</span>
            </div>

            <select
              value={professionalFilter}
              onChange={e => setProfessionalFilter(e.target.value)}
              className="card px-3 py-2 rounded-xl text-sm text-primary focus:outline-none"
            >
              <option value="">Todos los profesionales</option>
              {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          {viewMode === 'mes' && (
            <MonthView
              currentDate={currentDate}
              appointmentsFor={appointmentsFor}
              onDayClick={(d) => { setCurrentDate(d); setViewMode('dia') }}
              onCreate={openCreateModal}
              onEdit={openEditModal}
            />
          )}

          {viewMode === 'año' && (
            <YearView
              currentDate={currentDate}
              appointmentsByDay={appointmentsByDay}
              onMonthClick={(d) => { setCurrentDate(d); setViewMode('mes') }}
            />
          )}

          {(viewMode === 'semana' || viewMode === 'dia') && (
            <HourGridView
              days={viewMode === 'dia' ? [currentDate] : getWeekDays(currentDate)}
              appointmentsFor={appointmentsFor}
              onCreate={openCreateModal}
              onEdit={openEditModal}
            />
          )}
        </div>
      </div>

      {modalState && (
        <AppointmentModal
          initialDate={modalState.date}
          appointment={modalState.appointment}
          onClose={() => setModalState(null)}
        />
      )}
    </div>
  )
}

function AppointmentChip({ appointment, onClick }: { appointment: Appointment; onClick: () => void }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick() }}
      className={`w-full text-left text-xs px-1.5 py-0.5 rounded truncate ${statusClass[appointment.status]}`}
      title={`${formatTime(new Date(appointment.date))} — ${appointment.patient.name}`}
    >
      {formatTime(new Date(appointment.date))} {appointment.patient.name}
    </button>
  )
}

interface MonthViewProps {
  currentDate: Date
  appointmentsFor: (date: Date) => Appointment[]
  onDayClick: (date: Date) => void
  onCreate: (date: Date) => void
  onEdit: (appointment: Appointment) => void
}

function MonthView({ currentDate, appointmentsFor, onDayClick, onCreate, onEdit }: MonthViewProps) {
  const grid = getMonthGrid(currentDate)
  const today = new Date()

  return (
    <div className="card rounded-2xl overflow-hidden">
      <div className="grid grid-cols-7">
        {WEEKDAY_LABELS.map(label => (
          <div key={label} className="text-xs font-medium text-muted p-2 text-center card-divider-top">{label}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {grid.map(day => {
          const inMonth = day.getMonth() === currentDate.getMonth()
          const dayAppointments = appointmentsFor(day)
          const visible = dayAppointments.slice(0, 3)
          return (
            <div
              key={day.toISOString()}
              onClick={() => onCreate(day)}
              className="min-h-24 p-1.5 card-divider-top border-r cursor-pointer hover:opacity-80 transition-opacity"
              style={{ borderColor: 'var(--bg-card-divider)', opacity: inMonth ? 1 : 0.4 }}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  onClick={(e) => { e.stopPropagation(); onDayClick(day) }}
                  className={`text-xs font-medium ${isSameDay(day, today) ? 'text-white px-1.5 py-0.5 rounded-full' : 'text-primary'}`}
                  style={isSameDay(day, today) ? { backgroundColor: 'var(--accent)' } : undefined}
                >
                  {day.getDate()}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                {visible.map(a => <AppointmentChip key={a.id} appointment={a} onClick={() => onEdit(a)} />)}
                {dayAppointments.length > 3 && (
                  <span className="text-xs text-muted">+{dayAppointments.length - 3} más</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface YearViewProps {
  currentDate: Date
  appointmentsByDay: Map<string, Appointment[]>
  onMonthClick: (date: Date) => void
}

function YearView({ currentDate, appointmentsByDay, onMonthClick }: YearViewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {MONTH_LABELS.map((label, monthIndex) => {
        const monthDate = new Date(currentDate.getFullYear(), monthIndex, 1)
        const grid = getMonthGrid(monthDate)
        return (
          <div key={label} className="card rounded-2xl p-3">
            <button onClick={() => onMonthClick(monthDate)} className="text-sm font-semibold text-primary mb-2 hover:opacity-70">
              {label}
            </button>
            <div className="grid grid-cols-7 gap-0.5">
              {grid.map(day => {
                const inMonth = day.getMonth() === monthIndex
                const hasAppointments = appointmentsByDay.has(startOfDay(day).toDateString())
                return (
                  <div
                    key={day.toISOString()}
                    className="text-center text-xs py-1 rounded"
                    style={{ opacity: inMonth ? 1 : 0.3 }}
                  >
                    <span className={hasAppointments ? 'text-primary font-semibold' : 'text-muted'}>{day.getDate()}</span>
                    {hasAppointments && <div className="w-1 h-1 rounded-full mx-auto mt-0.5" style={{ backgroundColor: 'var(--accent)' }} />}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

interface HourGridViewProps {
  days: Date[]
  appointmentsFor: (date: Date) => Appointment[]
  onCreate: (date: Date, hour: number) => void
  onEdit: (appointment: Appointment) => void
}

function HourGridView({ days, appointmentsFor, onCreate, onEdit }: HourGridViewProps) {
  return (
    <div className="card rounded-2xl overflow-hidden overflow-x-auto">
      <div className="grid" style={{ gridTemplateColumns: `60px repeat(${days.length}, minmax(140px, 1fr))` }}>
        <div className="card-divider-top" />
        {days.map(day => (
          <div key={day.toISOString()} className="text-xs font-medium text-primary p-2 text-center card-divider-top">
            {day.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })}
          </div>
        ))}

        {HOUR_SLOTS.map(hour => (
          <Fragment key={hour}>
            <div className="text-xs text-muted p-2 card-divider-top">{formatHour(hour)}</div>
            {days.map(day => {
              const slotDate = new Date(day)
              slotDate.setHours(hour, 0, 0, 0)
              const slotAppointments = appointmentsFor(day).filter(a => new Date(a.date).getHours() === hour)
              return (
                <div
                  key={`${day.toISOString()}-${hour}`}
                  onClick={() => onCreate(day, hour)}
                  className="p-1 card-divider-top border-l cursor-pointer hover:opacity-80 transition-opacity min-h-12"
                  style={{ borderColor: 'var(--bg-card-divider)' }}
                >
                  <div className="flex flex-col gap-0.5">
                    {slotAppointments.map(a => <AppointmentChip key={a.id} appointment={a} onClick={() => onEdit(a)} />)}
                  </div>
                </div>
              )
            })}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
