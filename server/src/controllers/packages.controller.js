import { Package } from '../models/Package.js'
import { Reminder } from '../models/Reminder.js'
import { User } from '../models/User.js'

const REMINDER_TEMPLATES = {
  hosting: {
    title: (pkg, days) =>
      `Your hosting (${pkg.name}) expires in ${days} day${days === 1 ? '' : 's'}`,
    message: (pkg, days, expiry) =>
      `Heads up — your hosting package "${pkg.name}" expires on ${expiry}. ` +
      `Renewing on time keeps your sites and services running without interruption.`,
  },
  domain: {
    title: (pkg, days) =>
      `Domain renewal due in ${days} day${days === 1 ? '' : 's'}: ${pkg.name}`,
    message: (pkg, days, expiry) =>
      `Your domain "${pkg.name}" expires on ${expiry}. ` +
      `Domain expirations can lead to downtime and loss of brand control. ` +
      `Renew before the deadline to keep things running smoothly.`,
  },
  maintenance: {
    title: (pkg, days) =>
      `Maintenance plan ending in ${days} day${days === 1 ? '' : 's'}`,
    message: (pkg, days, expiry) =>
      `Your maintenance plan "${pkg.name}" ends on ${expiry}. ` +
      `Renew to keep receiving regular updates, monitoring, and priority support.`,
  },
  subscription: {
    title: (pkg, days) =>
      `${pkg.name} renewal in ${days} day${days === 1 ? '' : 's'}`,
    message: (pkg, days, expiry) =>
      `Your subscription "${pkg.name}" renews on ${expiry}. ` +
      `Reach out if you'd like to upgrade, downgrade, or make changes.`,
  },
  license: {
    title: (pkg, days) =>
      `License expiry: ${pkg.name} (${days} day${days === 1 ? '' : 's'})`,
    message: (pkg, days, expiry) =>
      `Your license for "${pkg.name}" expires on ${expiry}. Renew to maintain access and updates.`,
  },
  support_plan: {
    title: (pkg, days) =>
      `Support plan renewal in ${days} day${days === 1 ? '' : 's'}`,
    message: (pkg, days, expiry) =>
      `Your support plan "${pkg.name}" renews on ${expiry}. Renewal keeps priority support and SLA in place.`,
  },
  other: {
    title: (pkg, days) =>
      `${pkg.name} expires in ${days} day${days === 1 ? '' : 's'}`,
    message: (pkg, days, expiry) =>
      `Your package "${pkg.name}" expires on ${expiry}. Get in touch to renew or discuss next steps.`,
  },
}

const CATEGORY_BY_TYPE = {
  hosting: 'package_expiry',
  domain: 'domain_renewal',
  maintenance: 'package_expiry',
  subscription: 'package_expiry',
  license: 'package_expiry',
  support_plan: 'package_expiry',
  other: 'package_expiry',
}

const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

const generateRemindersForPackage = async (pkg, createdBy = 'system') => {
  const template = REMINDER_TEMPLATES[pkg.type] || REMINDER_TEMPLATES.other
  const category = CATEGORY_BY_TYPE[pkg.type] || 'package_expiry'
  const reminderIds = []

  for (const daysBefore of pkg.reminderDaysBefore) {
    const scheduledFor = new Date(pkg.expiryDate)
    scheduledFor.setDate(scheduledFor.getDate() - daysBefore)

    // Skip reminders in the past (e.g., 30 days before for a package expiring tomorrow)
    if (scheduledFor < new Date()) continue

    const reminder = await Reminder.create({
      userId: pkg.userId,
      title: template.title(pkg, daysBefore),
      message: template.message(pkg, daysBefore, formatDate(pkg.expiryDate)),
      category,
      relatedType: 'Package',
      relatedId: pkg._id,
      scheduledFor,
      recurrence: 'none',
      channels: pkg.reminderChannels,
      status: 'scheduled',
      createdBy,
    })
    reminderIds.push(reminder._id)
  }

  return reminderIds
}

