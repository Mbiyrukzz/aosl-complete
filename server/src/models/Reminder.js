import mongoose from 'mongoose'

const reminderSchema = new mongoose.Schema(
  {
    // Who this reminder is for (the client receiving it)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // What this reminder is about
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
    // What kind of thing is being reminded about
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
    // Optional link to a related entity (invoice ID, package ID, etc.)
    relatedType: {
      type: String,
      enum: ['Invoice', 'Package', 'Domain', null],
      default: null,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    // Scheduling
    scheduledFor: {
      type: Date,
      required: true,
      index: true,
    },
    // Recurrence (null = one-time)
    recurrence: {
      type: String,
      enum: ['none', 'daily', 'weekly', 'monthly', 'yearly'],
      default: 'none',
    },
    recurrenceEndDate: {
      type: Date,
      default: null,
    },
    // Channels to send through
    channels: {
      email: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: false },
      inApp: { type: Boolean, default: true },
    },
    // Status — drives the worker
    status: {
      type: String,
      enum: ['scheduled', 'sent', 'failed', 'cancelled'],
      default: 'scheduled',
      index: true,
    },
    // Last attempt info
    lastAttemptAt: { type: Date, default: null },
    lastError: { type: String, default: '' },
    sentAt: { type: Date, default: null },
    // Who created it (admin user, or 'system' for auto-generated)
    createdBy: {
      type: String,
      default: 'system',
    },
  },
  { timestamps: true },
)

// Composite index for the worker query: find reminders due now
reminderSchema.index({ status: 1, scheduledFor: 1 })

export const Reminder = mongoose.model('Reminder', reminderSchema)
