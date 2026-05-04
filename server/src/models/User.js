import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    displayName: {
      type: String,
      default: '',
      trim: true,
    },
    role: {
      type: String,
      enum: ['client', 'staff', 'admin'],
      default: 'client',
      index: true,
    },
  },
  { timestamps: true },
)

export const User = mongoose.model('User', userSchema)
