import { Issue } from '../models/Issue.js'

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

    // Build attachments from uploaded files
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
    const { assignedTo } = req.body // Firebase UID of staff member, or null to unassign

    const issue = await Issue.findByIdAndUpdate(
      id,
      { assignedTo },
      { new: true, runValidators: true },
    ).lean({ virtuals: true })

    if (!issue) return res.status(404).json({ error: 'Issue not found' })

    if (req.io) {
      req.io.to(`user:${issue.createdBy}`).emit('issue:updated', issue)
      req.io.to('staff').emit('issue:updated', issue)
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

    // Clients can only comment on their own issues
    if (!isStaffRole(req.user.role) && issue.createdBy !== req.user.uid) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    // Push the comment
    issue.comments.push({
      text: text.trim(),
      authorUid: req.user.uid,
      authorEmail: req.user.email,
    })

    // Auto-progress: when a staff member comments on an OPEN issue,
    // flip it to in_progress. Don't override resolved/closed/already-in-progress.
    let statusChanged = false
    if (isStaffRole(req.user.role) && issue.status === 'open') {
      issue.status = 'in_progress'
      statusChanged = true
    }

    await issue.save()
    const payload = issue.toJSON()

    if (req.io) {
      // Comment event always fires
      req.io.to(`user:${issue.createdBy}`).emit('issue:commented', payload)
      req.io.to('staff').emit('issue:commented', payload)

      // Status change event also fires if we auto-progressed
      if (statusChanged) {
        req.io.to(`user:${issue.createdBy}`).emit('issue:updated', payload)
        req.io.to('staff').emit('issue:updated', payload)
      }
    }

    res.json({ issue: payload })
  } catch (err) {
    console.error('addComment error:', err)
    res.status(500).json({ error: 'Failed to add comment' })
  }
}
