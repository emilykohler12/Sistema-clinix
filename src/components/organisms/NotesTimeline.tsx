import { useState } from 'react'
import { formatDate } from '../../utils/formatDate'
import type { NoteEntry } from '../../types'

interface NotesTimelineProps {
  notes: NoteEntry[]
  onAdd: (text: string) => Promise<void>
}

export function NotesTimeline({ notes, onAdd }: NotesTimelineProps) {
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)

  const sorted = [...notes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  async function handleAdd() {
    if (!text.trim()) return
    setSaving(true)
    try {
      await onAdd(text.trim())
      setText('')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <p className="text-xs font-medium mb-2 uppercase tracking-wide text-muted">Notas de consulta</p>
      <div className="flex gap-2 mb-3 no-print">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
          placeholder="Escribir nota rápida..."
          className="modal-input flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none"
        />
        <button
          onClick={handleAdd}
          disabled={saving || !text.trim()}
          className="px-4 py-2 text-sm text-white rounded-lg btn-save-gradient disabled:opacity-60"
        >
          Agregar
        </button>
      </div>

      {sorted.length === 0 && <p className="text-sm text-muted">Todavía no hay notas registradas.</p>}

      <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
        {sorted.map(note => (
          <div key={note.id} className="info-tile rounded-lg p-3">
            <p className="text-xs text-muted mb-1">{formatDate(note.date)}</p>
            <p className="text-sm text-primary whitespace-pre-wrap">{note.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
