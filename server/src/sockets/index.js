import { auth } from '../config/firebase.js'
import { User } from '../models/User.js'

export const initializeSockets = (io) => {
  // Auth on connect — same Firebase token as HTTP
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token
      if (!token) return next(new Error('No token provided'))

      const decoded = await auth.verifyIdToken(token)

      // Look up role just like HTTP does
      const dbUser = await User.findOne({ uid: decoded.uid })
      if (!dbUser) return next(new Error('User not found'))

      socket.user = {
        uid: dbUser.uid,
        email: dbUser.email,
        role: dbUser.role,
      }

      next()
    } catch (err) {
      console.error('Socket auth failed:', err.message)
      next(new Error('Authentication failed'))
    }
  })

  io.on('connection', (socket) => {
    const { uid, email, role } = socket.user
    console.log(`✓ Socket connected: ${email} (${role})`)

    // Every user joins their personal room
    socket.join(`user:${uid}`)

    // Staff/admin also join the staff firehose
    if (role === 'staff' || role === 'admin') {
      socket.join('staff')
    }

    socket.on('disconnect', () => {
      console.log(`✗ Socket disconnected: ${email}`)
    })
  })
}
