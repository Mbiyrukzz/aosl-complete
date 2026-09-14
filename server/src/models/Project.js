import mongoose from 'mongoose'

const projectUpdateSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, maxlength: 2000 },
    progress: { type: Number, min: 0, max: 100 },
    status: {
      type: String,
      enum: [
        'not_started',
        'in_progress',
        'review',
        'completed',
        'on_hold',
        'cancelled',
      ],
    },
    authorUid: { type: String, required: true },
    authorName: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
)

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, default: '', maxlength: 4000 },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    // Denormalized from Company.tier at creation time, same pattern as Issue.companyTier —
    // kept for fast sorting/filtering without an extra populate.
    companyTier: {
      type: String,
      enum: ['silver', 'gold', 'platinum'],
      default: 'silver',
    },

    status: {
      type: String,
      enum: [
        'not_started',
        'in_progress',
        'review',
        'completed',
        'on_hold',
        'cancelled',
      ],
      default: 'not_started',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal',
    },

    startDate: { type: Date, default: Date.now },
    dueDate: { type: Date, default: null },
    completedAt: { type: Date, default: null },

    progress: { type: Number, min: 0, max: 100, default: 0 },

    assignedStaff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: String, required: true }, // Firebase uid of the staff/admin who started it

    // Client-visible progress timeline — each entry can optionally bump status/progress
    updates: [projectUpdateSchema],

    // Staff-only — never returned to the client (stripped in the client-facing controllers)
    notes: { type: String, default: '', maxlength: 2000 },
  },
  { timestamps: true },
)

projectSchema.index({ companyId: 1, status: 1 })

export const Project = mongoose.model('Project', projectSchema)