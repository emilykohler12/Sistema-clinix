import mongoose from 'mongoose'

export async function connectDB() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('Falta MONGODB_URI en las variables de entorno')

  mongoose.connection.on('connected', () => console.log('[db] Conectado a MongoDB'))
  mongoose.connection.on('error', (err) => console.error('[db] Error de conexión:', err.message))

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
}
