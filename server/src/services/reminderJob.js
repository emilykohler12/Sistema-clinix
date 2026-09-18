import { Appointment } from '../models/Appointment.js'
import { sendEmail, appointmentReminderEmail } from './emailService.js'

const CHECK_INTERVAL_MS = 15 * 60 * 1000 // cada 15 minutos
const REMINDER_WINDOW_MS = 12 * 60 * 60 * 1000 // 12 horas antes
const WINDOW_TOLERANCE_MS = 15 * 60 * 1000 // margen de 15 min para no perder turnos entre chequeos

async function checkAndSendReminders() {
  const now = Date.now()
  const windowStart = new Date(now + REMINDER_WINDOW_MS - WINDOW_TOLERANCE_MS)
  const windowEnd = new Date(now + REMINDER_WINDOW_MS + WINDOW_TOLERANCE_MS)

  const appointments = await Appointment.find({
    date: { $gte: windowStart, $lte: windowEnd },
    status: { $in: ['programado', 'confirmado'] },
    reminderSentAt: null,
  })
    .populate('patient', 'name email')
    .populate('professional', 'name')

  for (const appointment of appointments) {
    if (!appointment.patient?.email) continue
    try {
      const { subject, html } = appointmentReminderEmail({
        patientName: appointment.patient.name,
        professionalName: appointment.professional?.name || 'tu profesional',
        date: appointment.date,
      })
      await sendEmail({ to: appointment.patient.email, subject, html })
      appointment.reminderSentAt = new Date()
      await appointment.save()
      console.log(`[reminder] Enviado a ${appointment.patient.email} para turno ${appointment.id}`)
    } catch (err) {
      console.error(`[reminder] Error enviando recordatorio para turno ${appointment.id}:`, err.message)
    }
  }
}

export function startReminderJob() {
  checkAndSendReminders().catch((err) => console.error('[reminder] Error inicial:', err.message))
  setInterval(() => {
    checkAndSendReminders().catch((err) => console.error('[reminder] Error:', err.message))
  }, CHECK_INTERVAL_MS)
  console.log('[reminder] Job de recordatorios iniciado (chequeo cada 15 min)')
}
