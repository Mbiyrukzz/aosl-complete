import { io } from 'socket.io-client'
import { auth } from './firebase'

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

let socket = null
let connecting = null // promise, so concurrent callers wait for the same connection

export const connectSocket = async () => {
  if (socket?.connected) return socket
  if (connecting) return connecting // already connecting — return the same promise

  connecting = (async () => {
    const user = auth.currentUser
    if (!user) {
      connecting = null
      throw new Error('Must be logged in to connect socket')
    }

    const token = await user.getIdToken()

    socket = io(SOCKET_URL, {
      auth: { token },
      autoConnect: true,
    })

    socket.on('connect', () => console.log('Socket connected:', socket.id))
    socket.on('connect_error', (err) =>
      console.error('Socket error:', err.message),
    )

    connecting = null
    return socket
  })()

  return connecting
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
  connecting = null
}

export const getSocket = () => socket
