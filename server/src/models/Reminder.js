import mongoose from 'mongoose'

const reminderSchema = new mongoose.Schema(
  {
    // PRIMARY — who the reminder is FOR
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },

    // OPTIONAL — narrow to a single user within the company.
    // Null means "everyone at this company gets it."
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    category: {
      type: String,
      enum: [
        'invoice',
        'package_expiry',
        'domain_renewal',
        'general',
        'support',
      ],
      default: 'general',
      index: true,
    },

    relatedType: {
      type: String,
      enum: ['Invoice', 'Package', 'Domain', null],
      default: null,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    scheduledFor: { type: Date, required: true, index: true },

    recurrence: {
      type: String,
      enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'],
      default: 'none',
    },
    recurrenceEndDate: { type: Date, default: null },

    channels: {
      email: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: false },
      inApp: { type: Boolean, default: true },
    },

    status: {
      type: String,
      enum: ['scheduled', 'sent', 'failed', 'cancelled'],
      default: 'scheduled',
      index: true,
    },

    lastAttemptAt: { type: Date, default: null },
    lastError: { type: String, default: '' },
    sentAt: { type: Date, default: null },

    createdBy: { type: String, default: 'system' },
  },
  { timestamps: true },
)

reminderSchema.index({ status: 1, scheduledFor: 1 })
reminderSchema.index({ companyId: 1, status: 1 })

export const Reminder = mongoose.model('Reminder', reminderSchema)
