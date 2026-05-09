import mongoose from 'mongoose'

const packageSchema = new mongoose.Schema(
  {
    // OWNER — now the company, not a user
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },

    name: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, default: '', trim: true, maxlength: 1000 },

    type: {
      type: String,
      enum: [
        'hosting',
        'domain',
        'maintenance',
        'subscription',
        'license',
        'support_plan',
        'other',
      ],
      default: 'subscription',
      index: true,
    },

    price: {
      amount: { type: Number, default: 0 },
      currency: { type: String, default: 'KES', uppercase: true, trim: true },
      billingCycle: {
        type: String,
        enum: ['one_time', 'monthly', 'quarterly', 'yearly'],
        default: 'yearly',
      },
    },

    startDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true, index: true },

    status: {
      type: String,
      enum: ['active', 'expiring_soon', 'expired', 'cancelled'],
      default: 'active',
      index: true,
    },
    autoRenew: { type: Boolean, default: false },

    reminderDaysBefore: {
      type: [Number],
      default: [30, 14, 7, 1],
    },
    reminderChannels: {
      email: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: false },
      inApp: { type: Boolean, default: true },
    },

    reminderIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reminder',
      },
    ],

    notes: { type: String, default: '' },
  },
  { timestamps: true },
)

packageSchema.index({ status: 1, expiryDate: 1 })
packageSchema.index({ companyId: 1, status: 1 })

export const Package = mongoose.model('Package', packageSchema)
