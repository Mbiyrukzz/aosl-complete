import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: String, required: true, index: true }, // Firebase UID
    type: {
      type: String,
      enum: [
        'issue_commented',
        'issue_status_changed',
        'issue_assigned',
        'issue_shared',
        'issue_created ',
      ],
      required: true,
    },
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Issue',
      required: true,
    },
    issueTitle: { type: String, required: true }, // denormalized for fast list rendering
    actorUid: { type: String, required: true },
    actorEmail: { type: String, required: true },
    message: { type: String, required: true }, // pre-rendered: "Alice commented on..."
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
)

// Compound index: list a user's unread notifications, newest first
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 })

export const Notification = mongoose.model('Notification', notificationSchema)
