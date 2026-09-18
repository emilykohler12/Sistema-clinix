import { useRef, useState } from 'react'
import { Avatar } from '../atoms/Avatar'
import { uploadImage } from '../../services/uploadService'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  name: string
  id: string
}

export function ImageUpload({ value, onChange, name, id }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setUploading(true)
    try {
      const url = await uploadImage(file)
      onChange(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir la imagen')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Avatar avatar={value} name={name} id={id} size="lg" />
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="text-xs px-3 py-1.5 rounded-lg font-medium icon-btn-edit disabled:opacity-60"
        >
          {uploading ? 'Subiendo...' : 'Subir foto'}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs text-muted hover:opacity-70 text-left"
          >
            Quitar foto
          </button>
        )}
        {error && <p className="text-xs text-error">{error}</p>}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  )
}
