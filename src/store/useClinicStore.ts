import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Appointment, AuthUser, Doctor, Patient, PatientFilters, Toast, ToastType } from '../types'
import {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient as updatePatientApi,
  archivePatient,
  restorePatient as restorePatientApi,
  deletePatientPermanently,
  addPatientNote,
  deletePatientNote,
  uploadPatientAttachment,
  deletePatientAttachment,
} from '../services/patientService'
import { login as loginApi, register as registerApi, logout as logoutApi, getCurrentUser } from '../services/authService'
import { getUsers, createUser, setUserActive, archiveUser, restoreUser, type NewDoctorInput } from '../services/userService'
import {
  getAppointments,
  createAppointment as createAppointmentApi,
  updateAppointment as updateAppointmentApi,
  completeAppointment as completeAppointmentApi,
  cancelAppointment as cancelAppointmentApi,
  type NewAppointmentInput,
} from '../services/appointmentService'

const LIMIT = 10

interface ClinicStore {
  patients: Patient[]
  totalCount: number
  page: number
  loading: boolean
  error: string | null
  hasMore: boolean
  isFiltered: boolean
  searchTerm: string
  dateFilter: string
  filters: PatientFilters

  loadMore: () => Promise<void>
  resetAndLoad: () => Promise<void>
  searchPatients: (term: string) => Promise<void>
  setDateFilter: (year: string) => Promise<void>
  setFilters: (filters: PatientFilters) => Promise<void>

  addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => Promise<void>
  updatePatient: (patient: Patient) => Promise<void>
  deletePatient: (id: string) => Promise<void>
  addNote: (id: string, text: string) => Promise<void>
  removeNote: (id: string, noteId: string) => Promise<void>
  uploadAttachment: (id: string, file: File) => Promise<void>
  removeAttachment: (id: string, attachmentId: string) => Promise<void>

  archivedPatients: Patient[]
  archivedLoading: boolean
  loadArchived: () => Promise<void>
  restorePatient: (id: string) => Promise<void>
  deletePatientPermanently: (id: string) => Promise<void>

  doctors: Doctor[]
  doctorsLoading: boolean
  loadDoctors: () => Promise<void>
  addDoctor: (input: NewDoctorInput) => Promise<void>
  toggleDoctorActive: (id: string, active: boolean) => Promise<void>
  archiveDoctor: (id: string) => Promise<void>

  archivedDoctors: Doctor[]
  archivedDoctorsLoading: boolean
  loadArchivedDoctors: () => Promise<void>
  restoreDoctor: (id: string) => Promise<void>

  favorites: string[]
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean

  toasts: Toast[]
  addToast: (message: string, type: ToastType) => void
  removeToast: (id: string) => void

  modalPatient: Patient | undefined
  modalMode: 'add' | 'edit' | null
  openAdd: () => void
  openEdit: (patient: Patient) => void
  closeModal: () => void
  handleSave: (patient: Patient) => Promise<void>

  patientDetail: Patient | null
  fetchPatientById: (id: string) => Promise<void>

  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void

  selectedPatient: Patient | null
  setSelectedPatient: (patient: Patient | null) => void

  authUser: AuthUser | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, specialty?: string) => Promise<void>
  logout: () => void

  appointments: Appointment[]
  appointmentsLoading: boolean
  loadAppointments: (range: { start?: string; end?: string; professional?: string; patient?: string }) => Promise<void>
  createAppointment: (input: NewAppointmentInput) => Promise<void>
  updateAppointment: (id: string, input: Partial<Appointment>) => Promise<void>
  completeAppointment: (id: string, note?: string, paid?: boolean) => Promise<void>
  cancelAppointment: (id: string) => Promise<void>
}

