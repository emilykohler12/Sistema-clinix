import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    professional: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    duration: { type: Number, default: 30 }, // minutos
    price: { type: Number, default: 0 },
    paid: { type: Boolean, default: false },
    paymentType: { type: String, enum: ['obra_social', 'particular'], default: 'particular' },
    status: {
      type: String,
      enum: ['programado', 'confirmado', 'completado', 'cancelado', 'no_asistio'],
      default: 'programado',
    },
    cancelReason: { type: String, enum: ['cancelado', 'reprogramado', null], default: null },
    rescheduledTo: { type: Date, default: null },
    reminderSentAt: { type: Date, default: null },
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

appointmentSchema.index({ date: 1 })
appointmentSchema.index({ professional: 1, date: 1 })
appointmentSchema.index({ patient: 1, date: 1 })

export const Appointment = mongoose.model('Appointment', appointmentSchema)
