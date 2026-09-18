import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

export const usersRouter = Router()

usersRouter.use(requireAuth)

// Lista de médicos/administradores — visible para cualquier usuario autenticado
usersRouter.get('/', async (_req, res) => {
  const users = await User.find().sort({ name: 1 })
  res.json(users)
})

// Alta de un nuevo médico desde la sección "Médicos" — solo admin, no inicia sesión con esa cuenta
usersRouter.post('/', requireAdmin, async (req, res) => {
  const { name, email, password, specialty, role } = req.body

  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos' })
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' })
  }

  const normalizedEmail = email.toLowerCase().trim()
  const existing = await User.findOne({ email: normalizedEmail })
  if (existing) return res.status(409).json({ message: 'Ya existe una cuenta con ese email' })

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: role === 'admin' ? 'admin' : 'medico',
    specialty: specialty?.trim() || '',
  })

  res.status(201).json(user)
})

usersRouter.put('/:id', async (req, res) => {
  const { name, specialty, avatar } = req.body
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, specialty, avatar },
    { new: true, runValidators: true }
  )
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
  res.json(user)
})

usersRouter.delete('/:id', requireAdmin, async (req, res) => {
  if (req.params.id === req.user.sub) {
    return res.status(400).json({ message: 'No podés eliminar tu propia cuenta' })
  }
  const user = await User.findByIdAndDelete(req.params.id)
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
  res.status(204).send()
})
