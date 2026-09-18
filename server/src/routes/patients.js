import { Router } from 'express'
import multer from 'multer'
import path from 'node:path'
import crypto from 'node:crypto'
import { Patient } from '../models/Patient.js'
import { requireAuth } from '../middleware/auth.js'
import { uploadsDir } from './uploads.js'

export const patientsRouter = Router()

patientsRouter.use(requireAuth)

const attachmentStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${crypto.randomUUID()}${ext}`)
  },
})

const ALLOWED_ATTACHMENT_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])

const uploadAttachment = multer({
  storage: attachmentStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_ATTACHMENT_TYPES.has(file.mimetype)) {
      return cb(new Error('Formato no permitido (solo PDF, JPG, PNG o WEBP)'))
    }
    cb(null, true)
  },
})

// GET /api/patients?page=1&limit=10&search=juan&year=2024&gender=femenino&status=activo&assignedDoctor=...&bloodType=O+&archived=true
// El filtro por año se aplica sobre la última consulta (lastVisitAt), no sobre la fecha de alta.
patientsRouter.get('/', async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1)
  const limit = Math.min(parseInt(req.query.limit) || 10, 100)
  const { search, year, gender, status, assignedDoctor, bloodType } = req.query

  const filter = req.query.archived === 'true'
    ? { archived: true }
    : { archived: { $ne: true } }

  if (search && search.trim()) {
    const term = search.trim()
    filter.$or = [
      { name: { $regex: term, $options: 'i' } },
      { documentId: { $regex: term, $options: 'i' } },
      { diagnosis: { $regex: term, $options: 'i' } },
    ]
  }
  if (year) {
    const start = new Date(`${year}-01-01T00:00:00.000Z`)
    const end = new Date(`${year}-12-31T23:59:59.999Z`)
    filter.lastVisitAt = { $gte: start, $lte: end }
  }
  if (gender) filter.gender = gender
  if (status) filter.status = status
  if (assignedDoctor) filter.assignedDoctor = assignedDoctor
  if (bloodType) filter.bloodType = bloodType

  const [items, total] = await Promise.all([
    Patient.find(filter)
      .collation({ locale: 'es', strength: 1 })
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Patient.countDocuments(filter),
  ])

  res.json({ items, total, page, hasMore: page * limit < total })
})

patientsRouter.get('/years', async (_req, res) => {
  const years = await Patient.aggregate([
    { $match: { lastVisitAt: { $exists: true, $ne: null } } },
    { $group: { _id: { $year: '$lastVisitAt' } } },
    { $sort: { _id: -1 } },
  ])
  res.json(years.map((y) => y._id))
})

patientsRouter.get('/:id', async (req, res) => {
  const patient = await Patient.findById(req.params.id)
  if (!patient) return res.status(404).json({ message: 'Paciente no encontrado' })
  res.json(patient)
})

patientsRouter.post('/', async (req, res) => {
  const patient = await Patient.create({ ...req.body, createdBy: req.user.sub })
  res.status(201).json(patient)
})

patientsRouter.put('/:id', async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!patient) return res.status(404).json({ message: 'Paciente no encontrado' })
  res.json(patient)
})

// Archiva el paciente (soft delete) en vez de borrarlo, salvo que se pida ?permanent=true
patientsRouter.delete('/:id', async (req, res) => {
  if (req.query.permanent === 'true') {
    const patient = await Patient.findByIdAndDelete(req.params.id)
    if (!patient) return res.status(404).json({ message: 'Paciente no encontrado' })
    return res.status(204).send()
  }

  const patient = await Patient.findByIdAndUpdate(req.params.id, { archived: true }, { new: true })
  if (!patient) return res.status(404).json({ message: 'Paciente no encontrado' })
  res.json(patient)
})

patientsRouter.post('/:id/restore', async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(req.params.id, { archived: false }, { new: true })
  if (!patient) return res.status(404).json({ message: 'Paciente no encontrado' })
  res.json(patient)
})

// Notas rápidas post-consulta — cada entrada queda fechada y actualiza "última consulta"
patientsRouter.post('/:id/notes', async (req, res) => {
  const { text } = req.body
  if (!text?.trim()) return res.status(400).json({ message: 'La nota no puede estar vacía' })

  const date = new Date()
  const patient = await Patient.findByIdAndUpdate(
    req.params.id,
    {
      $push: { notesHistory: { text: text.trim(), date } },
      $set: { lastVisitAt: date },
    },
    { new: true }
  )
  if (!patient) return res.status(404).json({ message: 'Paciente no encontrado' })
  res.status(201).json(patient)
})

patientsRouter.delete('/:id/notes/:noteId', async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(
    req.params.id,
    { $pull: { notesHistory: { _id: req.params.noteId } } },
    { new: true }
  )
  if (!patient) return res.status(404).json({ message: 'Paciente no encontrado' })
  res.json(patient)
})

// Adjuntos (PDF/imágenes: estudios, informes, recetas)
patientsRouter.post('/:id/attachments', uploadAttachment.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No se envió ningún archivo' })

  const patient = await Patient.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        attachments: {
          filename: req.file.originalname,
          url: `/uploads/${req.file.filename}`,
          mimeType: req.file.mimetype,
        },
      },
    },
    { new: true }
  )
  if (!patient) return res.status(404).json({ message: 'Paciente no encontrado' })
  res.status(201).json(patient)
})

patientsRouter.delete('/:id/attachments/:attachmentId', async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(
    req.params.id,
    { $pull: { attachments: { _id: req.params.attachmentId } } },
    { new: true }
  )
  if (!patient) return res.status(404).json({ message: 'Paciente no encontrado' })
  res.json(patient)
})

patientsRouter.use((err, _req, res, _next) => {
  res.status(400).json({ message: err.message || 'Error al subir el archivo' })
})
