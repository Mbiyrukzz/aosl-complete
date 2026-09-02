import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema(
  {
    // The actual M-Pesa confirmation code, e.g. "OEI2AK4Q16" — this is
    // what shows up on the customer's SMS and what you reconcile against.
    transId: { type: String, required: true, unique: true, index: true },

    businessShortCode: { type: String, index: true },
    billRefNumber: { type: String, index: true },
    amount: { type: Number, required: true },
    msisdn: { type: String },
    firstName: { type: String },

    // Raw Safaricom timestamp, format "yyyyMMddHHmmss" (e.g. "20260901143022")
    transTime: { type: String },
    // Parsed version of transTime, for sorting/display/reconciliation
    transactionDate: { type: Date },

    // Resolved prefix/site key, e.g. "SR", "HQ"
    site: { type: String, index: true },
    // The confirmation URL it was actually forwarded to (remote sites only)
    forwardedTo: { type: String },
    forwardStatus: {
      type: String,
      enum: ['forwarded', 'failed', 'local', 'unmatched'],
      default: 'forwarded',
    },

    rawPayload: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
)

paymentSchema.set('toJSON', { virtuals: true })

export const Payment = mongoose.model('Payment', paymentSchema)
