interface ConfirmToastProps {
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmLabel?: string
}

export function ConfirmToast({ message, onConfirm, onCancel, confirmLabel = 'Eliminar' }: ConfirmToastProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 card rounded-xl shadow-lg p-4 flex flex-col gap-3 max-w-xs animate-fadeIn">
      <p className="text-sm text-primary">{message}</p>
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="px-3 py-1.5 text-xs rounded-lg font-medium text-secondary hover:opacity-70">
          Cancelar
        </button>
        <button onClick={onConfirm} className="px-3 py-1.5 text-xs rounded-lg font-medium text-white icon-btn-delete-solid">
          {confirmLabel}
        </button>
      </div>
    </div>
  )
}
