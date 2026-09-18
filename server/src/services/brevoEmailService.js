const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'

export async function sendBrevoEmail({ to, subject, html }) {
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
