const RESEND_API_URL = 'https://api.resend.com/emails'

export async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY no configurada, no se envió el email a', to)
    return { skipped: true }
  }

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || 'Clinix <onboarding@resend.dev>',
      to: [to],
      subject,
      html,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Resend error (${response.status}): ${body}`)
  }

  return response.json()
}

export function appointmentCancelEmail({ patientName, professionalName, date, reason, newDate }) {
  const formatted = new Date(date).toLocaleString('es-AR', {
    dateStyle: 'full',
    timeStyle: 'short',
  })
  const isReprogramado = reason === 'reprogramado'
  const formattedNewDate = newDate
    ? new Date(newDate).toLocaleString('es-AR', { dateStyle: 'full', timeStyle: 'short' })
    : null

  return {
    subject: isReprogramado ? 'Tu turno fue reprogramado — Clinix' : 'Tu turno fue cancelado — Clinix',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>${isReprogramado ? 'Turno reprogramado' : 'Turno cancelado'}</h2>
        <p>Hola ${patientName},</p>
        <p>Te informamos que tu turno con <strong>${professionalName}</strong> que estaba programado para:</p>
        <p style="font-size: 16px; font-weight: bold;">${formatted}</p>
        <p>${isReprogramado ? 'fue reprogramado para:' : 'fue cancelado.'}</p>
        ${formattedNewDate ? `<p style="font-size: 18px; font-weight: bold;">${formattedNewDate}</p>` : ''}
        <p>Ante cualquier duda, contactate con la clínica.</p>
      </div>
    `,
  }
}

export function appointmentReminderEmail({ patientName, professionalName, date }) {
  const formatted = new Date(date).toLocaleString('es-AR', {
    dateStyle: 'full',
    timeStyle: 'short',
  })
  return {
    subject: 'Recordatorio de tu turno — Clinix',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Recordatorio de turno</h2>
        <p>Hola ${patientName},</p>
        <p>Te recordamos tu turno con <strong>${professionalName}</strong> programado para:</p>
        <p style="font-size: 18px; font-weight: bold;">${formatted}</p>
        <p>Si necesitás reprogramar, contactate con la clínica.</p>
      </div>
    `,
  }
}
