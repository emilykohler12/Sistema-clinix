interface ConfirmModalProps {
  patientName: string
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmModal({ patientName, onConfirm, onClose }: ConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="rounded-2xl w-full max-w-sm p-6 flex flex-col gap-4 card">
        <h2 className="text-lg font-medium text-primary">Eliminar paciente</h2>
        <p className="text-sm text-secondary">
          ¿Estás seguro que querés eliminar a <span className="font-medium text-primary">{patientName}</span>? Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-secondary hover:opacity-70 transition-opacity">Cancelar</button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm text-white rounded-lg transition-colors hover:opacity-90" style={{ backgroundColor: '#E5484D' }}>Eliminar</button>
        </div>
      </div>
    </div>
  )
}