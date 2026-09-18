import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'medico'], default: 'medico' },
    specialty: { type: String, trim: true, default: '' },
    avatar: { type: String, trim: true, default: '' },
    active: { type: Boolean, default: true },
    archived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
        delete ret.passwordHash
        return ret
      },
    },
  }
)

export const User = mongoose.model('User', userSchema)
