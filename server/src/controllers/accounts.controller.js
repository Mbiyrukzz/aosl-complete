import { Quotation } from '../models/Quotation.js'
import { Invoice } from '../models/Invoice.js'
import { Company } from '../models/Company.js'
import { sendEmail } from '../services/email.service.js'

/* ─── helpers ─────────────────────────────────────────────── */

/**
 * Recalculate subtotal, vatAmount, total from line items.
 * VAT is applied only to taxable lines.
 */
const calcTotals = (lineItems, vatRate) => {
  let subtotal = 0
  let taxableAmt = 0

  for (const item of lineItems) {
    const qty = item.qty ?? 1
    const amount = qty * item.unitPrice
    subtotal += amount
    if (item.taxable) taxableAmt += amount
  }

  const vatAmount = parseFloat(((taxableAmt * vatRate) / 100).toFixed(2))
  const total = parseFloat((subtotal + vatAmount).toFixed(2))
  subtotal = parseFloat(subtotal.toFixed(2))

  return { subtotal, vatAmount, total }
}

const populateCompany = (q) =>
  q.populate('companyId', 'name tier primaryContactEmail address')

/* ─── QUOTATIONS ──────────────────────────────────────────── */

export const listQuotations = async (req, res) => {
  try {
    const filter = {}
    if (req.query.status && req.query.status !== 'all')
      filter.status = req.query.status
    if (req.query.companyId) filter.companyId = req.query.companyId
    if (req.query.currency) filter.currency = req.query.currency

    const quotations = await populateCompany(
      Quotation.find(filter).sort({ createdAt: -1 }).limit(200),
    ).lean()

    res.json({ quotations })
  } catch (err) {
    console.error('listQuotations error:', err)
    res.status(500).json({ error: 'Failed to fetch quotations' })
  }
}

export const getQuotation = async (req, res) => {
  try {
    const q = await populateCompany(Quotation.findById(req.params.id)).lean()
    if (!q) return res.status(404).json({ error: 'Quotation not found' })
    res.json({ quotation: q })
  } catch (err) {
    console.error('getQuotation error:', err)
    res.status(500).json({ error: 'Failed to fetch quotation' })
  }
}

export const createQuotation = async (req, res) => {
  try {
    const {
      companyId,
      clientName,
      clientEmail,
      clientAddress,
      attn,
      currency = 'KES',
      vatRate = 16,
      lineItems = [],
      subject = '',
      notes = '',
      issueDate,
      validUntil,
    } = req.body

    if (!lineItems.length) {
      return res.status(400).json({ error: 'At least one line item required' })
    }

    // Auto-populate client details from company if companyId is provided
    let resolvedClientName = clientName
    let resolvedClientEmail = clientEmail
    let resolvedClientAddress = clientAddress

    if (companyId && (!clientName || !clientEmail)) {
      const company = await Company.findById(companyId).lean()
      if (company) {
        resolvedClientName = resolvedClientName || company.name
        resolvedClientEmail = resolvedClientEmail || company.primaryContactEmail
        resolvedClientAddress = resolvedClientAddress || company.address
      }
    }

    const { subtotal, vatAmount, total } = calcTotals(lineItems, vatRate)
    const refNumber = await Quotation.generateRefNumber()

    const quotation = await Quotation.create({
      refNumber,
      companyId: companyId || null,
      clientName: resolvedClientName,
      clientEmail: resolvedClientEmail,
      clientAddress: resolvedClientAddress,
      attn,
      currency,
      vatRate,
      lineItems,
      subtotal,
      vatAmount,
      total,
      subject,
      notes,
      issueDate: issueDate || new Date(),
      validUntil: validUntil || null,
      createdBy: req.user.uid,
    })

    res.status(201).json({ quotation: quotation.toObject() })
  } catch (err) {
    console.error('createQuotation error:', err)
    res.status(500).json({ error: 'Failed to create quotation' })
  }
}

