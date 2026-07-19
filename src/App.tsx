import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { PatientModal } from './components/organisms/PatientModal'
import { Toast } from './components/organisms/Toast'
import { useClinicStore } from './store/useClinicStore'

export default function App() {
  const { modalMode, modalPatient, handleSave, closeModal, toasts, removeToast } = useClinicStore()

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
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