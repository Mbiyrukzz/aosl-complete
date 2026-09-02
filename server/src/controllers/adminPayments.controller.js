import { Payment } from '../models/Payment.js'

export const listPayments = async (req, res) => {
  const { site, forwardStatus, page = 1, limit = 25 } = req.query
  const filter = {}
  if (site) filter.site = site.toUpperCase()
  if (forwardStatus) filter.forwardStatus = forwardStatus

  const skip = (Number(page) - 1) * Number(limit)
  const [payments, total] = await Promise.all([
    Payment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Payment.countDocuments(filter),
  ])

  res.json({ payments, total, page: Number(page), limit: Number(limit) })
}

export const getPayment = async (req, res) => {
  const payment = await Payment.findById(req.params.id)
  if (!payment) return res.status(404).json({ error: 'Payment not found' })
  res.json({ payment })
}
