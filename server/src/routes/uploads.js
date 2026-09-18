import { Router } from 'express'
import multer from 'multer'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { requireAuth } from '../middleware/auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const uploadsDir = path.join(__dirname, '..', '..', 'uploads')

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${crypto.randomUUID()}${ext}`)
  },
})

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_TYPES.has(file.mimetype)) {
      return cb(new Error('Formato de imagen no permitido'))
    }
    cb(null, true)
  },
})

export const uploadsRouter = Router()

uploadsRouter.use(requireAuth)

uploadsRouter.post('/', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No se envió ninguna imagen' })
  res.status(201).json({ url: `/uploads/${req.file.filename}` })
})

uploadsRouter.use((err, _req, res, _next) => {
  res.status(400).json({ message: err.message || 'Error al subir la imagen' })
})
