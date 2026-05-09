import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: String, required: true, index: true }, // Firebase UID
    type: {
      type: String,
      enum: [
        // Issue events
        'issue_commented',
        'issue_status_changed',
        'issue_assigned',
        'issue_shared',
        'issue_created',
        // SLA escalation — fired by the sla-worker
        'sla_breach',
        // Reminder & business events
        'reminder',
        'invoice',
        'package_expiry',
        'domain_renewal',
        'general',
      ],
      required: true,
    },

    // Issue-related (optional)
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue',
      default: null,
    },
    issueTitle: { type: String, default: '' },
    actorUid: { type: String, default: '' },
    actorEmail: { type: String, default: '' },

    // Universal display fields
    title: { type: String, default: '' },
    message: { type: String, required: true },
    actionUrl: { type: String, default: '' },
    actionLabel: { type: String, default: '' },

    // Reminder linkage
    reminderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reminder',
      default: null,
    },

    // Multi-channel delivery tracking
    delivery: {
      email: {
        attempted: { type: Boolean, default: false },
        delivered: { type: Boolean, default: false },
        error: { type: String, default: '' },
      },
      whatsapp: {
        attempted: { type: Boolean, default: false },
        delivered: { type: Boolean, default: false },
        error: { type: String, default: '' },
      },
    },

    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
)

notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 })

export const Notification = mongoose.model('Notification', notificationSchema)
