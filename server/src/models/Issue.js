import mongoose from 'mongoose'

const attachmentSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
  },
  { timestamps: true, _id: true },
)

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true, maxlength: 2000 },
    authorUid: { type: String, required: true },
    authorEmail: { type: String, required: true },
    attachments: { type: [attachmentSchema], default: [] },
    // soft-delete: keep the doc but blank the text
    deleted: { type: Boolean, default: false },
    edited: { type: Boolean, default: false },
    editedAt: { type: Date, default: null },
  },
  { timestamps: true },
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
    createdBy: { type: String, required: true, index: true },
    createdByEmail: { type: String, required: true },

    createdByStaffUid: { type: String, default: null, index: true },
    assignedTo: { type: String, default: null, index: true },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null,
      index: true,
    },
    companyTier: {
      type: String,
      enum: ['silver', 'gold', 'platinum', null],
      default: null,
      index: true,
    },

    slaDeadline: { type: Date, default: null, index: true },
    escalated: { type: Boolean, default: false, index: true },

    comments: [commentSchema],
    attachments: [attachmentSchema],
  },
  { timestamps: true },
)

issueSchema.index({ createdBy: 1, createdAt: -1 })
issueSchema.index({ companyTier: 1, status: 1, createdAt: 1 })

issueSchema.virtual('commentCount').get(function () {
  return this.comments?.filter((c) => !c.deleted).length || 0
})
issueSchema.virtual('slaBreached').get(function () {
  if (!this.slaDeadline) return false
  if (this.status === 'resolved' || this.status === 'closed') return false
  return new Date() > this.slaDeadline
})
issueSchema.virtual('slaTimeRemaining').get(function () {
  if (!this.slaDeadline) return null
  if (this.status === 'resolved' || this.status === 'closed') return null
  return this.slaDeadline - new Date()
})

issueSchema.set('toJSON', { virtuals: true })
issueSchema.set('toObject', { virtuals: true })

export const Issue = mongoose.model('Issue', issueSchema)
