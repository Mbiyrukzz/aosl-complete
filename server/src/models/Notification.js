import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: String, required: true, index: true }, // Firebase UID

    type: {
      type: String,
      enum: [
        // Existing — issue events
        'issue_commented',
        'issue_status_changed',
        'issue_assigned',
        'issue_shared',
        'issue_created',
        // New — reminder & business events
        'reminder',
        'invoice',
        'package_expiry',
        'domain_renewal',
        'general',
      ],
      required: true,
    },

    // ----- Issue-related (kept exactly as before; optional now) -----
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue',
      default: null,
    },
    issueTitle: { type: String, default: '' },
    actorUid: { type: String, default: '' },
    actorEmail: { type: String, default: '' },

    // ----- Universal display fields -----
    title: { type: String, default: '' }, // optional headline for non-issue notifications
    message: { type: String, required: true },

    // CTA shown on the notification card (e.g., "View invoice")
    actionUrl: { type: String, default: '' },
    actionLabel: { type: String, default: '' },

    // ----- Reminder linkage (only set when triggered by a reminder) -----
    reminderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reminder',
      default: null,
    },

    // ----- Multi-channel delivery tracking -----
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
      // inApp delivery is implicit — if the doc exists, it was delivered in-app
    },

    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
)

// Existing compound index — keep it
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 })

export const Notification = mongoose.model('Notification', notificationSchema)
