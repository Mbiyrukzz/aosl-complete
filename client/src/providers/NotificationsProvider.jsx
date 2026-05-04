import { useCallback, useEffect, useState } from 'react'
import { NotificationsContext } from '../contexts/NotificationsContext'
import { useAuthedRequest } from '../hooks/useAuthedRequest'
import { useSocket } from '../hooks/useSocket'
import { useUser } from '../hooks/useUser'

export const NotificationsProvider = ({ children }) => {
  const { user } = useUser()
  const { isReady, get, patch } = useAuthedRequest()
  const socket = useSocket()

  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [toasts, setToasts] = useState([]) // ephemeral, in-memory only

  // Fetch on login
  useEffect(() => {
    if (!user || !isReady) {
      setNotifications([])
      setUnreadCount(0)
      return
    }
    get('/api/notifications')
      .then((data) => {
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
      })
      .catch((err) => console.error('Failed to fetch notifications:', err))
  }, [user, isReady, get])

  useEffect(() => {
    if (!socket) {
      console.log('🔴 NotificationsProvider: no socket')
      return
    }
    console.log('🟢 NotificationsProvider subscribing on socket:', socket.id)

    const onNew = (notif) => {
      console.log('🔔 Got notification:new', notif)
      setNotifications((prev) => [notif, ...prev].slice(0, 50))
      setUnreadCount((c) => c + 1)
      const toastId = notif._id || Date.now()
      setToasts((prev) => [...prev, { ...notif, toastId }])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.toastId !== toastId))
      }, 5000)
    }

    socket.on('notification:new', onNew)
    return () => socket.off('notification:new', onNew)
  }, [socket])

  const markAsRead = useCallback(
    async (id) => {
      // Optimistic
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
      )
      setUnreadCount((c) => Math.max(0, c - 1))
      try {
        await patch(`/api/notifications/${id}/read`)
      } catch (err) {
        console.error('Failed to mark read:', err)
      }
    },
    [patch],
  )

  const markAllAsRead = useCallback(async () => {
    // Optimistic
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
    try {
      await patch('/api/notifications/read-all')
    } catch (err) {
      console.error('Failed to mark all read:', err)
    }
  }, [patch])

  const dismissToast = useCallback((toastId) => {
    setToasts((prev) => prev.filter((t) => t.toastId !== toastId))
  }, [])

  const value = {
    notifications,
    unreadCount,
    toasts,
    markAsRead,
    markAllAsRead,
    dismissToast,
  }

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}
