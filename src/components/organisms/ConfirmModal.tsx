interface ConfirmModalProps {
  patientName: string
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmModal({ patientName, onConfirm, onClose }: ConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm p-6 flex flex-col gap-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Eliminar paciente</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          ¿Estás seguro que querés eliminar a <span className="font-medium text-gray-900 dark:text-white">{patientName}</span>? Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors">Cancelar</button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">Eliminar</button>
        </div>
      </div>
    </div>
  )
}