// ----- Admin: create a package -----
export const createPackage = async (req, res) => {
  try {
    const {
      userId,
      name,
      description,
      type,
      price,
      startDate,
      expiryDate,
      autoRenew,
      reminderDaysBefore,
      reminderChannels,
      notes,
    } = req.body

    if (!userId || !name?.trim() || !expiryDate) {
      return res
        .status(400)
        .json({ error: 'userId, name, and expiryDate are required' })
    }

    const owner = await User.findById(userId).lean()
    if (!owner) return res.status(404).json({ error: 'User not found' })

    const pkg = await Package.create({
      userId,
      name: name.trim(),
      description: description?.trim() || '',
      type: type || 'subscription',
      price: price || { amount: 0, currency: 'KES', billingCycle: 'yearly' },
      startDate: startDate ? new Date(startDate) : new Date(),
      expiryDate: new Date(expiryDate),
      autoRenew: !!autoRenew,
      reminderDaysBefore: reminderDaysBefore || [30, 14, 7, 1],
      reminderChannels: reminderChannels || {
        email: true,
        whatsapp: false,
        inApp: true,
      },
      notes: notes?.trim() || '',
    })

    // Auto-generate reminders
    const reminderIds = await generateRemindersForPackage(pkg, req.user.uid)
    pkg.reminderIds = reminderIds
    await pkg.save()

    const populated = await Package.findById(pkg._id)
      .populate('userId', 'displayName email')
      .lean()

    res.status(201).json({ package: populated })
  } catch (err) {
    console.error('createPackage error:', err)
    res.status(500).json({ error: 'Failed to create package' })
  }
}

// ----- Admin: list packages -----
export const listPackages = async (req, res) => {
  try {
    const filter = {}
    if (req.query.userId) filter.userId = req.query.userId
    if (req.query.status && req.query.status !== 'all')
      filter.status = req.query.status
    if (req.query.type && req.query.type !== 'all') filter.type = req.query.type

    const packages = await Package.find(filter)
      .sort({ expiryDate: 1 })
      .limit(500)
      .populate('userId', 'displayName email')
      .lean()

    res.json({ packages })
  } catch (err) {
    console.error('listPackages error:', err)
    res.status(500).json({ error: 'Failed to fetch packages' })
  }
}

// ----- Admin: update package (regenerates reminders if expiry changes) -----
export const updatePackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id)
    if (!pkg) return res.status(404).json({ error: 'Package not found' })

    const allowed = [
      'name',
      'description',
      'type',
      'price',
      'startDate',
      'expiryDate',
      'autoRenew',
      'status',
      'reminderDaysBefore',
      'reminderChannels',
      'notes',
    ]
    const expiryChanged =
      req.body.expiryDate &&
      new Date(req.body.expiryDate).getTime() !== pkg.expiryDate.getTime()
    const reminderConfigChanged =
      req.body.reminderDaysBefore !== undefined ||
      req.body.reminderChannels !== undefined

    for (const k of allowed) {
      if (req.body[k] !== undefined) pkg[k] = req.body[k]
    }

    // If expiry or reminder config changed, regenerate
    if (expiryChanged || reminderConfigChanged) {
      // Cancel old scheduled reminders
      await Reminder.updateMany(
        { _id: { $in: pkg.reminderIds }, status: 'scheduled' },
        { status: 'cancelled' },
      )

      // Create new ones
      const newIds = await generateRemindersForPackage(pkg, req.user.uid)
      pkg.reminderIds = newIds
    }

    await pkg.save()

    const populated = await Package.findById(pkg._id)
      .populate('userId', 'displayName email')
      .lean()

    res.json({ package: populated })
  } catch (err) {
    console.error('updatePackage error:', err)
    res.status(500).json({ error: 'Failed to update package' })
  }
}

// ----- Admin: delete package + cancel its reminders -----
export const deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id)
    if (!pkg) return res.status(404).json({ error: 'Package not found' })

    // Cancel any scheduled reminders linked to this package
    await Reminder.updateMany(
      { _id: { $in: pkg.reminderIds }, status: 'scheduled' },
      { status: 'cancelled' },
    )

    await pkg.deleteOne()

    res.json({ success: true })
  } catch (err) {
    console.error('deletePackage error:', err)
    res.status(500).json({ error: 'Failed to delete package' })
  }
}

// ----- Client: list my packages -----
export const listMyPackages = async (req, res) => {
  try {
    const me = await User.findOne({ uid: req.user.uid }).lean()
    if (!me) return res.status(404).json({ error: 'Profile not found' })

    const packages = await Package.find({ userId: me._id })
      .sort({ expiryDate: 1 })
      .lean()

    res.json({ packages })
  } catch (err) {
    console.error('listMyPackages error:', err)
    res.status(500).json({ error: 'Failed to fetch packages' })
  }
}