export const updateQuotation = async (req, res) => {
  try {
    const q = await Quotation.findById(req.params.id)
    if (!q) return res.status(404).json({ error: 'Quotation not found' })
    if (q.status === 'converted') {
      return res
        .status(400)
        .json({ error: 'Cannot edit a converted quotation' })
    }

    const allowed = [
      'companyId',
      'clientName',
      'clientEmail',
      'clientAddress',
      'attn',
      'currency',
      'vatRate',
      'lineItems',
      'subject',
      'notes',
      'issueDate',
      'validUntil',
      'status',
    ]
    for (const k of allowed) {
      if (req.body[k] !== undefined) q[k] = req.body[k]
    }

    // Recalculate if financials changed
    if (req.body.lineItems || req.body.vatRate !== undefined) {
      const t = calcTotals(q.lineItems, q.vatRate)
      q.subtotal = t.subtotal
      q.vatAmount = t.vatAmount
      q.total = t.total
    }

    await q.save()
    res.json({ quotation: q.toObject() })
  } catch (err) {
    console.error('updateQuotation error:', err)
    res.status(500).json({ error: 'Failed to update quotation' })
  }
}

export const deleteQuotation = async (req, res) => {
  try {
    const q = await Quotation.findById(req.params.id)
    if (!q) return res.status(404).json({ error: 'Quotation not found' })
    if (q.status === 'converted') {
      return res
        .status(400)
        .json({ error: 'Cannot delete a converted quotation' })
    }
    await q.deleteOne()
    res.json({ success: true })
  } catch (err) {
    console.error('deleteQuotation error:', err)
    res.status(500).json({ error: 'Failed to delete quotation' })
  }
}

/* ─── SEND QUOTATION BY EMAIL ─────────────────────────────── */

export const sendQuotation = async (req, res) => {
  try {
    const q = await Quotation.findById(req.params.id).lean()
    if (!q) return res.status(404).json({ error: 'Quotation not found' })

    const to = req.body.email || q.clientEmail
    if (!to)
      return res.status(400).json({ error: 'No recipient email address' })

    // The PDF is generated client-side and sent as a base64 attachment
    const { pdfBase64 } = req.body

    const html = buildQuotationEmail(q)

    const mailOptions = {
      to,
      subject: `Quotation ${q.refNumber}${q.subject ? ` — ${q.subject}` : ''} | Ashmif Office Solutions`,
      html,
      text: `Please find attached quotation ${q.refNumber} from Ashmif Office Solutions.\n\nTotal: ${q.currency} ${q.total.toLocaleString()}\n\nContact us at hello@ashmif.com or 0758-839-829.`,
    }

    // Attach the PDF if the client sent base64
    if (pdfBase64) {
      mailOptions.attachments = [
        {
          filename: `${q.refNumber}.pdf`,
          content: Buffer.from(pdfBase64, 'base64'),
          contentType: 'application/pdf',
        },
      ]
    }

    await sendEmail(mailOptions)

    // Mark as sent
    await Quotation.findByIdAndUpdate(req.params.id, {
      status: q.status === 'draft' ? 'sent' : q.status,
      sentAt: new Date(),
      sentTo: to,
    })

    res.json({ success: true, sentTo: to })
  } catch (err) {
    console.error('sendQuotation error:', err)
    res.status(500).json({ error: 'Failed to send quotation' })
  }
}

/* ─── CONVERT QUOTATION → INVOICE ────────────────────────── */

export const convertQuotation = async (req, res) => {
  try {
    const q = await Quotation.findById(req.params.id).lean()
    if (!q) return res.status(404).json({ error: 'Quotation not found' })
    if (q.status === 'converted') {
      return res.status(400).json({ error: 'Already converted' })
    }

    const refNumber = await Invoice.generateRefNumber()
    const dueDate = req.body.dueDate || null

    const invoice = await Invoice.create({
      refNumber,
      type: 'generated',
      quotationId: q._id,
      companyId: q.companyId,
      clientName: q.clientName,
      clientEmail: q.clientEmail,
      clientAddress: q.clientAddress,
      attn: q.attn,
      currency: q.currency,
      vatRate: q.vatRate,
      lineItems: q.lineItems,
      subtotal: q.subtotal,
      vatAmount: q.vatAmount,
      total: q.total,
      subject: q.subject,
      notes: q.notes,
      issueDate: new Date(),
      dueDate,
      status: 'draft',
      createdBy: req.user.uid,
    })

    // Mark quotation as converted
    await Quotation.findByIdAndUpdate(q._id, {
      status: 'converted',
      convertedToInvoiceId: invoice._id,
    })

    res.status(201).json({ invoice: invoice.toObject() })
  } catch (err) {
    console.error('convertQuotation error:', err)
    res.status(500).json({ error: 'Failed to convert quotation' })
  }
}

