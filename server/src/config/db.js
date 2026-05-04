import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(
      `✓ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`,
    )
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message)
    process.exit(1)
  }
}

// Log disconnects/reconnects so you notice if something flaps
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected')
})

mongoose.connection.on('reconnected', () => {
  console.log('✓ MongoDB reconnected')
})
