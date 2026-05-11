import { Issue } from '../models/Issue.js'
import { User } from '../models/User.js'
import {
  createNotification,
  createNotificationsBulk,
} from '../services/notifications.service.js'

const isStaffRole = (role) => role === 'staff' || role === 'admin'

/* ─── helpers ─────────────────────────────────────────────── */

const populateCompany = (query) => query.populate('companyId', 'name tier')

/* ─── list (client) ───────────────────────────────────────── */

export const listIssues = async (req, res) => {
  try {
    const { role, uid } = req.user
    const filter = isStaffRole(role) ? {} : { createdBy: uid }

    const issues = await populateCompany(
      Issue.find(filter).sort({ createdAt: -1 }).limit(100),
    ).lean({ virtuals: true })

    res.json({ issues })
  } catch (err) {
    console.error('listIssues error:', err)
    res.status(500).json({ error: 'Failed to fetch issues' })
  }
}

/* ─── list (admin — tier-sorted aggregation) ──────────────── */

export const listAllIssues = async (req, res) => {
  try {
    const filter = {}
    if (req.query.status && req.query.status !== 'all')
      filter.status = req.query.status
    if (req.query.priority && req.query.priority !== 'all')
      filter.priority = req.query.priority
    if (req.query.companyId) filter.companyId = req.query.companyId
    if (req.query.companyTier && req.query.companyTier !== 'all')
      filter.companyTier = req.query.companyTier
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo

    const issues = await Issue.aggregate([
      { $match: filter },
      {
        $addFields: {
          tierWeight: {
            $switch: {
              branches: [
                { case: { $eq: ['$companyTier', 'platinum'] }, then: 0 },
                { case: { $eq: ['$companyTier', 'gold'] }, then: 1 },
                { case: { $eq: ['$companyTier', 'silver'] }, then: 2 },
              ],
              default: 3,
            },
          },
          statusWeight: {
            $switch: {
              branches: [
                { case: { $eq: ['$status', 'open'] }, then: 0 },
                { case: { $eq: ['$status', 'in_progress'] }, then: 1 },
                { case: { $eq: ['$status', 'resolved'] }, then: 2 },
                { case: { $eq: ['$status', 'closed'] }, then: 3 },
              ],
              default: 4,
            },
          },
        },
      },
      { $sort: { tierWeight: 1, statusWeight: 1, createdAt: 1 } },
      { $limit: 500 },
      {
        $lookup: {
          from: 'companies',
          localField: 'companyId',
          foreignField: '_id',
          as: 'company',
        },
      },
      { $addFields: { companyId: { $arrayElemAt: ['$company', 0] } } },
      { $project: { company: 0, tierWeight: 0, statusWeight: 0 } },
    ])

    res.json({ issues })
  } catch (err) {
    console.error('listAllIssues error:', err)
    res.status(500).json({ error: 'Failed to fetch issues' })
  }
}

/* ─── get single (now populates company) ─────────────────── */

export const getIssue = async (req, res) => {
  try {
    const { id } = req.params
    const { role, uid } = req.user

    const issue = await populateCompany(Issue.findById(id)).lean({
      virtuals: true,
    })

    if (!issue) return res.status(404).json({ error: 'Issue not found' })

    if (!isStaffRole(role) && issue.createdBy !== uid) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    res.json({ issue })
  } catch (err) {
    console.error('getIssue error:', err)
    res.status(500).json({ error: 'Failed to fetch issue' })
  }
}

/* ─── create ──────────────────────────────────────────────── */

const SLA_HOURS_BY_TIER = { platinum: 2, gold: 8, silver: 24 }

