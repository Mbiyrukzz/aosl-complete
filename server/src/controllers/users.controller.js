import admin from '../config/firebase.js'
import { User } from '../models/User.js'
import { Company } from '../models/Company.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// --------- Admin: create a new client ---------

export const createClient = async (req, res) => {
  try {
    const {
      email,
      name,
      phone,
      companyId,
      jobTitle,
      role = 'client',
    } = req.body

    if (!email?.trim() || !name?.trim()) {
      return res.status(400).json({ error: 'Email and name are required' })
    }

    if (!['client', 'staff', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' })
    }

    // Clients must belong to a company; staff/admin don't need one.
    if (role === 'client' && !companyId) {
      return res
        .status(400)
        .json({ error: 'Client users must be assigned to a company' })
    }

    // Verify the company exists if one was provided
    if (companyId) {
      const company = await Company.findById(companyId).lean()
      if (!company) {
        return res.status(404).json({ error: 'Company not found' })
      }
      if (company.status === 'archived') {
        return res
          .status(400)
          .json({ error: 'Cannot add users to an archived company' })
      }
    }

    const tempPassword = generateTempPassword()

    let firebaseUser
    try {
      firebaseUser = await admin.auth().createUser({
        email: email.trim(),
        password: tempPassword,
        displayName: name.trim(),
        emailVerified: false,
      })
    } catch (err) {
      if (err.code === 'auth/email-already-exists') {
        return res
          .status(409)
          .json({ error: 'An account with that email already exists.' })
      }
      throw err
    }

    let user
    try {
      user = await User.create({
        uid: firebaseUser.uid,
        email: email.trim(),
        displayName: name.trim(),
        phone: phone?.trim() || '',
        companyId: companyId || null,
        jobTitle: jobTitle?.trim() || '',
        role,
      })
    } catch (err) {
      // Mongo write failed — clean up the orphaned Firebase user so we don't
      // leave a half-registered account behind
      try {
        await admin.auth().deleteUser(firebaseUser.uid)
      } catch (cleanupErr) {
        console.error(
          'Failed to clean up Firebase user after Mongo error:',
          cleanupErr.message,
        )
      }
      throw err
    }

    const resetLink = await admin.auth().generatePasswordResetLink(email.trim())

    // Populate company on the way out so the frontend doesn't need a second round-trip
    const populated = await User.findById(user._id)
      .populate('companyId', 'name tier slug')
      .lean()

    res.status(201).json({
      user: populated,
      resetLink,
    })
  } catch (err) {
    console.error('createClient error:', err)
    res.status(500).json({ error: 'Failed to create client account' })
  }
}
const generateTempPassword = () => {
  const chars =
    'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%^&*'
  let out = ''
  for (let i = 0; i < 16; i++)
    out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

export const listAllUsers = async (req, res) => {
  try {
    const filter = {}
    if (req.query.companyId) filter.companyId = req.query.companyId

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .populate('companyId', 'name tier')
      .lean()
    res.json({ users })
  } catch (err) {
    console.error('listAllUsers error:', err)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
}

// --------- Admin: update role ---------
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body
    if (!['client', 'staff', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' })
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true },
    ).lean()

    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ user })
  } catch (err) {
    console.error('updateUserRole error:', err)
    res.status(500).json({ error: 'Failed to update role' })
  }
}

// --------- Staff: list staff & admins (for issue assignment) ---------
export const listStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: { $in: ['staff', 'admin'] } })
      .select('uid email displayName role avatarUrl')
      .sort({ email: 1 })
      .lean()
    res.json({ users: staff })
  } catch (err) {
    console.error('listStaff error:', err)
    res.status(500).json({ error: 'Failed to fetch staff list' })
  }
}

// --------- Auth'd: get my full profile ---------
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid })
      .populate('companyId', 'name tier')
      .lean()
    if (!user) return res.status(404).json({ error: 'Profile not found' })
    res.json({ user })
  } catch (err) {
    console.error('getMyProfile error:', err)
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
}

// --------- Auth'd: update my profile ---------
export const updateMyProfile = async (req, res) => {
  try {
    const allowed = [
      'displayName',
      'phone',
      'company',
      'bio',
      'notificationPrefs',
    ]
    const updates = {}
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key]
      }
    }

    // Sync displayName to Firebase Auth too so it shows in user.displayName everywhere
    if (updates.displayName) {
      try {
        await admin.auth().updateUser(req.user.uid, {
          displayName: updates.displayName.trim(),
        })
      } catch (e) {
        console.warn('Failed to sync displayName to Firebase:', e.message)
      }
    }

    const user = await User.findOneAndUpdate({ uid: req.user.uid }, updates, {
      new: true,
      runValidators: true,
    }).lean()

    if (!user) return res.status(404).json({ error: 'Profile not found' })
    res.json({ user })
  } catch (err) {
    console.error('updateMyProfile error:', err)
    res.status(500).json({ error: 'Failed to update profile' })
  }
}

// --------- Auth'd: upload avatar ---------
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' })
    }

    // Find current user to clean up old avatar
    const currentUser = await User.findOne({ uid: req.user.uid }).lean()

    const newAvatarUrl = `/uploads/avatars/${req.file.filename}`

    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      { avatarUrl: newAvatarUrl },
      { new: true },
    ).lean()

    if (!user) return res.status(404).json({ error: 'Profile not found' })

    // Sync photoURL to Firebase Auth
    const fullUrl = `${req.protocol}://${req.get('host')}${newAvatarUrl}`
    try {
      await admin.auth().updateUser(req.user.uid, { photoURL: fullUrl })
    } catch (e) {
      console.warn('Failed to sync avatar to Firebase:', e.message)
    }

    // Delete old avatar from disk (best effort)
    if (currentUser?.avatarUrl && currentUser.avatarUrl !== newAvatarUrl) {
      const oldFilename = currentUser.avatarUrl.split('/').pop()
      const oldPath = path.join(__dirname, '../../uploads/avatars', oldFilename)
      fs.unlink(oldPath, () => {}) // silent fail is fine
    }

    res.json({ user })
  } catch (err) {
    console.error('uploadAvatar error:', err)
    res.status(500).json({ error: 'Failed to upload avatar' })
  }
}

// --------- Auth'd: sync email change after Firebase update ---------
// Called after the client successfully updates their email via Firebase.
// We trust req.user.email (set by verifyFirebaseToken from the fresh token).
export const syncEmail = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      { email: req.user.email.toLowerCase() },
      { new: true },
    ).lean()

    if (!user) return res.status(404).json({ error: 'Profile not found' })
    res.json({ user })
  } catch (err) {
    console.error('syncEmail error:', err)
    res.status(500).json({ error: 'Failed to sync email' })
  }
}
