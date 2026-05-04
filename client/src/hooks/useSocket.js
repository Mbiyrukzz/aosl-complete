import { useEffect, useState } from 'react'
import { connectSocket, disconnectSocket } from '../services/socket'
import { useUser } from './useUser'

export const useSocket = () => {
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

  return socket
}