/* ─── INVOICES ────────────────────────────────────────────── */

export const listInvoices = async (req, res) => {
  try {
    const filter = {}
    if (req.query.status && req.query.status !== 'all')
      filter.status = req.query.status
    if (req.query.companyId) filter.companyId = req.query.companyId
    if (req.query.type) filter.type = req.query.type

    const invoices = await populateCompany(
      Invoice.find(filter).sort({ createdAt: -1 }).limit(200),
    ).lean()

    res.json({ invoices })
  } catch (err) {
    console.error('listInvoices error:', err)
    res.status(500).json({ error: 'Failed to fetch invoices' })
  }
}

export const getInvoice = async (req, res) => {
  try {
    const inv = await populateCompany(Invoice.findById(req.params.id)).lean()
    if (!inv) return res.status(404).json({ error: 'Invoice not found' })
    res.json({ invoice: inv })
  } catch (err) {
    console.error('getInvoice error:', err)
    res.status(500).json({ error: 'Failed to fetch invoice' })
  }
}

export const createInvoice = async (req, res) => {
  try {
    const {
      companyId,
      clientName,
      clientEmail,
      clientAddress,
      attn,
      currency = 'KES',
      vatRate = 16,
      lineItems = [],
      subject = '',
      notes = '',
      issueDate,
      dueDate,
    } = req.body

    if (!lineItems.length) {
      return res.status(400).json({ error: 'At least one line item required' })
    }

    let resolvedClientName = clientName
    let resolvedClientEmail = clientEmail
    let resolvedClientAddress = clientAddress

    if (companyId && (!clientName || !clientEmail)) {
      const company = await Company.findById(companyId).lean()
      if (company) {
        resolvedClientName = resolvedClientName || company.name
        resolvedClientEmail = resolvedClientEmail || company.primaryContactEmail
        resolvedClientAddress = resolvedClientAddress || company.address
      }
    }

    const { subtotal, vatAmount, total } = calcTotals(lineItems, vatRate)
    const refNumber = await Invoice.generateRefNumber()

    const invoice = await Invoice.create({
      refNumber,
      type: 'generated',
      companyId: companyId || null,
      clientName: resolvedClientName,
      clientEmail: resolvedClientEmail,
      clientAddress: resolvedClientAddress,
      attn,
      currency,
      vatRate,
      lineItems,
      subtotal,
      vatAmount,
      total,
      subject,
      notes,
      issueDate: issueDate || new Date(),
      dueDate: dueDate || null,
      createdBy: req.user.uid,
    })

    res.status(201).json({ invoice: invoice.toObject() })
  } catch (err) {
    console.error('createInvoice error:', err)
    res.status(500).json({ error: 'Failed to create invoice' })
  }
}

export const updateInvoice = async (req, res) => {
  try {
    const inv = await Invoice.findById(req.params.id)
    if (!inv) return res.status(404).json({ error: 'Invoice not found' })

    const allowed = [
      'clientName',
      'clientEmail',
      'clientAddress',
      'attn',
      'currency',
      'vatRate',
      'lineItems',
      'subject',
      'notes',
      'issueDate',
      'dueDate',
      'status',
      'paidAt',
      'etimsRef',
    ]
    for (const k of allowed) {
      if (req.body[k] !== undefined) inv[k] = req.body[k]
    }

    if (req.body.lineItems || req.body.vatRate !== undefined) {
      const t = calcTotals(inv.lineItems, inv.vatRate)
      inv.subtotal = t.subtotal
      inv.vatAmount = t.vatAmount
      inv.total = t.total
    }

    await inv.save()
    res.json({ invoice: inv.toObject() })
  } catch (err) {
    console.error('updateInvoice error:', err)
    res.status(500).json({ error: 'Failed to update invoice' })
  }
}

/* ─── UPLOAD eTIMS INVOICE PDF ───────────────────────────── */

