import { Router } from 'express'
import { Patient } from '../models/Patient.js'
import { requireAuth } from '../middleware/auth.js'

export const patientsRouter = Router()

patientsRouter.use(requireAuth)

// GET /api/patients?page=1&limit=10&search=juan&year=2024&gender=femenino&status=activo&assignedDoctor=...&bloodType=O+&archived=true
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
    filter.createdAt = { $gte: start, $lte: end }
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
    { $group: { _id: { $year: '$createdAt' } } },
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
