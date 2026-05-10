import mongoose from 'mongoose'

const lineItemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true, maxlength: 500 },
    qty: { type: Number, default: null }, // null = service (no qty)
    unitPrice: { type: Number, required: true, min: 0 },
    taxable: { type: Boolean, default: true }, // per-line VAT toggle
  },
  { _id: true },
)

const quotationSchema = new mongoose.Schema(
  {
    // ── Reference ──────────────────────────────────────────────
    refNumber: { type: String, required: true, unique: true }, // e.g. QUO-2024-0001

    // ── Client / company ───────────────────────────────────────
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null,
    },
    // Free-text fields for one-off clients not in the system
    clientName: { type: String, default: '' },
    clientEmail: { type: String, default: '' },
    clientAddress: { type: String, default: '' },
    attn: { type: String, default: '' }, // "Attn: Mr. Said"

    // ── Money ──────────────────────────────────────────────────
    currency: { type: String, default: 'KES' }, // ISO 4217
    vatRate: { type: Number, default: 16 }, // percentage, e.g. 16 = 16%

    lineItems: { type: [lineItemSchema], default: [] },

    // Computed totals — stored so we can sort/filter without recalculating
    subtotal: { type: Number, default: 0 },
    vatAmount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },

    // ── Status ─────────────────────────────────────────────────
    status: {
      type: String,
      enum: ['draft', 'sent', 'accepted', 'declined', 'converted'],
      default: 'draft',
      index: true,
    },

    // ── Dates ──────────────────────────────────────────────────
    issueDate: { type: Date, default: Date.now },
    validUntil: { type: Date, default: null },

    // ── Meta ───────────────────────────────────────────────────
    notes: { type: String, default: '' },
    subject: { type: String, default: '' }, // email subject / doc title
    sentAt: { type: Date, default: null },
    sentTo: { type: String, default: '' }, // email address it was sent to

    // Set when converted → Invoice
    convertedToInvoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      default: null,
    },

    createdBy: { type: String, required: true }, // Firebase UID of admin
  },
  { timestamps: true },
)

// Auto-increment helper — stored as a simple counter in a separate collection
// We just use a timestamp-based slug for simplicity; swap for a real counter if needed.
quotationSchema.statics.generateRefNumber = async function () {
  const year = new Date().getFullYear()
  const count = await this.countDocuments()
  const seq = String(count + 1).padStart(4, '0')
  return `QUO-${year}-${seq}`
}

quotationSchema.index({ companyId: 1, createdAt: -1 })
quotationSchema.index({ status: 1, createdAt: -1 })

export const Quotation = mongoose.model('Quotation', quotationSchema)
