import { Company } from '../models/Company.js'
import { User } from '../models/User.js'
import { Package } from '../models/Package.js'
import { Issue } from '../models/Issue.js'

// Admin: create company
export const createCompany = async (req, res) => {
  try {
    const {
      name,
      tier = 'silver',
      primaryContactEmail,
      phone,
      website,
      address,
      accountManagerId,
      notes,
    } = req.body

    if (!name?.trim()) {
      return res.status(400).json({ error: 'Company name is required' })
    }
    if (!['silver', 'gold', 'platinum'].includes(tier)) {
      return res.status(400).json({ error: 'Invalid tier' })
    }

    const company = await Company.create({
      name: name.trim(),
      tier,
      primaryContactEmail: primaryContactEmail?.trim().toLowerCase() || '',
      phone: phone?.trim() || '',
      website: website?.trim() || '',
      address: address?.trim() || '',
      accountManagerId: accountManagerId || null,
      notes: notes?.trim() || '',
    })

    res.status(201).json({ company: company.toObject() })
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ error: 'A company with that name already exists' })
    }
    console.error('createCompany error:', err)
    res.status(500).json({ error: 'Failed to create company' })
  }
}

// Admin: list companies (with counts)
export const listCompanies = async (req, res) => {
  try {
    const filter = {}
    if (req.query.tier && req.query.tier !== 'all') filter.tier = req.query.tier
    if (req.query.status && req.query.status !== 'all')
      filter.status = req.query.status

    const companies = await Company.find(filter)
      .sort({ tier: 1, name: 1 }) // platinum, gold, silver alphabetically (relies on enum order: silver < gold... so reverse below)
      .populate('accountManagerId', 'displayName email')
      .lean()

    // Tier order weight (platinum first)
    const TIER_WEIGHT = { platinum: 0, gold: 1, silver: 2 }
    companies.sort((a, b) => {
      const tw = TIER_WEIGHT[a.tier] - TIER_WEIGHT[b.tier]
      if (tw !== 0) return tw
      return a.name.localeCompare(b.name)
    })

    // Decorate with counts in one pass
    const companyIds = companies.map((c) => c._id)
    const [userCounts, pkgCounts, issueCounts] = await Promise.all([
      User.aggregate([
        { $match: { companyId: { $in: companyIds } } },
        { $group: { _id: '$companyId', count: { $sum: 1 } } },
      ]),
      Package.aggregate([
        { $match: { companyId: { $in: companyIds } } },
        { $group: { _id: '$companyId', count: { $sum: 1 } } },
      ]),
      Issue.aggregate([
        {
          $match: {
            companyId: { $in: companyIds },
            status: { $in: ['open', 'in_progress'] },
          },
        },
        { $group: { _id: '$companyId', count: { $sum: 1 } } },
      ]),
    ])

    const userMap = Object.fromEntries(userCounts.map((c) => [c._id, c.count]))
    const pkgMap = Object.fromEntries(pkgCounts.map((c) => [c._id, c.count]))
    const issueMap = Object.fromEntries(
      issueCounts.map((c) => [c._id, c.count]),
    )

    const decorated = companies.map((c) => ({
      ...c,
      counts: {
        users: userMap[c._id] || 0,
        packages: pkgMap[c._id] || 0,
        openIssues: issueMap[c._id] || 0,
      },
    }))

    res.json({ companies: decorated })
  } catch (err) {
    console.error('listCompanies error:', err)
    res.status(500).json({ error: 'Failed to fetch companies' })
  }
}

// Admin: get one company with full detail
export const getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate('accountManagerId', 'displayName email')
      .lean()

    if (!company) {
      return res.status(404).json({ error: 'Company not found' })
    }

    const [users, packages, openIssues] = await Promise.all([
      User.find({ companyId: company._id })
        .select('uid displayName email role jobTitle phone avatarUrl')
        .sort({ displayName: 1 })
        .lean(),

      Package.find({ companyId: company._id }).sort({ expiryDate: 1 }).lean(),

      Issue.find({
        companyId: company._id,
        status: { $in: ['open', 'in_progress'] },
      })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean(),
    ])

    res.json({
      company: {
        ...company,
        users,
        packages,
        issues: openIssues,
        counts: {
          users: users.length,
          packages: packages.length,
          openIssues: openIssues.length,
        },
      },
    })
  } catch (err) {
    console.error('getCompany error:', err)
    res.status(500).json({ error: 'Failed to fetch company' })
  }
}

export const getMyCompany = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid }).lean()
    if (!user?.companyId) {
      return res
        .status(404)
        .json({ error: 'No company associated with your account' })
    }

    const company = await Company.findById(user.companyId)
      .populate('accountManagerId', 'displayName email avatarUrl')
      .lean()
    if (!company) return res.status(404).json({ error: 'Company not found' })

    const [users, packages] = await Promise.all([
      User.find({ companyId: company._id })
        .select('uid displayName email role jobTitle phone avatarUrl')
        .sort({ displayName: 1 })
        .lean(),
      Package.find({ companyId: company._id }).sort({ expiryDate: 1 }).lean(),
    ])

    res.json({ company, users, packages })
  } catch (err) {
    console.error('getMyCompany error:', err)
    res.status(500).json({ error: 'Failed to fetch company details' })
  }
}

// Admin: update company (changing tier cascades to open issues)
export const updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
    if (!company) return res.status(404).json({ error: 'Company not found' })

    const allowed = [
      'name',
      'tier',
      'primaryContactEmail',
      'phone',
      'website',
      'address',
      'status',
      'accountManagerId',
      'notes',
    ]
    const tierChanged =
      req.body.tier !== undefined && req.body.tier !== company.tier

    for (const k of allowed) {
      if (req.body[k] !== undefined) company[k] = req.body[k]
    }

    await company.save()

    // If tier changed, propagate to open issues so queue sorting reflects it
    if (tierChanged) {
      await Issue.updateMany(
        {
          companyId: company._id,
          status: { $in: ['open', 'in_progress'] },
        },
        { companyTier: company.tier },
      )
    }

    res.json({ company: company.toObject() })
  } catch (err) {
    console.error('updateCompany error:', err)
    res.status(500).json({ error: 'Failed to update company' })
  }
}

// Admin: delete company (only if no users/packages/issues attached)
export const deleteCompany = async (req, res) => {
  try {
    const id = req.params.id
    const [userCount, pkgCount] = await Promise.all([
      User.countDocuments({ companyId: id }),
      Package.countDocuments({ companyId: id }),
    ])

    if (userCount > 0 || pkgCount > 0) {
      return res.status(400).json({
        error: `Cannot delete: company has ${userCount} user(s) and ${pkgCount} package(s). Reassign or delete those first, or archive the company instead.`,
      })
    }

    await Company.findByIdAndDelete(id)
    res.json({ success: true })
  } catch (err) {
    console.error('deleteCompany error:', err)
    res.status(500).json({ error: 'Failed to delete company' })
  }
}
