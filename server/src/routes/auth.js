import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'
import { sendBrevoEmail, passwordResetCodeEmail } from '../services/brevoEmailService.js'

export const authRouter = Router()

authRouter.post('/register', async (req, res) => {
  const { name, email, password, specialty } = req.body

  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos' })
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' })
  }

  const normalizedEmail = email.toLowerCase().trim()
  const existing = await User.findOne({ email: normalizedEmail })
  if (existing) {
    return res.status(409).json({ message: 'Ya existe una cuenta con ese email' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  // El registro público solo crea cuentas de médico; los admin se gestionan aparte.
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: 'medico',
    specialty: specialty?.trim() || '',
  })

  const token = jwt.sign(
    { sub: user._id.toString(), name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  )

  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, specialty: user.specialty },
  })
})

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos' })
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() })
  if (!user) return res.status(401).json({ message: 'Credenciales inválidas' })

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) return res.status(401).json({ message: 'Credenciales inválidas' })

  if (user.archived) return res.status(403).json({ message: 'Esta cuenta fue eliminada' })
  if (!user.active) return res.status(403).json({ message: 'Esta cuenta está desactivada. Contactá al administrador.' })

  const token = jwt.sign(
    { sub: user._id.toString(), name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  )

  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, specialty: user.specialty },
  })
})

authRouter.post('/forgot-password', async (req, res) => {
  const { email } = req.body
  if (!email?.trim()) return res.status(400).json({ message: 'El email es requerido' })

  const normalizedEmail = email.toLowerCase().trim()
  const user = await User.findOne({ email: normalizedEmail })

  // Responde siempre el mismo mensaje, exista o no la cuenta, para no filtrar qué emails están registrados
  if (user && !user.archived) {
    const code = String(Math.floor(100000 + Math.random() * 900000))
    user.resetCodeHash = await bcrypt.hash(code, 10)
    user.resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000)
    await user.save()

    try {
      const { subject, html } = passwordResetCodeEmail({ name: user.name, code })
      await sendBrevoEmail({ to: user.email, subject, html })
    } catch (err) {
      console.error('[email] No se pudo enviar el código de recuperación:', err.message)
    }
  }

  res.json({ message: 'Si el email existe, te enviamos un código de recuperación' })
})

authRouter.post('/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body
  if (!email?.trim() || !code?.trim() || !newPassword) {
    return res.status(400).json({ message: 'Email, código y nueva contraseña son requeridos' })
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' })
  }

  const normalizedEmail = email.toLowerCase().trim()
  const user = await User.findOne({ email: normalizedEmail }).select('+resetCodeHash +resetCodeExpires')
  if (!user || !user.resetCodeHash || !user.resetCodeExpires || user.resetCodeExpires.getTime() < Date.now()) {
    return res.status(400).json({ message: 'Código inválido o vencido' })
  }

  const validCode = await bcrypt.compare(code.trim(), user.resetCodeHash)
  if (!validCode) return res.status(400).json({ message: 'Código inválido o vencido' })

  user.passwordHash = await bcrypt.hash(newPassword, 10)
  user.resetCodeHash = null
  user.resetCodeExpires = null
  await user.save()

  res.json({ message: 'Contraseña actualizada correctamente' })
})

authRouter.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.sub).select('-passwordHash')
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
  res.json(user)
})
