import mongoose from 'mongoose'

const subdocToJSON = {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    return ret
  },
}

const attachmentSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    url: { type: String, required: true },
    mimeType: { type: String, default: '' },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true, toJSON: subdocToJSON }
)

const noteEntrySchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now },
  },
  { _id: true, toJSON: subdocToJSON }
)

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
    medication: { type: String, trim: true, default: '' },
    weight: { type: Number },
    height: { type: Number },
    healthInsurance: { type: String, trim: true, default: '' },
    emergencyContactName: { type: String, trim: true, default: '' },
    emergencyContactPhone: { type: String, trim: true, default: '' },
    tutorName: { type: String, trim: true, default: '' },
    tutorPhone: { type: String, trim: true, default: '' },
    diagnosis: { type: String, trim: true, default: '' },
    assignedDoctor: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['activo', 'en_tratamiento', 'en_espera', 'internado', 'derivado', 'de_alta'],
      default: 'activo',
    },
    notes: { type: String, trim: true, default: '' },
    notesHistory: { type: [noteEntrySchema], default: [] },
    attachments: { type: [attachmentSchema], default: [] },
    avatar: { type: String, trim: true, default: '' },
    archived: { type: Boolean, default: false },
    lastVisitAt: { type: Date, default: Date.now },
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
