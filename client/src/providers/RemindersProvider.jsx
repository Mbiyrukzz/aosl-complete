import { useCallback, useEffect, useState } from 'react'
import { RemindersContext } from '../contexts/RemindersContext'
import { useAuthedRequest } from '../hooks/useAuthedRequest'
import { useUser } from '../hooks/useUser'

export const RemindersProvider = ({ children }) => {
  const { user, profile } = useUser()
  const { isReady, get, post, patch, del } = useAuthedRequest()

  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isStaff = profile?.role === 'staff' || profile?.role === 'admin'

  const fetchAllReminders = useCallback(
    async (filters = {}) => {
      if (!isReady || !isStaff) return
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (filters.status && filters.status !== 'all')
          params.set('status', filters.status)
        if (filters.companyId) params.set('companyId', filters.companyId)
        const qs = params.toString() ? `?${params}` : ''
        const data = await get(`/api/admin/reminders${qs}`)
        setReminders(data.reminders)
      } catch (err) {
        setError(err.response?.data?.error || err.message)
      } finally {
        setLoading(false)
      }
    },
    [isReady, isStaff, get],
  )

  const fetchMyReminders = useCallback(async () => {
    if (!isReady) return
    setLoading(true)
    setError(null)
    try {
      const data = await get('/api/me/reminders')
      setReminders(data.reminders)
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }, [isReady, get])

  useEffect(() => {
    if (!user) {
      setReminders([])
      return
    }
    if (isStaff) fetchAllReminders()
    else fetchMyReminders()
  }, [user, isStaff, fetchAllReminders, fetchMyReminders])

  const createReminder = useCallback(
    async (data) => {
      const res = await post('/api/admin/reminders', data)
      setReminders((prev) => [res.reminder, ...prev])
      return res.reminder
    },
    [post],
  )

  const updateReminder = useCallback(
    async (id, data) => {
      const res = await patch(`/api/admin/reminders/${id}`, data)
      setReminders((prev) =>
        prev.map((r) => (r._id === res.reminder._id ? res.reminder : r)),
      )
      return res.reminder
    },
    [patch],
  )

  const deleteReminder = useCallback(
    async (id) => {
      await del(`/api/admin/reminders/${id}`)
      setReminders((prev) => prev.filter((r) => r._id !== id))
    },
    [del],
  )

  const value = {
    reminders,
    loading,
    error,
    refetch: isStaff ? fetchAllReminders : fetchMyReminders,
    createReminder,
    updateReminder,
    deleteReminder,
  }

  return (
    <RemindersContext.Provider value={value}>
      {children}
    </RemindersContext.Provider>
  )
}
