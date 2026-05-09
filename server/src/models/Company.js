import mongoose from 'mongoose'

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    tier: {
      type: String,
      enum: ['silver', 'gold', 'platinum'],
      default: 'silver',
      required: true,
      index: true,
    },

    primaryContactEmail: {
      type: String,
      lowercase: true,
      trim: true,
      default: '',
    },
    phone: { type: String, default: '', trim: true },
    website: { type: String, default: '', trim: true },
    address: { type: String, default: '', trim: true },

    status: {
      type: String,
      enum: ['active', 'on_hold', 'archived'],
      default: 'active',
      index: true,
    },

    accountManagerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    notes: { type: String, default: '', maxlength: 2000 },
  },
  { timestamps: true },
)

// Auto-generate slug from name if missing.
// Modern async hook signature — no `next` callback needed.
companySchema.pre('validate', function () {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60)
  }
})

export const Company = mongoose.model('Company', companySchema)
