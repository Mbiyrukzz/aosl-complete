import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    authorUid: { type: String, required: true },
    authorEmail: { type: String, required: true },
  },
  { timestamps: true }, // each comment gets its own createdAt/updatedAt
)

const attachmentSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true }, // stored filename (with timestamp prefix)
    originalName: { type: String, required: true }, // user's original filename
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true }, // public URL
  },
  { timestamps: true, _id: true },
)

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal',
      index: true,
    },

    createdBy: { type: String, required: true, index: true }, // Firebase UID
    createdByEmail: { type: String, required: true },
    assignedTo: { type: String, default: null, index: true }, // Firebase UID of staff

    // ----- Company linkage (denormalized for fast queue queries) -----
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null, // staff/admin issues may not have one
      index: true,
    },
    companyTier: {
      type: String,
      enum: ['silver', 'gold', 'platinum', null],
      default: null,
      index: true,
    },

    // ----- SLA metadata -----
    slaDeadline: { type: Date, default: null, index: true },
    escalated: { type: Boolean, default: false, index: true },

    comments: [commentSchema],
    attachments: [attachmentSchema],
  },
  { timestamps: true },
)

// Compound index for the most common query: list user's issues, newest first
issueSchema.index({ createdBy: 1, createdAt: -1 })

// Compound index for the admin queue: tier-priority sort across open issues
issueSchema.index({ companyTier: 1, status: 1, createdAt: 1 })

// Virtual: comment count without sending the array down the wire
issueSchema.virtual('commentCount').get(function () {
  return this.comments?.length || 0
})

issueSchema.virtual('slaBreached').get(function () {
  if (!this.slaDeadline) return false
  if (this.status === 'resolved' || this.status === 'closed') return false
  return new Date() > this.slaDeadline
})

issueSchema.virtual('slaTimeRemaining').get(function () {
  if (!this.slaDeadline) return null
  if (this.status === 'resolved' || this.status === 'closed') return null
  const diff = this.slaDeadline - new Date()
  return diff // milliseconds, can be negative if breached
})

issueSchema.set('toJSON', { virtuals: true })
issueSchema.set('toObject', { virtuals: true })

export const Issue = mongoose.model('Issue', issueSchema)
