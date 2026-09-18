import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'

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

authRouter.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.sub).select('-passwordHash')
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
  res.json(user)
})
