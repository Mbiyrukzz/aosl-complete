import express from 'express'
import http from 'http'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { Server } from 'socket.io'

import routes from './routes/index.js'
import { errorHandler } from './middleware/errorHandler.js'
import { initializeSockets } from './sockets/index.js'
import { connectDB } from './config/db.js'
import { verifyEmail } from './services/email.service.js'
import { startReminderWorker } from './workers/reminder-worker.js'
import { migrateToCompanies } from './migrations/001-companies.js'
import { startPackageStatusWorker } from './workers/package-status-worker.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

// 1. Connect to DB before doing anything else
await connectDB()
await migrateToCompanies()
await Promise.race([
  verifyEmail(),
  new Promise((resolve) => setTimeout(resolve, 5000)),
]).catch(() => {})
startReminderWorker()
startPackageStatusWorker()

// 2. Create HTTP + Socket.IO together
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: CLIENT_URL, credentials: true },
})
initializeSockets(io)

// 3. Global middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
)
app.use(cors({ origin: CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 4. Static
app.use('/uploads', express.static('uploads'))

// 5. Inject io so controllers can emit
app.use((req, res, next) => {
  req.io = io
  next()
})

// 6. Routes
routes.forEach((route) => {
  if (!route.path || !route.method || !route.handler) {
    console.error('❌ Invalid route:', route)
    return
  }
  const fullPath = `/api${route.path}`
  const middleware = route.middleware || []
  console.log(`✓ ${route.method.toUpperCase().padEnd(6)} ${fullPath}`)
  app[route.method](fullPath, ...middleware, route.handler)
})

// 7. Error handler — last
app.use(errorHandler)

server.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`)
  console.log(`✓ Accepting requests from ${CLIENT_URL}\n`)
})
