import { Issue } from '../models/Issue.js'
import { User } from '../models/User.js'
import {
  createNotification,
  createNotificationsBulk,
} from '../services/notifications.service.js'

const isStaffRole = (role) => role === 'staff' || role === 'admin'

export const listIssues = async (req, res) => {
  try {
    const { role, uid } = req.user

    // Clients see only their own; staff/admin see everything
    const filter = isStaffRole(role) ? {} : { createdBy: uid }

    const issues = await Issue.find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean({ virtuals: true })

    res.json({ issues })
  } catch (err) {
    console.error('listIssues error:', err)
    res.status(500).json({ error: 'Failed to fetch issues' })
  }
}

export const getIssue = async (req, res) => {
  try {
    const { id } = req.params
    const { role, uid } = req.user

    const issue = await Issue.findById(id).lean({ virtuals: true })
    if (!issue) return res.status(404).json({ error: 'Issue not found' })

    // Clients can only read their own
    if (!isStaffRole(role) && issue.createdBy !== uid) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    res.json({ issue })
  } catch (err) {
    console.error('getIssue error:', err)
    res.status(500).json({ error: 'Failed to fetch issue' })
  }
}

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

    const issue = await Issue.create({
      title,
      description,
      priority,
      createdBy: req.user.uid,
      createdByEmail: req.user.email,
      attachments,
    })

    const payload = issue.toJSON()

    if (req.io) {
      req.io.to(`user:${req.user.uid}`).emit('issue:created', payload)
      req.io.to('staff').emit('issue:created', payload)

      // Notify all staff/admin of new issues
      const staffUsers = await User.find({
        role: { $in: ['staff', 'admin'] },
      })
        .select('uid')
        .lean()

      const notifPayloads = staffUsers.map((s) => ({
        recipient: s.uid,
        type: 'issue_assigned', // reuse this type, or add 'issue_created'
        issueId: issue._id,
        issueTitle: issue.title,
        actorUid: req.user.uid,
        actorEmail: req.user.email,
        message: `New ${priority} priority issue from ${req.user.email}`,
      }))

      await createNotificationsBulk(req.io, notifPayloads)
    }

    res.status(201).json({ issue: payload })
  } catch (err) {
    console.error('createIssue error:', err)
    res.status(500).json({ error: 'Failed to create issue' })
  }
}

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

      // Notify the creator
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

      // Notify the new assignee
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

export const addComment = async (req, res) => {
  try {
    const { id } = req.params
    const { text } = req.body

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Comment text required' })
    }

    const issue = await Issue.findById(id)
    if (!issue) return res.status(404).json({ error: 'Issue not found' })

    if (!isStaffRole(req.user.role) && issue.createdBy !== req.user.uid) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    issue.comments.push({
      text: text.trim(),
      authorUid: req.user.uid,
      authorEmail: req.user.email,
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

      // Notify creator + assignee (if any) of the new comment
      const recipients = new Set()
      if (issue.createdBy !== req.user.uid) recipients.add(issue.createdBy)
      if (issue.assignedTo && issue.assignedTo !== req.user.uid) {
        recipients.add(issue.assignedTo)
      }

      const notifPayloads = [...recipients].map((recipient) => ({
        recipient,
        type: 'issue_commented',
        issueId: issue._id,
        issueTitle: issue.title,
        actorUid: req.user.uid,
        actorEmail: req.user.email,
        message: `${req.user.email} commented on the issue`,
      }))

      await createNotificationsBulk(req.io, notifPayloads)
    }

    res.json({ issue: payload })
  } catch (err) {
    console.error('addComment error:', err)
    res.status(500).json({ error: 'Failed to add comment' })
  }
}

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

    // Resolve recipient
    let recipient
    if (recipientUid) {
      recipient = await User.findOne({ uid: recipientUid }).lean()
    } else {
      recipient = await User.findOne({
        email: recipientEmail.toLowerCase(),
      }).lean()
    }

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' })
    }

    // Permission: only the creator or staff can share an issue
    if (!isStaffRole(req.user.role) && issue.createdBy !== req.user.uid) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    // Recipient must be staff to view (since regular clients can only see their own)
    // OR the creator (already has access)
    const recipientIsStaff =
      recipient.role === 'staff' || recipient.role === 'admin'
    const recipientIsCreator = recipient.uid === issue.createdBy

    if (!recipientIsStaff && !recipientIsCreator) {
      return res.status(400).json({
        error: 'Can only share with staff or the issue owner',
      })
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
