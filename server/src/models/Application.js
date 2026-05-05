import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema(
  {
    // null = general "send us your CV" application; otherwise specific job
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', default: null },
    jobTitle: { type: String, default: '' }, // denormalized for fast list rendering

    // Applicant info
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '', trim: true, maxlength: 30 },
    coverLetter: { type: String, default: '', maxlength: 5000 },

    // CV file
    cvFilename: { type: String, required: true },
    cvOriginalName: { type: String, required: true },
    cvUrl: { type: String, required: true },

    status: {
      type: String,
      enum: ['new', 'reviewing', 'shortlisted', 'rejected', 'hired'],
      default: 'new',
      index: true,
    },
  },
  { timestamps: true },
)

applicationSchema.index({ jobId: 1, createdAt: -1 })

export const Application = mongoose.model('Application', applicationSchema)
