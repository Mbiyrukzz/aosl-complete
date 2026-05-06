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
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    company: {
      type: String,
      default: '',
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
      trim: true,
      maxlength: 500,
    },
    role: {
      type: String,
      enum: ['client', 'staff', 'admin'],
      default: 'client',
      index: true,
    },
    notificationPrefs: {
      emailIssueUpdates: { type: Boolean, default: true },
      emailNewsletters: { type: Boolean, default: false },
    },
  },
  { timestamps: true },
)

export const User = mongoose.model('User', userSchema)
