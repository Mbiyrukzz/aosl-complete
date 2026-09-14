import mongoose from 'mongoose'

const receiptLineItemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true, maxlength: 500 },
    qty: { type: Number, default: null },
    unitPrice: { type: Number, required: true, min: 0 },
    taxable: { type: Boolean, default: true },
  },
  { _id: false },
)

const receiptSchema = new mongoose.Schema(
  {
    refNumber: { type: String, required: true, unique: true }, // RCT-2024-0001

    // The invoice this receipt was issued against
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      required: true,
      index: true,
    },
    invoiceRefNumber: { type: String, required: true },
    invoiceType: { type: String, enum: ['generated', 'uploaded'], default: 'generated' },

    // ── Client / company (snapshotted at time of payment) ───────
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null,
    },
    clientName: { type: String, default: '' },
    clientEmail: { type: String, default: '' },
    clientAddress: { type: String, default: '' },

    // ── Money ────────────────────────────────────────────────────
    currency: { type: String, default: 'KES' },
    vatRate: { type: Number, default: 16 },
    lineItems: { type: [receiptLineItemSchema], default: [] },
    subtotal: { type: Number, default: 0 },
    vatAmount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    amountPaid: { type: Number, required: true, min: 0 },

    // ── Payment details ──────────────────────────────────────────
    paymentMethod: { type: String, default: '' }, // e.g. M-Pesa, Bank Transfer, Cash
    paymentReference: { type: String, default: '' }, // e.g. M-Pesa code / cheque no.
    paidAt: { type: Date, required: true, default: Date.now },

    // ── Generated PDF, once saved to the portal ─────────────────
    attachmentUrl: { type: String, default: '' },

    signatoryName: { type: String, default: '' },
    signatoryTitle: { type: String, default: '' },

    createdBy: { type: String, required: true },
  },
  { timestamps: true },
)

receiptSchema.statics.generateRefNumber = async function () {
  const year = new Date().getFullYear()
  const count = await this.countDocuments()
  const seq = String(count + 1).padStart(4, '0')
  return `RCT-${year}-${seq}`
}

// One receipt per invoice — mark-paid is idempotent against this
receiptSchema.index({ invoiceId: 1 }, { unique: true })

export const Receipt = mongoose.model('Receipt', receiptSchema)