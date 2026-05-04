import { auth } from '../config/firebase.js'
import { User } from '../models/User.js'

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const token = header.split(' ')[1]
    const decoded = await auth.verifyIdToken(token)

    // Find or create the user record (first-login auto-provision)
    let dbUser = await User.findOne({ uid: decoded.uid })
    if (!dbUser) {
      dbUser = await User.create({
        uid: decoded.uid,
        email: decoded.email,
        displayName: decoded.name || '',
        role: 'client',
      })
      console.log(`✓ New user provisioned: ${decoded.email}`)
    }

    req.user = {
      uid: dbUser.uid,
      email: dbUser.email,
      displayName: dbUser.displayName,
      role: dbUser.role,
    }

    next()
  } catch (err) {
    console.error('Token verification failed:', err.message)
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}
