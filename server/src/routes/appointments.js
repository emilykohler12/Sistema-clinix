import { Router } from 'express'
import { Appointment } from '../models/Appointment.js'
import { Patient } from '../models/Patient.js'
import { requireAuth } from '../middleware/auth.js'
import { sendEmail, appointmentCancelEmail } from '../services/emailService.js'

export const appointmentsRouter = Router()

appointmentsRouter.use(requireAuth)

// GET /api/appointments?start=2026-09-01&end=2026-09-30&professional=<id>&patient=<id>
appointmentsRouter.get('/', async (req, res) => {
  const { start, end, professional, patient, upcoming } = req.query
  const filter = {}

  if (start || end) {
    filter.date = {}
    if (start) filter.date.$gte = new Date(start)
    if (end) filter.date.$lte = new Date(end)
  }
  if (professional) filter.professional = professional
  if (patient) filter.patient = patient
  if (upcoming === 'true') {
    filter.date = { ...(filter.date || {}), $gte: new Date() }
    filter.status = { $ne: 'cancelado' }
  }

  const appointments = await Appointment.find(filter)
    .sort({ date: 1 })
    .populate('patient', 'name documentId phone email')
    .populate('professional', 'name specialty')

  res.json(appointments)
})

appointmentsRouter.get('/:id', async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('patient', 'name documentId phone email')
    .populate('professional', 'name specialty')
  if (!appointment) return res.status(404).json({ message: 'Turno no encontrado' })
  res.json(appointment)
})

appointmentsRouter.post('/', async (req, res) => {
  const { patient, professional, date, duration, price, paymentType } = req.body
  if (!patient || !professional || !date) {
    return res.status(400).json({ message: 'Paciente, profesional y fecha son requeridos' })
  }

  const appointment = await Appointment.create({
    patient,
    professional,
    date,
    duration: duration || 30,
    price: price || 0,
    paymentType: paymentType || 'particular',
    createdBy: req.user.sub,
  })

  const populated = await appointment.populate([
    { path: 'patient', select: 'name documentId phone email' },
    { path: 'professional', select: 'name specialty' },
  ])
  res.status(201).json(populated)
})

appointmentsRouter.put('/:id', async (req, res) => {
  const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate('patient', 'name documentId phone email')
    .populate('professional', 'name specialty')
  if (!appointment) return res.status(404).json({ message: 'Turno no encontrado' })
  res.json(appointment)
})

// Marca la consulta como completada y, opcionalmente, agrega una nota rápida al paciente
appointmentsRouter.post('/:id/complete', async (req, res) => {
  const { note, paid } = req.body
  const appointment = await Appointment.findById(req.params.id)
  if (!appointment) return res.status(404).json({ message: 'Turno no encontrado' })

  appointment.status = 'completado'
  if (typeof paid === 'boolean') appointment.paid = paid
  await appointment.save()

  if (note?.trim()) {
    const date = new Date()
    await Patient.findByIdAndUpdate(appointment.patient, {
      $push: { notesHistory: { text: note.trim(), date } },
      $set: { lastVisitAt: date },
    })
  }

  const populated = await appointment.populate([
    { path: 'patient', select: 'name documentId phone email' },
    { path: 'professional', select: 'name specialty' },
  ])
  res.json(populated)
})

// Marca que el paciente no se presentó al turno
appointmentsRouter.post('/:id/no-show', async (req, res) => {
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: 'no_asistio' },
    { new: true }
  )
    .populate('patient', 'name documentId phone email')
    .populate('professional', 'name specialty')
  if (!appointment) return res.status(404).json({ message: 'Turno no encontrado' })
  res.json(appointment)
})

// Cancela el turno (soft) y, si el paciente tiene email cargado, le avisa por mail
appointmentsRouter.post('/:id/cancel', async (req, res) => {
  const reason = req.body?.reason === 'reprogramado' ? 'reprogramado' : 'cancelado'
  const appointment = await Appointment.findById(req.params.id)
    .populate('patient', 'name documentId phone email')
    .populate('professional', 'name specialty')
  if (!appointment) return res.status(404).json({ message: 'Turno no encontrado' })

  appointment.status = 'cancelado'
  appointment.cancelReason = reason
  await appointment.save()

  if (appointment.patient?.email) {
    try {
      const { subject, html } = appointmentCancelEmail({
        patientName: appointment.patient.name,
        professionalName: appointment.professional?.name || 'tu profesional',
        date: appointment.date,
        reason,
      })
      await sendEmail({ to: appointment.patient.email, subject, html })
    } catch (err) {
      console.error(`[email] No se pudo avisar la cancelación del turno ${appointment.id}:`, err.message)
    }
  }

  res.json(appointment)
})

// Elimina el turno de forma permanente
appointmentsRouter.delete('/:id', async (req, res) => {
  const appointment = await Appointment.findByIdAndDelete(req.params.id)
  if (!appointment) return res.status(404).json({ message: 'Turno no encontrado' })
  res.status(204).send()
})
