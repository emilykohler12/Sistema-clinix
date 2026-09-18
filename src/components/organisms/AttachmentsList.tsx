import { useRef, useState } from 'react'
import { formatDate } from '../../utils/formatDate'
import type { Attachment } from '../../types'

const BASE_URL = (import.meta.env.VITE_API_URL as string).replace(/\/api$/, '')

interface AttachmentsListProps {
  attachments: Attachment[]
  onUpload: (file: File) => Promise<void>
  onRemove: (attachmentId: string) => Promise<void>
}

function fileTypeLabel(mimeType: string) {
  if (mimeType === 'application/pdf') return 'PDF'
  if (mimeType.startsWith('image/')) return 'Imagen'
  return 'Archivo'
}

export function AttachmentsList({ attachments, onUpload, onRemove }: AttachmentsListProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setUploading(true)
    try {
      await onUpload(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir el archivo')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Adjuntos</p>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="text-xs px-3 py-1 rounded-lg font-medium icon-btn-edit disabled:opacity-60"
        >
          {uploading ? 'Subiendo...' : 'Subir archivo'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {error && <p className="text-xs text-error mb-2">{error}</p>}

      {attachments.length === 0 && <p className="text-sm text-muted">Sin estudios, informes o recetas adjuntas.</p>}

      <div className="flex flex-col gap-2">
        {attachments.map(a => (
          <div key={a.id} className="info-tile rounded-lg p-3 flex items-center justify-between gap-2">
            <a href={`${BASE_URL}${a.url}`} target="_blank" rel="noopener noreferrer" className="min-w-0 link-accent">
              <p className="text-sm truncate font-medium">{a.filename}</p>
              <p className="text-xs text-muted">{fileTypeLabel(a.mimeType)} · {formatDate(a.uploadedAt)}</p>
            </a>
            <button
              onClick={() => onRemove(a.id)}
              className="text-xs text-muted hover:text-error flex-shrink-0"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
