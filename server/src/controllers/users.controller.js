import admin from '../config/firebase.js'
import { User } from '../models/User.js'

// Admin-only — create a new client account
export const createClient = async (req, res) => {
  try {
    const { email, name, phone, company, role = 'client' } = req.body

    if (!email?.trim() || !name?.trim()) {
      return res.status(400).json({ error: 'Email and name are required' })
    }

    const validRoles = ['client', 'staff', 'admin']
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' })
    }

    // Generate a temporary password — user will reset it on first login
    const tempPassword = generateTempPassword()

    // Create the Firebase auth user
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

    // Create the matching Mongo user
    const user = await User.create({
      firebaseUid: firebaseUser.uid,
      email: email.trim(),
      name: name.trim(),
      phone: phone?.trim() || '',
      company: company?.trim() || '',
      role,
    })

    // Send password-reset email so the client sets their own password
    const resetLink = await admin.auth().generatePasswordResetLink(email.trim())

    res.status(201).json({
      user: user.toObject(),
      resetLink, // admin can share this manually if email fails
    })
  } catch (err) {
    console.error('createClient error:', err)
    res.status(500).json({ error: 'Failed to create client account' })
  }
}

const generateTempPassword = () => {
  // 16 chars, mixed — user will reset, so doesn't need to be memorable
  const chars =
    'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%^&*'
  let out = ''
  for (let i = 0; i < 16; i++) {
    out += chars[Math.floor(Math.random() * chars.length)]
  }
  return out
}

// Admin-only — list all users (for the admin clients page)
export const listAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).lean()
    res.json({ users })
  } catch (err) {
    console.error('listAllUsers error:', err)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
}

// Admin-only — update role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body
    const validRoles = ['client', 'staff', 'admin']
    if (!validRoles.includes(role)) {
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

export const listStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: { $in: ['staff', 'admin'] } })
      .select('uid email displayName role')
      .sort({ email: 1 })
      .lean()

    res.json({ users: staff })
  } catch (err) {
    console.error('listStaff error:', err)
    res.status(500).json({ error: 'Failed to fetch staff list' })
  }
}
