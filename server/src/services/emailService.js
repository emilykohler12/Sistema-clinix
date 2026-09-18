const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'

export async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) {
    console.warn('[email] BREVO_API_KEY no configurada, no se envió el email a', to)
    return { skipped: true }
  }

  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      sender: {
        name: process.env.BREVO_FROM_NAME || 'Clinix',
        email: process.env.BREVO_FROM_EMAIL || 'onboarding@clinix.com',
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Brevo error (${response.status}): ${body}`)
  }

  return response.json()
}

export function passwordResetCodeEmail({ name, code }) {
  return {
    subject: 'Tu código para recuperar la contraseña — Clinix',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Recuperar contraseña</h2>
        <p>Hola ${name},</p>
        <p>Usá este código para restablecer tu contraseña. Vence en 10 minutos:</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px;">${code}</p>
        <p>Si no pediste este cambio, podés ignorar este mensaje.</p>
      </div>
    `,
  }
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
