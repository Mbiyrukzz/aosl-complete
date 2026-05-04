import { useEffect, useState } from 'react'
import { SocketContext } from '../contexts/SocketContext'
import { connectSocket, disconnectSocket } from '../services/socket'
import { useUser } from '../hooks/useUser'

export const SocketProvider = ({ children }) => {
  const { user } = useUser()
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (!user) {
      disconnectSocket()
      setSocket(null)
      return
    }

    let cancelled = false
    connectSocket().then((s) => {
      if (!cancelled) setSocket(s)
    })

    return () => {
      cancelled = true
    }
  }, [user])

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}
