import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

export const usersRouter = Router()

usersRouter.use(requireAuth)

// Lista de médicos/administradores — visible para cualquier usuario autenticado
// ?archived=true devuelve los médicos archivados en vez de los activos
usersRouter.get('/', async (req, res) => {
  const filter = req.query.archived === 'true' ? { archived: true } : { archived: { $ne: true } }
  const users = await User.find(filter).sort({ name: 1 })
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

// Activa o desactiva el login de un médico sin eliminarlo del listado
usersRouter.patch('/:id/active', requireAdmin, async (req, res) => {
  if (req.params.id === req.user.sub) {
    return res.status(400).json({ message: 'No podés desactivar tu propia cuenta' })
  }
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { active: !!req.body.active },
    { new: true }
  )
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
  res.json(user)
})

// Cambia el rol de un profesional (medico <-> admin)
usersRouter.patch('/:id/role', requireAdmin, async (req, res) => {
  const { role } = req.body
  if (!['admin', 'medico'].includes(role)) {
    return res.status(400).json({ message: 'Rol inválido' })
  }
  if (req.params.id === req.user.sub) {
    return res.status(400).json({ message: 'No podés cambiar tu propio rol' })
  }
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true })
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
  res.json(user)
})

// Archiva la cuenta (soft delete) en vez de borrarla — se puede restaurar
usersRouter.delete('/:id', requireAdmin, async (req, res) => {
  if (req.params.id === req.user.sub) {
    return res.status(400).json({ message: 'No podés eliminar tu propia cuenta' })
  }
  const user = await User.findByIdAndUpdate(req.params.id, { archived: true }, { new: true })
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
  res.json(user)
})

usersRouter.post('/:id/restore', requireAdmin, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { archived: false }, { new: true })
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
  res.json(user)
})