export const createIssue = async (req, res) => {
  try {
    const { title, description, priority = 'normal' } = req.body

    if (!title || !description) {
      return res
        .status(400)
        .json({ error: 'Title and description are required' })
    }

    const attachments = (req.files || []).map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`,
    }))

    const reporter = await User.findOne({ uid: req.user.uid })
      .populate('companyId', 'tier name')
      .lean()

    const company = reporter?.companyId
    const companyId = company?._id || null
    const companyTier = company?.tier || null

    const slaHours = SLA_HOURS_BY_TIER[companyTier]
    const slaDeadline = slaHours
      ? new Date(Date.now() + slaHours * 60 * 60 * 1000)
      : null

    const issue = await Issue.create({
      title,
      description,
      priority,
      createdBy: req.user.uid,
      createdByEmail: req.user.email,
      attachments,
      companyId,
      companyTier,
      slaDeadline,
      escalated: false,
    })

    const payload = issue.toJSON()

    if (req.io) {
      req.io.to(`user:${req.user.uid}`).emit('issue:created', payload)
      req.io.to('staff').emit('issue:created', payload)

      const staffUsers = await User.find({ role: { $in: ['staff', 'admin'] } })
        .select('uid')
        .lean()

      const tierTag = companyTier ? ` [${companyTier.toUpperCase()}]` : ''
      const companyName = company?.name ? ` from ${company.name}` : ''

      await createNotificationsBulk(
        req.io,
        staffUsers.map((s) => ({
          recipient: s.uid,
          type: 'issue_assigned',
          issueId: issue._id,
          issueTitle: issue.title,
          actorUid: req.user.uid,
          actorEmail: req.user.email,
          message: `New ${priority} issue${tierTag}${companyName} from ${req.user.email}`,
        })),
      )
    }

    res.status(201).json({ issue: payload })
  } catch (err) {
    console.error('createIssue error:', err)
    res.status(500).json({ error: 'Failed to create issue' })
  }
}

/* ─── update status ───────────────────────────────────────── */

export const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const valid = ['open', 'in_progress', 'resolved', 'closed']
    if (!valid.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const issue = await Issue.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    ).lean({ virtuals: true })

    if (!issue) return res.status(404).json({ error: 'Issue not found' })

    if (req.io) {
      req.io.to(`user:${issue.createdBy}`).emit('issue:updated', issue)
      req.io.to('staff').emit('issue:updated', issue)

      await createNotification(req.io, {
        recipient: issue.createdBy,
        type: 'issue_status_changed',
        issueId: issue._id,
        issueTitle: issue.title,
        actorUid: req.user.uid,
        actorEmail: req.user.email,
        message: `${req.user.email} changed status to "${status.replace('_', ' ')}"`,
      })
    }

    res.json({ issue })
  } catch (err) {
    console.error('updateIssueStatus error:', err)
    res.status(500).json({ error: 'Failed to update issue' })
  }
}

/* ─── delete issue ────────────────────────────────────────── */

export const deleteIssue = async (req, res) => {
  try {
    const { id } = req.params
    const { role, uid } = req.user

    const issue = await Issue.findById(id).lean()
    if (!issue) return res.status(404).json({ error: 'Issue not found' })

    // Only the creator or staff/admin may delete
    if (!isStaffRole(role) && issue.createdBy !== uid) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    await Issue.findByIdAndDelete(id)

    if (req.io) {
      // Notify everyone watching this issue that it's gone
      req.io.to(`user:${issue.createdBy}`).emit('issue:deleted', { _id: id })
      req.io.to('staff').emit('issue:deleted', { _id: id })
    }

    res.json({ success: true, deletedId: id })
  } catch (err) {
    console.error('deleteIssue error:', err)
    res.status(500).json({ error: 'Failed to delete issue' })
  }
}

/* ─── assign ──────────────────────────────────────────────── */

export const assignIssue = async (req, res) => {
  try {
    const { id } = req.params
    const { assignedTo } = req.body

    const issue = await Issue.findByIdAndUpdate(
      id,
      { assignedTo },
      { new: true, runValidators: true },
    ).lean({ virtuals: true })

    if (!issue) return res.status(404).json({ error: 'Issue not found' })

    if (req.io) {
      req.io.to(`user:${issue.createdBy}`).emit('issue:updated', issue)
      req.io.to('staff').emit('issue:updated', issue)

      if (assignedTo) {
        await createNotification(req.io, {
          recipient: assignedTo,
          type: 'issue_assigned',
          issueId: issue._id,
          issueTitle: issue.title,
          actorUid: req.user.uid,
          actorEmail: req.user.email,
          message: `${req.user.email} assigned an issue to you`,
        })
      }
    }

    res.json({ issue })
  } catch (err) {
    console.error('assignIssue error:', err)
    res.status(500).json({ error: 'Failed to assign issue' })
  }
}

/* ─── add comment (with optional attachments) ─────────────── */

export const addComment = async (req, res) => {
  try {
    const { id } = req.params
    const { text } = req.body

    if (!text?.trim() && !req.files?.length) {
      return res
        .status(400)
        .json({ error: 'Comment text or attachment required' })
    }

    const issue = await Issue.findById(id)
    if (!issue) return res.status(404).json({ error: 'Issue not found' })

    if (!isStaffRole(req.user.role) && issue.createdBy !== req.user.uid) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const attachments = (req.files || []).map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`,
    }))

    issue.comments.push({
      text: text?.trim() || '',
      authorUid: req.user.uid,
      authorEmail: req.user.email,
      attachments,
    })

    let statusChanged = false
    if (isStaffRole(req.user.role) && issue.status === 'open') {
      issue.status = 'in_progress'
      statusChanged = true
    }

    await issue.save()
    const payload = issue.toJSON()

    if (req.io) {
      req.io.to(`user:${issue.createdBy}`).emit('issue:commented', payload)
      req.io.to('staff').emit('issue:commented', payload)

      if (statusChanged) {
        req.io.to(`user:${issue.createdBy}`).emit('issue:updated', payload)
        req.io.to('staff').emit('issue:updated', payload)
      }

      const recipients = new Set()
      if (issue.createdBy !== req.user.uid) recipients.add(issue.createdBy)
      if (issue.assignedTo && issue.assignedTo !== req.user.uid)
        recipients.add(issue.assignedTo)

      await createNotificationsBulk(
        req.io,
        [...recipients].map((r) => ({
          recipient: r,
          type: 'issue_commented',
          issueId: issue._id,
          issueTitle: issue.title,
          actorUid: req.user.uid,
          actorEmail: req.user.email,
          message: `${req.user.email} commented on the issue`,
        })),
      )
    }

    res.json({ issue: payload })
  } catch (err) {
    console.error('addComment error:', err)
    res.status(500).json({ error: 'Failed to add comment' })
  }
}

