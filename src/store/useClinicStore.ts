import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Patient, Toast, ToastType } from '../types'
import { getPatients } from '../services/patientService'

const LIMIT = 10
let page = 1
let loadingRef = false

interface ClinicStore {
  // Patients
  patients: Patient[]
  loading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => Promise<void>
  addPatient: (patient: Patient) => void
  updatePatient: (patient: Patient) => void
  deletePatient: (id: string) => void

  // Favorites
  favorites: string[]
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean

  // Toast
  toasts: Toast[]
  addToast: (message: string, type: ToastType) => void
  removeToast: (id: string) => void

  // Modal
  modalPatient: Patient | undefined
  modalMode: 'add' | 'edit' | null
  openAdd: () => void
  openEdit: (patient: Patient) => void
  closeModal: () => void
  handleSave: (patient: Patient) => void

  // Session
  newPatientIds: Set<string>
  addNewPatientId: (id: string) => void
  removeNewPatientId: (id: string) => void
}

export const useClinicStore = create<ClinicStore>()(
  persist(
    (set, get) => ({
      // ── Patients ──────────────────────────────────────────
      patients: [],
      loading: false,
      error: null,
      hasMore: true,

      loadMore: async () => {
        const { hasMore } = get()
        if (loadingRef || !hasMore) return
        loadingRef = true
        set({ loading: true, error: null })

        try {
          const data = await getPatients(page, LIMIT)
          if (data.length < LIMIT) set({ hasMore: false })
          set(state => {
            const existingIds = new Set(state.patients.map(p => p.id))
            const newPatients = data.filter((p: Patient) => !existingIds.has(p.id))
            return { patients: [...state.patients, ...newPatients] }
          })
          page += 1
        } catch {
          set({ error: 'No se pudieron cargar los pacientes. Intentá de nuevo.' })
        } finally {
          loadingRef = false
          set({ loading: false })
        }
      },

      addPatient: (patient) =>
        set(state => ({ patients: [patient, ...state.patients] })),

      updatePatient: (updated) =>
        set(state => ({
          patients: state.patients.map(p => p.id === updated.id ? updated : p)
        })),

      deletePatient: (id) =>
  set(state => ({
    patients: state.patients.filter(p => p.id !== id),
    favorites: state.favorites.filter(f => f !== id),
  })),

      // ── Favorites ─────────────────────────────────────────
      favorites: [],

      toggleFavorite: (id) =>
        set(state => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter(f => f !== id)
            : [...state.favorites, id]
        })),

      isFavorite: (id) => get().favorites.includes(id),

      // ── Toast ─────────────────────────────────────────────
      toasts: [],

      addToast: (message, type) =>
        set(state => ({
          toasts: [...state.toasts, { id: Date.now().toString(), message, type }]
        })),

      removeToast: (id) =>
        set(state => ({
          toasts: state.toasts.filter(t => t.id !== id)
        })),

      // ── Modal ─────────────────────────────────────────────
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

      // ── Session ───────────────────────────────────────────
      newPatientIds: new Set<string>(),

      addNewPatientId: (id) =>
        set(state => ({ newPatientIds: new Set(state.newPatientIds).add(id) })),

      removeNewPatientId: (id) =>
        set(state => {
          const s = new Set(state.newPatientIds)
          s.delete(id)
          return { newPatientIds: s }
        }),
    }),
    {
      name: 'clinix-store',
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    }
  )
)