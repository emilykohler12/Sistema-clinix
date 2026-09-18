import { Routes, Route, Navigate } from 'react-router-dom'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { PatientDetail } from './pages/PatientDetail'
import { Archived } from './pages/Archived'
import { Doctors } from './pages/Doctors'
import { PatientModal } from './components/organisms/PatientModal'
import { Toast } from './components/organisms/Toast'
import { useClinicStore } from './store/useClinicStore'

function RequireAuth({ children }: { children: React.ReactElement }) {
  const authUser = useClinicStore(state => state.authUser)
  if (!authUser) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const { modalMode, modalPatient, handleSave, closeModal, toasts, removeToast } = useClinicStore()

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/pacientes/:id" element={<RequireAuth><PatientDetail /></RequireAuth>} />
        <Route path="/archivados" element={<RequireAuth><Archived /></RequireAuth>} />
        <Route path="/profesionales" element={<RequireAuth><Doctors /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {modalMode && (
        <PatientModal
          mode={modalMode}
          patient={modalPatient}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}

      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  )
}
