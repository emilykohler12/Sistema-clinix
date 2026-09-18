import 'dotenv/config'
import fs from 'node:fs'
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import { authRouter } from './routes/auth.js'
import { patientsRouter } from './routes/patients.js'
import { usersRouter } from './routes/users.js'
import { uploadsRouter, uploadsDir } from './routes/uploads.js'

fs.mkdirSync(uploadsDir, { recursive: true })

const app = express()

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())
app.use('/uploads', express.static(uploadsDir))

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRouter)
app.use('/api/patients', patientsRouter)
app.use('/api/users', usersRouter)
app.use('/api/uploads', uploadsRouter)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ message: 'Error interno del servidor' })
})

const PORT = process.env.PORT || 4000

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`[server] Clinix API escuchando en http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error('[server] No se pudo conectar a la base de datos:', err.message)
    process.exit(1)
  })