export const useClinicStore = create<ClinicStore>()(
  persist(
    (set, get) => ({
      patients: [],
      totalCount: 0,
      page: 1,
      loading: false,
      error: null,
      hasMore: true,
      isFiltered: false,
      searchTerm: '',
      dateFilter: 'all',
      filters: {},

      selectedPatient: null,
      setSelectedPatient: (patient) => set({ selectedPatient: patient }),

      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      authUser: getCurrentUser(),

      login: async (email, password) => {
        const user = await loginApi(email, password)
        set({ authUser: user })
      },

      register: async (name, email, password, specialty) => {
        const user = await registerApi(name, email, password, specialty)
        set({ authUser: user })
      },

      logout: () => {
        logoutApi()
        set({ authUser: null, patients: [], page: 1, hasMore: true, totalCount: 0 })
      },

      loadMore: async () => {
        const { loading, hasMore, page, isFiltered, searchTerm, dateFilter, filters } = get()
        if (loading || !hasMore || isFiltered) return
        set({ loading: true, error: null })
        try {
          const data = await getPatients(page, LIMIT, { search: searchTerm, year: dateFilter, filters })
          set(state => ({
            patients: [...state.patients, ...data.items],
            hasMore: data.hasMore,
            page: page + 1,
            totalCount: data.total,
          }))
        } catch {
          set({ error: 'No se pudieron cargar los pacientes. Intentá de nuevo.' })
        } finally {
          set({ loading: false })
        }
      },

      resetAndLoad: async () => {
        set({ patients: [], page: 1, hasMore: true, isFiltered: false, error: null, searchTerm: '', dateFilter: 'all', filters: {}, totalCount: 0 })
        await get().loadMore()
      },

      searchPatients: async (term) => {
        const { filters } = get()
        set({ loading: true, error: null, searchTerm: term, isFiltered: true })
        try {
          const data = await getPatients(1, 100, { search: term, filters })
          set({ patients: data.items, hasMore: false, totalCount: data.total })
        } catch {
          set({ error: 'Error al buscar pacientes.' })
        } finally {
          set({ loading: false })
        }
      },

      setDateFilter: async (year) => {
        const { filters, searchTerm } = get()
        if (year === 'all' && Object.keys(filters).length === 0 && !searchTerm) {
          await get().resetAndLoad()
          return
        }
        set({ loading: true, error: null, dateFilter: year, isFiltered: true })
        try {
          const data = await getPatients(1, 100, { year: year === 'all' ? undefined : year, search: searchTerm, filters })
          set({ patients: data.items, hasMore: false, totalCount: data.total })
        } catch {
          set({ error: 'No se pudieron cargar los pacientes de ese año.' })
        } finally {
          set({ loading: false })
        }
      },

      setFilters: async (filters) => {
        const { dateFilter, searchTerm } = get()
        const hasFilters = Object.values(filters).some(Boolean)
        set({ loading: true, error: null, filters, isFiltered: hasFilters || !!searchTerm || dateFilter !== 'all' })
        try {
          const data = await getPatients(1, 100, {
            year: dateFilter === 'all' ? undefined : dateFilter,
            search: searchTerm,
            filters,
          })
          set({ patients: data.items, hasMore: false, totalCount: data.total })
        } catch {
          set({ error: 'No se pudieron aplicar los filtros.' })
        } finally {
          set({ loading: false })
        }
      },

      addPatient: async (patient) => {
        const created = await createPatient(patient)
        set(state => ({ patients: [created, ...state.patients], totalCount: state.totalCount + 1 }))
      },

      updatePatient: async (patient) => {
        const updated = await updatePatientApi(patient.id, patient)
        set(state => ({ patients: state.patients.map(p => p.id === updated.id ? updated : p) }))
      },

      deletePatient: async (id) => {
        await archivePatient(id)
        set(state => ({
          patients: state.patients.filter(p => p.id !== id),
          favorites: state.favorites.filter(f => f !== id),
          totalCount: Math.max(0, state.totalCount - 1),
        }))
      },

      addNote: async (id, text) => {
        const updated = await addPatientNote(id, text)
        set(state => ({
          patients: state.patients.map(p => p.id === id ? updated : p),
          patientDetail: state.patientDetail?.id === id ? updated : state.patientDetail,
        }))
      },

      removeNote: async (id, noteId) => {
        const updated = await deletePatientNote(id, noteId)
        set(state => ({
          patients: state.patients.map(p => p.id === id ? updated : p),
          patientDetail: state.patientDetail?.id === id ? updated : state.patientDetail,
        }))
      },

      uploadAttachment: async (id, file) => {
        const updated = await uploadPatientAttachment(id, file)
        set(state => ({
          patients: state.patients.map(p => p.id === id ? updated : p),
          patientDetail: state.patientDetail?.id === id ? updated : state.patientDetail,
        }))
      },

      removeAttachment: async (id, attachmentId) => {
        const updated = await deletePatientAttachment(id, attachmentId)
        set(state => ({
          patients: state.patients.map(p => p.id === id ? updated : p),
          patientDetail: state.patientDetail?.id === id ? updated : state.patientDetail,
        }))
      },

      archivedPatients: [],
      archivedLoading: false,

      loadArchived: async () => {
        set({ archivedLoading: true })
        try {
          const data = await getPatients(1, 100, { archived: true })
          set({ archivedPatients: data.items })
        } catch {
          get().addToast('No se pudieron cargar los pacientes archivados', 'error')
        } finally {
          set({ archivedLoading: false })
        }
      },

      restorePatient: async (id) => {
        await restorePatientApi(id)
        set(state => ({ archivedPatients: state.archivedPatients.filter(p => p.id !== id) }))
        get().addToast('Paciente restaurado', 'success')
      },

      deletePatientPermanently: async (id) => {
        await deletePatientPermanently(id)
        set(state => ({ archivedPatients: state.archivedPatients.filter(p => p.id !== id) }))
        get().addToast('Paciente eliminado definitivamente', 'success')
      },

      doctors: [],
      doctorsLoading: false,

      loadDoctors: async () => {
        set({ doctorsLoading: true })
        try {
          const doctors = await getUsers()
          set({ doctors })
        } catch {
          get().addToast('No se pudo cargar la lista de profesionales', 'error')
        } finally {
          set({ doctorsLoading: false })
        }
      },

      addDoctor: async (input) => {
        const doctor = await createUser(input)
        set(state => ({ doctors: [...state.doctors, doctor].sort((a, b) => a.name.localeCompare(b.name)) }))
      },

      toggleDoctorActive: async (id, active) => {
        const updated = await setUserActive(id, active)
        set(state => ({ doctors: state.doctors.map(d => d.id === id ? updated : d) }))
      },

      archiveDoctor: async (id) => {
        await archiveUser(id)
        set(state => ({ doctors: state.doctors.filter(d => d.id !== id) }))
      },

      archivedDoctors: [],
      archivedDoctorsLoading: false,

      loadArchivedDoctors: async () => {
        set({ archivedDoctorsLoading: true })
        try {
          const archivedDoctors = await getUsers(true)
          set({ archivedDoctors })
        } catch {
          get().addToast('No se pudieron cargar los profesionales archivados', 'error')
        } finally {
          set({ archivedDoctorsLoading: false })
        }
      },

      restoreDoctor: async (id) => {
        await restoreUser(id)
        set(state => ({ archivedDoctors: state.archivedDoctors.filter(d => d.id !== id) }))
        get().addToast('Profesional restaurado', 'success')
      },

      favorites: [],

      toggleFavorite: (id) =>
        set(state => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter(f => f !== id)
            : [...state.favorites, id]
        })),

      isFavorite: (id) => get().favorites.includes(id),

      toasts: [],

      addToast: (message, type) =>
        set(state => ({
          toasts: [...state.toasts, { id: Date.now().toString(), message, type }]
        })),

      removeToast: (id) =>
        set(state => ({
          toasts: state.toasts.filter(t => t.id !== id)
        })),

      modalPatient: undefined,
      modalMode: null,

      openAdd: () => set({ modalPatient: undefined, modalMode: 'add' }),
      openEdit: (patient) => set({ modalPatient: patient, modalMode: 'edit' }),
      closeModal: () => set({ modalPatient: undefined, modalMode: null }),

      handleSave: async (patient) => {
        const { modalMode, addPatient, updatePatient, addToast, closeModal } = get()
        try {
          if (modalMode === 'add') {
            const rest = { ...patient } as Record<string, unknown>
            delete rest.id
            delete rest.createdAt
            await addPatient(rest as Omit<Patient, 'id' | 'createdAt'>)
            addToast('Paciente agregado correctamente', 'success')
          } else {
            await updatePatient(patient)
            addToast('Paciente actualizado correctamente', 'success')
          }
          closeModal()
        } catch {
          addToast('No se pudo guardar el paciente', 'error')
        }
      },

      patientDetail: null,

      fetchPatientById: async (id: string) => {
        set({ loading: true, error: null })
        try {
          const data = await getPatientById(id)
          set({ patientDetail: data })
        } catch {
          set({ error: 'No se pudo cargar el paciente.' })
        } finally {
          set({ loading: false })
        }
      },

      appointments: [],
      appointmentsLoading: false,

      loadAppointments: async (range) => {
        set({ appointmentsLoading: true })
        try {
          const appointments = await getAppointments(range)
          set({ appointments })
        } catch {
          get().addToast('No se pudieron cargar los turnos', 'error')
        } finally {
          set({ appointmentsLoading: false })
        }
      },

      createAppointment: async (input) => {
        const created = await createAppointmentApi(input)
        set(state => ({ appointments: [...state.appointments, created].sort((a, b) => a.date.localeCompare(b.date)) }))
      },

      updateAppointment: async (id, input) => {
        const updated = await updateAppointmentApi(id, input)
        set(state => ({ appointments: state.appointments.map(a => a.id === id ? updated : a) }))
      },

      completeAppointment: async (id, note, paid) => {
        const updated = await completeAppointmentApi(id, note, paid)
        set(state => ({ appointments: state.appointments.map(a => a.id === id ? updated : a) }))
      },

      cancelAppointment: async (id) => {
        const updated = await cancelAppointmentApi(id)
        set(state => ({ appointments: state.appointments.map(a => a.id === id ? updated : a) }))
      },
    }),
    {
      name: 'clinix-store',
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    }
  )
)
