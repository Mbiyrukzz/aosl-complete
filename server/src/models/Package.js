import mongoose from 'mongoose'

const packageSchema = new mongoose.Schema(
  {
    // Owner
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // What this package is
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: 1000,
    },

    // Type — drives reminder copy
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

    // Pricing (for invoice integration later)
    price: {
      amount: { type: Number, default: 0 },
      currency: { type: String, default: 'KES', uppercase: true, trim: true },
      billingCycle: {
        type: String,
        enum: ['one_time', 'monthly', 'quarterly', 'yearly'],
        default: 'yearly',
      },
    },

    // Lifecycle dates
    startDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true, index: true },

    // Status
    status: {
      type: String,
      enum: ['active', 'expiring_soon', 'expired', 'cancelled'],
      default: 'active',
      index: true,
    },
    autoRenew: { type: Boolean, default: false },

    // Notification config — used at creation time to seed reminders
    reminderDaysBefore: {
      type: [Number],
      default: [30, 14, 7, 1], // sensible defaults; admin can override
    },
    reminderChannels: {
      email: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: false },
      inApp: { type: Boolean, default: true },
    },

    // Reminders we created (so we can clean up on update/delete)
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

// Composite indexes for common admin queries
packageSchema.index({ status: 1, expiryDate: 1 })
packageSchema.index({ userId: 1, status: 1 })

export const Package = mongoose.model('Package', packageSchema)
