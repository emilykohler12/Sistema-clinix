import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { connectDB } from './config/db.js'
import { User } from './models/User.js'
import { Patient } from './models/Patient.js'
import mongoose from 'mongoose'

const samplePatients = [
  {
    name: 'María González',
    documentId: '32456789',
    birthDate: '1988-03-14',
    gender: 'femenino',
    phone: '+54 11 4455-6677',
    email: 'maria.gonzalez@mail.com',
    bloodType: 'O+',
    allergies: 'Penicilina',
    diagnosis: 'Hipertensión controlada',
    assignedDoctor: 'Dr. Sergio Paredes',
    status: 'activo',
    notes: 'Control trimestral de presión arterial.',
  },
  {
    name: 'Juan Pérez',
    documentId: '28765432',
    birthDate: '1975-11-02',
    gender: 'masculino',
    phone: '+54 11 5544-3322',
    email: 'juan.perez@mail.com',
    bloodType: 'A+',
    allergies: 'Ninguna conocida',
    diagnosis: 'Diabetes tipo 2',
    assignedDoctor: 'Dra. Lucía Fernández',
    status: 'en_tratamiento',
    notes: 'Seguimiento mensual de glucemia.',
  },
  {
    name: 'Sofía Ramírez',
    documentId: '40123456',
    birthDate: '2001-07-22',
    gender: 'femenino',
    phone: '+54 11 3322-1100',
    email: 'sofia.ramirez@mail.com',
    bloodType: 'B-',
    allergies: 'Polen',
    diagnosis: 'Consulta de rutina',
    assignedDoctor: 'Dr. Sergio Paredes',
    status: 'de_alta',
    notes: '',
  },
]

async function seed() {
  await connectDB()

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@clinix.com'
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin1234'

  const existingAdmin = await User.findOne({ email: adminEmail })
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10)
    await User.create({
      name: 'Administrador',
      email: adminEmail,
      passwordHash,
      role: 'admin',
    })
    console.log(`[seed] Usuario admin creado: ${adminEmail} / ${adminPassword}`)
  } else {
    console.log(`[seed] Usuario admin ya existía: ${adminEmail}`)
  }

  const patientCount = await Patient.countDocuments()
  if (patientCount === 0) {
    await Patient.insertMany(samplePatients)
    console.log(`[seed] ${samplePatients.length} pacientes de ejemplo creados`)
  } else {
    console.log('[seed] Ya hay pacientes cargados, no se insertan datos de ejemplo')
  }

  await mongoose.disconnect()
  process.exit(0)
}

seed().catch((err) => {
  console.error('[seed] Error:', err)
  process.exit(1)
})
