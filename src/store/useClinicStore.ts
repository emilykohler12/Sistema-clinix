import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Patient, Toast, ToastType } from '../types'
import { getPatients, getAllPatientsByYear } from '../services/patientService'

const LIMIT = 10
let page = 1
let loadingRef = false

interface ClinicStore {
  patients: Patient[]
  apiPatients: Patient[]
  localPatients: Patient[]
  patientsSnapshot: Patient[]
  loading: boolean
  error: string | null
  hasMore: boolean
  isFiltered: boolean
  loadMore: () => Promise<void>
  searchPatients: (term: string) => Promise<void>
  resetAndLoad: () => Promise<void>
  addPatient: (patient: Patient) => void
  updatePatient: (patient: Patient) => void
  deletePatient: (id: string) => void

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
  handleSave: (patient: Patient) => void

  newPatientIds: Set<string>
  addNewPatientId: (id: string) => void
  removeNewPatientId: (id: string) => void

  patientDetail: Patient | null
  fetchPatientById: (id: string) => Promise<void>

  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void

  dateFilter: string
  setDateFilter: (year: string) => Promise<void>

  selectedPatient: Patient | null
  setSelectedPatient: (patient: Patient | null) => void
}

export const useClinicStore = create<ClinicStore>()(
  persist(
    (set, get) => ({
      patients: [],
      apiPatients: [],
      localPatients: [],
      patientsSnapshot: [],
      loading: false,
      error: null,
      hasMore: true,
      isFiltered: false,

      selectedPatient: null,
      setSelectedPatient: (patient) => set({ selectedPatient: patient }),

      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      dateFilter: 'all',

      setDateFilter: async (year) => {
        const { localPatients } = get()

        if (year === 'all') {
          page = 1
          loadingRef = false
          set({
            dateFilter: 'all',
            patients: localPatients,
            hasMore: true,
            error: null,
            isFiltered: false,
            patientsSnapshot: [],
          })
          await get().loadMore()
          return
        }

        if (loadingRef) return
        loadingRef = true
        set({ loading: true, error: null, dateFilter: year })
        try {
          const allFromAPI = await getAllPatientsByYear(year)
          const localOfYear = localPatients.filter(
            p => new Date(p.createdAt).getFullYear().toString() === year
          )
          const apiIds = new Set(allFromAPI.map(p => p.id))
          const uniqueLocal = localOfYear.filter(p => !apiIds.has(p.id))
          const combined = [...uniqueLocal, ...allFromAPI]
          set({
            patients: combined,
            hasMore: false,
            isFiltered: true,
          })
        } catch {
          set({ error: 'No se pudieron cargar los pacientes de ese año.' })
        } finally {
          loadingRef = false
          set({ loading: false })
        }
      },

      loadMore: async () => {
        const { hasMore, isFiltered } = get()
        if (loadingRef || !hasMore || isFiltered) return
        loadingRef = true
        set({ loading: true, error: null })
        try {
          const data = await getPatients(page, LIMIT)
          if (data.length < LIMIT) set({ hasMore: false })
          set(state => {
            const existingIds = new Set(state.patients.map(p => p.id))
            const newPatients = data.filter((p: Patient) => !existingIds.has(p.id))
            const existingApiIds = new Set(state.apiPatients.map(p => p.id))
            const newApiPatients = data.filter((p: Patient) => !existingApiIds.has(p.id))
            return {
              patients: [...state.patients, ...newPatients],
              apiPatients: [...state.apiPatients, ...newApiPatients],
            }
          })
          page += 1
        } catch {
          set({ error: 'No se pudieron cargar los pacientes. Intentá de nuevo.' })
        } finally {
          loadingRef = false
          set({ loading: false })
        }
      },

      searchPatients: async (term: string) => {
  if (loadingRef) return
  loadingRef = true
  set(state => ({
    loading: true,
    error: null,
    patientsSnapshot: state.patientsSnapshot.length > 0
      ? state.patientsSnapshot
      : state.patients,
  }))

  const { localPatients, patientsSnapshot, patients } = get()
  const termLower = term.trim().toLowerCase()
  const snapshot = patientsSnapshot.length > 0 ? patientsSnapshot : patients

  // Búsqueda local inmediata — pacientes creados o editados por el usuario
  const localResults = [
    ...localPatients,
    // pacientes de la API que el usuario editó (están en snapshot pero no en localPatients como originales)
    ...snapshot.filter(p => !localPatients.find(l => l.id === p.id))
  ]
    .filter(p => p.name.trim().toLowerCase().includes(termLower))
    // deduplicar por id
    .filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i)

  // Mostrar resultados locales de inmediato mientras espera la API
  set({ patients: localResults, hasMore: false, isFiltered: true })

  try {
    const apiResults = await getPatients(1, 100, term)

    // Combinar: locales primero, luego API, sin duplicados
    const localIds = new Set(localResults.map(p => p.id))
    const uniqueApiResults = apiResults.filter(p => !localIds.has(p.id))
    const combined = [...localResults, ...uniqueApiResults]

    set({ patients: combined, hasMore: false, isFiltered: true })
  } catch {
    // Si la API falla, mantener los resultados locales sin mostrar error
    // porque el usuario ya ve sus pacientes locales correctamente
    if (localResults.length === 0) {
      set({ error: 'Error al buscar pacientes.' })
    }
  } finally {
    loadingRef = false
    set({ loading: false })
  }
},

      resetAndLoad: async () => {
        const { patientsSnapshot, localPatients } = get()
        if (patientsSnapshot.length > 0) {
          const existingIds = new Set(patientsSnapshot.map(p => p.id))
          const uniqueLocal = localPatients.filter(p => !existingIds.has(p.id))
          set({
            patients: [...uniqueLocal, ...patientsSnapshot],
            hasMore: true,
            error: null,
            dateFilter: 'all',
            isFiltered: false,
            patientsSnapshot: [],
          })
          return
        }
        page = 1
        loadingRef = false
        set({
          patients: localPatients,
          apiPatients: [],
          hasMore: true,
          error: null,
          dateFilter: 'all',
          isFiltered: false,
        })
        await get().loadMore()
      },

      addPatient: (patient) =>
        set(state => ({
          patients: [patient, ...state.patients],
          localPatients: [patient, ...state.localPatients],
        })),

      updatePatient: (updated) =>
  set(state => {
    const isAlreadyLocal = state.localPatients.some(p => p.id === updated.id)
    return {
      patients: state.patients.map(p => p.id === updated.id ? updated : p),
      apiPatients: state.apiPatients.map(p => p.id === updated.id ? updated : p),
      localPatients: isAlreadyLocal
        ? state.localPatients.map(p => p.id === updated.id ? updated : p)
        : [...state.localPatients, updated],
    }
  }),

      deletePatient: (id) =>
        set(state => ({
          patients: state.patients.filter(p => p.id !== id),
          localPatients: state.localPatients.filter(p => p.id !== id),
          apiPatients: state.apiPatients.filter(p => p.id !== id),
          favorites: state.favorites.filter(f => f !== id),
        })),

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

      handleSave: (patient) => {
        const { modalMode, addPatient, updatePatient, addToast, addNewPatientId, closeModal } = get()
        if (modalMode === 'add') {
          addPatient(patient)
          addNewPatientId(patient.id)
          addToast('Paciente agregado correctamente', 'success')
        } else {
          updatePatient(patient)
          addToast('Paciente actualizado correctamente', 'success')
        }
        closeModal()
      },

      newPatientIds: new Set<string>(),

      addNewPatientId: (id) =>
        set(state => ({ newPatientIds: new Set(state.newPatientIds).add(id) })),

      removeNewPatientId: (id) =>
        set(state => {
          const s = new Set(state.newPatientIds)
          s.delete(id)
          return { newPatientIds: s }
        }),

      patientDetail: null,

      fetchPatientById: async (id: string) => {
        set({ loading: true, error: null })
        try {
          const BASE_URL = import.meta.env.VITE_API_URL
          const response = await fetch(`${BASE_URL}/${id}`)
          if (!response.ok) throw new Error('Paciente no encontrado')
          const data = await response.json()
          set({ patientDetail: data })
        } catch {
          set({ error: 'No se pudo cargar el paciente.' })
        } finally {
          set({ loading: false })
        }
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