export const uploadInvoicePDF = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

    const {
      etimsRef,
      companyId,
      clientName,
      clientEmail,
      dueDate,
      total,
      currency = 'KES',
    } = req.body
    const refNumber = await Invoice.generateRefNumber()

    const invoice = await Invoice.create({
      refNumber,
      type: 'uploaded',
      etimsRef: etimsRef || '',
      attachmentUrl: `/uploads/${req.file.filename}`,
      companyId: companyId || null,
      clientName: clientName || '',
      clientEmail: clientEmail || '',
      currency,
      // Uploaded invoices have a single "total" line — no breakdown available
      lineItems: total
        ? [
            {
              description: 'eTIMS Invoice',
              qty: null,
              unitPrice: parseFloat(total),
              taxable: false,
            },
          ]
        : [],
      subtotal: parseFloat(total) || 0,
      vatAmount: 0,
      total: parseFloat(total) || 0,
      dueDate: dueDate || null,
      status: 'sent',
      createdBy: req.user.uid,
    })

    res.status(201).json({ invoice: invoice.toObject() })
  } catch (err) {
    console.error('uploadInvoicePDF error:', err)
    res.status(500).json({ error: 'Failed to upload invoice' })
  }
}

/* ─── SEND INVOICE BY EMAIL ──────────────────────────────── */

export const sendInvoice = async (req, res) => {
  try {
    const inv = await Invoice.findById(req.params.id).lean()
    if (!inv) return res.status(404).json({ error: 'Invoice not found' })

    const to = req.body.email || inv.clientEmail
    if (!to)
      return res.status(400).json({ error: 'No recipient email address' })

    const { pdfBase64 } = req.body
    const html = buildInvoiceEmail(inv)

    const mailOptions = {
      to,
      subject: `Invoice ${inv.refNumber}${inv.subject ? ` — ${inv.subject}` : ''} | Ashmif Office Solutions`,
      html,
      text: `Please find attached invoice ${inv.refNumber}.\n\nTotal: ${inv.currency} ${inv.total.toLocaleString()}\n\nContact us at hello@ashmif.com`,
    }

    if (pdfBase64) {
      mailOptions.attachments = [
        {
          filename: `${inv.refNumber}.pdf`,
          content: Buffer.from(pdfBase64, 'base64'),
          contentType: 'application/pdf',
        },
      ]
    }

    // For uploaded eTIMS invoices, attach the original file too
    if (inv.type === 'uploaded' && inv.attachmentUrl) {
      const fs = await import('fs')
      const path = await import('path')
      const filePath = path.join(process.cwd(), inv.attachmentUrl)
      if (fs.existsSync(filePath)) {
        mailOptions.attachments = mailOptions.attachments || []
        mailOptions.attachments.push({
          filename: `${inv.etimsRef || inv.refNumber}-etims.pdf`,
          content: fs.readFileSync(filePath),
          contentType: 'application/pdf',
        })
      }
    }

    await sendEmail(mailOptions)

    await Invoice.findByIdAndUpdate(inv._id, {
      status: 'sent',
      sentAt: new Date(),
      sentTo: to,
    })

    res.json({ success: true, sentTo: to })
  } catch (err) {
    console.error('sendInvoice error:', err)
    res.status(500).json({ error: 'Failed to send invoice' })
  }
}

/* ─── ACCOUNTS DASHBOARD STATS ───────────────────────────── */

