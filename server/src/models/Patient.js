import mongoose from 'mongoose'

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    documentId: { type: String, required: true, trim: true }, // DNI / documento
    birthDate: { type: Date },
    gender: { type: String, enum: ['femenino', 'masculino', 'otro'], default: 'otro' },
    phone: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, lowercase: true, default: '' },
    address: { type: String, trim: true, default: '' },
    bloodType: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''],
      default: '',
    },
    allergies: { type: String, trim: true, default: '' },
    diagnosis: { type: String, trim: true, default: '' },
    assignedDoctor: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['activo', 'en_tratamiento', 'en_espera', 'internado', 'derivado', 'de_alta'],
      default: 'activo',
    },
    notes: { type: String, trim: true, default: '' },
    avatar: { type: String, trim: true, default: '' },
    archived: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  }
)

patientSchema.index({ name: 'text', documentId: 'text' })

export const Patient = mongoose.model('Patient', patientSchema)
