import mongoose from 'mongoose'

const lineItemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true, maxlength: 500 },
    qty: { type: Number, default: null },
    unitPrice: { type: Number, required: true, min: 0 },
    taxable: { type: Boolean, default: true },
  },
  { _id: true },
)

const invoiceSchema = new mongoose.Schema(
  {
    refNumber: { type: String, required: true, unique: true }, // INV-2024-0001

    // Source — either converted from a Quotation or created directly
    type: {
      type: String,
      enum: ['generated', 'uploaded'],
      default: 'generated',
    },
    quotationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quotation',
      default: null,
    },

    // eTIMS uploaded PDF (type === 'uploaded')
    etimsRef: { type: String, default: '' }, // eTIMS invoice number
    attachmentUrl: { type: String, default: '' }, // stored file path

    // ── Client / company ───────────────────────────────────────
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null,
    },
    clientName: { type: String, default: '' },
    clientEmail: { type: String, default: '' },
    clientAddress: { type: String, default: '' },
    attn: { type: String, default: '' },

    // ── Money ──────────────────────────────────────────────────
    currency: { type: String, default: 'KES' },
    vatRate: { type: Number, default: 16 },
    lineItems: { type: [lineItemSchema], default: [] },
    subtotal: { type: Number, default: 0 },
    vatAmount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },

    // ── Status ─────────────────────────────────────────────────
    status: {
      type: String,
      enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
      default: 'draft',
      index: true,
    },

    // ── Dates ──────────────────────────────────────────────────
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date, default: null },
    paidAt: { type: Date, default: null },

    // ── Meta ───────────────────────────────────────────────────
    notes: { type: String, default: '' },
    subject: { type: String, default: '' },
    sentAt: { type: Date, default: null },
    sentTo: { type: String, default: '' },

    createdBy: { type: String, required: true },
  },
  { timestamps: true },
)

invoiceSchema.statics.generateRefNumber = async function () {
  const year = new Date().getFullYear()
  const count = await this.countDocuments()
  const seq = String(count + 1).padStart(4, '0')
  return `INV-${year}-${seq}`
}

invoiceSchema.index({ companyId: 1, createdAt: -1 })
invoiceSchema.index({ status: 1, dueDate: 1 })

export const Invoice = mongoose.model('Invoice', invoiceSchema)