export const getAccountsStats = async (req, res) => {
  try {
    const [quotations, invoices] = await Promise.all([
      Quotation.find().select('status total currency').lean(),
      Invoice.find().select('status total currency dueDate').lean(),
    ])

    const totalQuoted = quotations.reduce(
      (s, q) => s + (q.currency === 'KES' ? q.total : 0),
      0,
    )
    const totalInvoiced = invoices
      .filter((i) => i.status !== 'cancelled')
      .reduce((s, i) => s + (i.currency === 'KES' ? i.total : 0), 0)
    const totalPaid = invoices
      .filter((i) => i.status === 'paid')
      .reduce((s, i) => s + (i.currency === 'KES' ? i.total : 0), 0)
    const totalOverdue = invoices.filter(
      (i) =>
        i.status === 'overdue' ||
        (i.status === 'sent' && i.dueDate && new Date(i.dueDate) < new Date()),
    ).length

    res.json({
      stats: {
        quotations: {
          total: quotations.length,
          draft: quotations.filter((q) => q.status === 'draft').length,
          sent: quotations.filter((q) => q.status === 'sent').length,
          accepted: quotations.filter((q) => q.status === 'accepted').length,
        },
        invoices: {
          total: invoices.length,
          sent: invoices.filter((i) => i.status === 'sent').length,
          paid: invoices.filter((i) => i.status === 'paid').length,
          overdue: totalOverdue,
        },
        totals: {
          quoted: totalQuoted,
          invoiced: totalInvoiced,
          paid: totalPaid,
        },
      },
    })
  } catch (err) {
    console.error('getAccountsStats error:', err)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
}

/* ─── EMAIL TEMPLATES ────────────────────────────────────── */

const fmt = (n, currency) =>
  `${currency} ${Number(n).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`

const buildQuotationEmail = (q) => `
<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;color:#1a1a1a;max-width:600px;margin:0 auto;padding:20px">
  <div style="text-align:center;margin-bottom:24px">
    <h2 style="margin:0;color:#1a1a1a">ASHMIF OFFICE SOLUTIONS LTD</h2>
    <p style="margin:4px 0;color:#6b7280;font-size:13px">hello@ashmif.com · 0758-839-829 · www.ashmif.com</p>
  </div>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin-bottom:24px"/>
  <p>Dear ${q.attn || q.clientName || 'Client'},</p>
  <p>Please find below quotation <strong>${q.refNumber}</strong>${q.subject ? ` for <em>${q.subject}</em>` : ''} as requested.</p>
  <table width="100%" style="border-collapse:collapse;margin:20px 0;font-size:14px">
    <thead>
      <tr style="background:#f3f4f6">
        <th style="padding:8px 12px;text-align:left;border:1px solid #e5e7eb">Description</th>
        <th style="padding:8px 12px;text-align:right;border:1px solid #e5e7eb">Qty</th>
        <th style="padding:8px 12px;text-align:right;border:1px solid #e5e7eb">Unit Price</th>
        <th style="padding:8px 12px;text-align:right;border:1px solid #e5e7eb">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${q.lineItems
        .map(
          (item) => `
        <tr>
          <td style="padding:8px 12px;border:1px solid #e5e7eb">${item.description}${!item.taxable ? ' <span style="color:#6b7280;font-size:11px">(excl. VAT)</span>' : ''}</td>
          <td style="padding:8px 12px;text-align:right;border:1px solid #e5e7eb">${item.qty ?? '—'}</td>
          <td style="padding:8px 12px;text-align:right;border:1px solid #e5e7eb">${fmt(item.unitPrice, q.currency)}</td>
          <td style="padding:8px 12px;text-align:right;border:1px solid #e5e7eb">${fmt((item.qty ?? 1) * item.unitPrice, q.currency)}</td>
        </tr>`,
        )
        .join('')}
    </tbody>
    <tfoot>
      <tr><td colspan="3" style="padding:8px 12px;text-align:right;border:1px solid #e5e7eb"><strong>Subtotal</strong></td><td style="padding:8px 12px;text-align:right;border:1px solid #e5e7eb">${fmt(q.subtotal, q.currency)}</td></tr>
      <tr><td colspan="3" style="padding:8px 12px;text-align:right;border:1px solid #e5e7eb">VAT (${q.vatRate}%)</td><td style="padding:8px 12px;text-align:right;border:1px solid #e5e7eb">${fmt(q.vatAmount, q.currency)}</td></tr>
      <tr style="background:#f3f4f6"><td colspan="3" style="padding:10px 12px;text-align:right;border:1px solid #e5e7eb"><strong>TOTAL</strong></td><td style="padding:10px 12px;text-align:right;border:1px solid #e5e7eb"><strong>${fmt(q.total, q.currency)}</strong></td></tr>
    </tfoot>
  </table>
  ${q.validUntil ? `<p style="font-size:13px;color:#6b7280">Valid until: <strong>${new Date(q.validUntil).toLocaleDateString()}</strong></p>` : ''}
  ${q.notes ? `<p style="font-size:13px">${q.notes}</p>` : ''}
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
  <p style="font-size:12px;color:#6b7280;text-align:center">Ashmif Office Solutions Ltd · P.O. Box · Mombasa, Kenya · www.ashmif.com</p>
</body></html>`

const buildInvoiceEmail = (inv) =>
  buildQuotationEmail({
    ...inv,
    refNumber: inv.refNumber,
    subject: inv.subject,
  })
    .replace('quotation', 'invoice')
    .replace('Quotation', 'Invoice')
