import { Project } from '../models/Project.js'
import { Company } from '../models/Company.js'
import { User } from '../models/User.js'
import { dispatch } from '../services/notifications.service.js'

/*
 * NOTE ON SOCKET ACCESS:
 * This assumes `io` is attached to the express app via `app.set('io', io)`
 * wherever you create your http server + socket.io instance (mirrors the
 * `user:<uid>` room convention already used in your notification helper).
 * If your project exposes the io instance a different way (e.g. a
 * `getIO()` singleton), just swap out `getIO(req)` below.
 */
const getIO = (req) => {
  try {
    return req.app.get('io') || null
  } catch {
    return null
  }
}

const emitToUsers = (io, uids = [], event, payload) => {
  if (!io) return
  uids.forEach((uid) => io.to(`user:${uid}`).emit(event, payload))
}

// Notify every client user in a company via email + in-app notification,
// and return their uids so the caller can also emit a realtime socket event.
const notifyClients = async (
  company,
  project,
  category,
  message,
  actionLabel = 'View project',
) => {
  const clients = await User.find({
    companyId: company._id,
    role: 'client',
  }).lean()

  const actionUrl = `/my-projects/${project._id}`

  await Promise.allSettled(
    clients.map((u) =>
      dispatch({
        userId: u._id,
        title: `Project: ${project.title}`,
        message,
        category,
        actionUrl,
        actionLabel,
        extraVars: {
          projectTitle: project.title,
          companyName: company.name,
        },
      }),
    ),
  )

  return clients.map((u) => u.uid)
}

/* ── Staff/Admin ───────────────────────────────────────────── */

export const createProject = async (req, res) => {
  try {
    const {
      companyId,
      title,
      description = '',
      priority = 'normal',
      dueDate = null,
      assignedStaff = [],
      notes = '',
    } = req.body

    if (!companyId) {
      return res.status(400).json({ error: 'companyId is required' })
    }
    if (!title?.trim()) {
      return res.status(400).json({ error: 'Project title is required' })
    }

    const company = await Company.findById(companyId).lean()
    if (!company) return res.status(404).json({ error: 'Company not found' })

    const project = await Project.create({
      title: title.trim(),
      description: description?.trim() || '',
      companyId,
      companyTier: company.tier,
      priority,
      dueDate: dueDate || null,
      assignedStaff,
      notes: notes?.trim() || '',
      createdBy: req.user.uid,
    })

    const clientUids = await notifyClients(
      company,
      project,
      'project_created',
      `Your project "${project.title}" has been started. Log in to your client portal to follow its progress.`,
      'View project',
    )

    emitToUsers(getIO(req), clientUids, 'project:created', project.toObject())

    res.status(201).json({ project: project.toObject() })
  } catch (err) {
    console.error('createProject error:', err)
    res.status(500).json({ error: 'Failed to create project' })
  }
}

export const listProjects = async (req, res) => {
  try {
    const filter = {}
    if (req.query.companyId) filter.companyId = req.query.companyId
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status
    }

    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .populate('companyId', 'name tier')
      .populate('assignedStaff', 'displayName email')
      .lean()

    res.json({ projects })
  } catch (err) {
    console.error('listProjects error:', err)
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
}

export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('companyId', 'name tier primaryContactEmail')
      .populate('assignedStaff', 'displayName email')
      .lean()

    if (!project) return res.status(404).json({ error: 'Project not found' })
    res.json({ project })
  } catch (err) {
    console.error('getProject error:', err)
    res.status(500).json({ error: 'Failed to fetch project' })
  }
}

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ error: 'Project not found' })

    const allowed = [
      'title',
      'description',
      'priority',
      'status',
      'dueDate',
      'progress',
      'assignedStaff',
      'notes',
    ]
    const statusChanged =
      req.body.status !== undefined && req.body.status !== project.status

    for (const k of allowed) {
      if (req.body[k] !== undefined) project[k] = req.body[k]
    }

    if (statusChanged && project.status === 'completed') {
      project.completedAt = new Date()
      project.progress = 100
    }

    await project.save()

    if (statusChanged) {
      const company = await Company.findById(project.companyId).lean()
      if (company) {
        const clientUids = await notifyClients(
          company,
          project,
          'project_status_changed',
          `Your project "${project.title}" is now ${project.status.replace('_', ' ')}.`,
          'View project',
        )
        emitToUsers(
          getIO(req),
          clientUids,
          'project:updated',
          project.toObject(),
        )
      }
    }

    res.json({ project: project.toObject() })
  } catch (err) {
    console.error('updateProject error:', err)
    res.status(500).json({ error: 'Failed to update project' })
  }
}

// Post a progress update — visible to the client, optionally bumps status/progress
export const addProjectUpdate = async (req, res) => {
  try {
    const { text, progress, status } = req.body
    if (!text?.trim()) {
      return res.status(400).json({ error: 'Update text is required' })
    }

    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ error: 'Project not found' })

    const author = await User.findOne({ uid: req.user.uid }).lean()

    project.updates.push({
      text: text.trim(),
      progress: progress !== undefined ? progress : undefined,
      status: status || undefined,
      authorUid: req.user.uid,
      authorName: author?.displayName || 'Staff',
    })

    if (progress !== undefined) project.progress = progress
    if (status) {
      project.status = status
      if (status === 'completed') {
        project.completedAt = new Date()
        project.progress = 100
      }
    }

    await project.save()

    const company = await Company.findById(project.companyId).lean()
    if (company) {
      const clientUids = await notifyClients(
        company,
        project,
        'project_commented',
        `New update on "${project.title}": ${text.trim()}`,
        'View update',
      )
      emitToUsers(
        getIO(req),
        clientUids,
        'project:commented',
        project.toObject(),
      )
    }

    res.json({ project: project.toObject() })
  } catch (err) {
    console.error('addProjectUpdate error:', err)
    res.status(500).json({ error: 'Failed to add project update' })
  }
}

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) return res.status(404).json({ error: 'Project not found' })
    res.json({ success: true })
  } catch (err) {
    console.error('deleteProject error:', err)
    res.status(500).json({ error: 'Failed to delete project' })
  }
}

/* ── Client-facing ─────────────────────────────────────────── */

export const listMyProjects = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid }).lean()
    if (!user?.companyId) return res.json({ projects: [] })

    const projects = await Project.find({ companyId: user.companyId })
      .sort({ createdAt: -1 })
      .select('-notes -updates.authorUid')
      .lean()

    res.json({ projects })
  } catch (err) {
    console.error('listMyProjects error:', err)
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
}

export const getMyProjectDetail = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid }).lean()
    if (!user?.companyId) {
      return res.status(404).json({ error: 'Project not found' })
    }

    const project = await Project.findOne({
      _id: req.params.id,
      companyId: user.companyId,
    })
      .select('-notes -updates.authorUid')
      .lean()

    if (!project) return res.status(404).json({ error: 'Project not found' })

    res.json({ project })
  } catch (err) {
    console.error('getMyProjectDetail error:', err)
    res.status(500).json({ error: 'Failed to fetch project' })
  }
}