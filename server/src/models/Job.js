import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    department: {
      type: String,
      enum: ['engineering', 'design', 'product', 'business', 'other'],
      default: 'engineering',
    },
    location: { type: String, default: 'Remote', trim: true },
    type: {
      type: String,
      enum: ['full_time', 'part_time', 'contract', 'internship'],
      default: 'full_time',
    },
    description: { type: String, required: true, maxlength: 10000 },
    requirements: { type: String, default: '', maxlength: 5000 },
    salaryRange: { type: String, default: '', maxlength: 100 }, // e.g. "$50k–$80k" or "Competitive"
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
      index: true,
    },
    createdBy: { type: String, required: true }, // Firebase UID of admin
    createdByEmail: { type: String, required: true },
  },
  { timestamps: true },
)

jobSchema.index({ status: 1, createdAt: -1 })

export const Job = mongoose.model('Job', jobSchema)
