import { User } from '../models/User.js'

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