/* ─── edit comment ────────────────────────────────────────── */

export const editComment = async (req, res) => {
  try {
    const { id, commentId } = req.params
    const { text } = req.body

    if (!text?.trim()) {
      return res.status(400).json({ error: 'Text required' })
    }

    const issue = await Issue.findById(id)
    if (!issue) return res.status(404).json({ error: 'Issue not found' })

    const comment = issue.comments.id(commentId)
    if (!comment) return res.status(404).json({ error: 'Comment not found' })

    // Only the author or staff/admin can edit
    const isOwner = comment.authorUid === req.user.uid
    if (!isOwner && !isStaffRole(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    comment.text = text.trim()
    comment.edited = true
    comment.editedAt = new Date()

    await issue.save()
    res.json({ issue: issue.toJSON() })
  } catch (err) {
    console.error('editComment error:', err)
    res.status(500).json({ error: 'Failed to edit comment' })
  }
}

/* ─── delete comment (soft) ───────────────────────────────── */

export const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params

    const issue = await Issue.findById(id)
    if (!issue) return res.status(404).json({ error: 'Issue not found' })

    const comment = issue.comments.id(commentId)
    if (!comment) return res.status(404).json({ error: 'Comment not found' })

    const isOwner = comment.authorUid === req.user.uid
    if (!isOwner && !isStaffRole(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    // Soft delete — keeps the thread intact visually (shows "deleted" placeholder)
    comment.deleted = true
    comment.text = ''

    await issue.save()

    const payload = issue.toJSON()
    if (req.io) {
      req.io.to(`user:${issue.createdBy}`).emit('issue:commented', payload)
      req.io.to('staff').emit('issue:commented', payload)
    }

    res.json({ issue: payload })
  } catch (err) {
    console.error('deleteComment error:', err)
    res.status(500).json({ error: 'Failed to delete comment' })
  }
}

/* ─── share ───────────────────────────────────────────────── */

export const shareIssue = async (req, res) => {
  try {
    const { id } = req.params
    const { recipientUid, recipientEmail } = req.body

    if (!recipientUid && !recipientEmail) {
      return res
        .status(400)
        .json({ error: 'recipientUid or recipientEmail required' })
    }

    const issue = await Issue.findById(id).lean()
    if (!issue) return res.status(404).json({ error: 'Issue not found' })

    const recipient = recipientUid
      ? await User.findOne({ uid: recipientUid }).lean()
      : await User.findOne({ email: recipientEmail.toLowerCase() }).lean()

    if (!recipient)
      return res.status(404).json({ error: 'Recipient not found' })

    if (!isStaffRole(req.user.role) && issue.createdBy !== req.user.uid) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const recipientIsStaff = isStaffRole(recipient.role)
    const recipientIsCreator = recipient.uid === issue.createdBy

    if (!recipientIsStaff && !recipientIsCreator) {
      return res
        .status(400)
        .json({ error: 'Can only share with staff or the issue owner' })
    }

    const notification = await createNotification(req.io, {
      recipient: recipient.uid,
      type: 'issue_shared',
      issueId: issue._id,
      issueTitle: issue.title,
      actorUid: req.user.uid,
      actorEmail: req.user.email,
      message: `${req.user.email} shared an issue with you`,
    })

    res.json({
      success: true,
      notification: notification?.toObject() || null,
      recipient: { uid: recipient.uid, email: recipient.email },
    })
  } catch (err) {
    console.error('shareIssue error:', err)
    res.status(500).json({ error: 'Failed to share issue' })
  }
}
