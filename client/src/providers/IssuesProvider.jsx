import { useCallback, useEffect, useState } from 'react'
import { IssuesContext } from '../contexts/IssuesContext'
import { useAuthedRequest } from '../hooks/useAuthedRequest'
import { useSocket } from '../hooks/useSocket'
import { useUser } from '../hooks/useUser'

export const IssuesProvider = ({ children }) => {
  const { user } = useUser()
  const { isReady, get, post, patch } = useAuthedRequest()
  const socket = useSocket()

  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchIssues = useCallback(async () => {
    if (!isReady) return
    setLoading(true)
    setError(null)
    try {
      const data = await get('/api/issues')
      setIssues(data.issues)
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }, [isReady, get])

  useEffect(() => {
    if (!user) {
      setIssues([])
      return
    }
    fetchIssues()
  }, [user, fetchIssues])

  const createIssue = useCallback(
    async (formData) => {
      // formData can be plain object or FormData (for file uploads)
      const isFile = formData instanceof FormData
      const config = isFile
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {}
      const data = await post('/api/issues', formData, config)
      return data.issue
    },
    [post],
  )

  const updateStatus = useCallback(
    async (id, status) => {
      const data = await patch(`/api/issues/${id}/status`, { status })
      return data.issue
    },
    [patch],
  )

  const assignIssue = useCallback(
    async (id, assignedTo) => {
      const data = await patch(`/api/issues/${id}/assign`, { assignedTo })
      return data.issue
    },
    [patch],
  )

  const addComment = useCallback(
    async (id, text) => {
      const data = await post(`/api/issues/${id}/comments`, { text })
      return data.issue
    },
    [post],
  )

  // Socket subscriptions
  useEffect(() => {
    if (!socket) return

    const onCreated = (issue) => {
      setIssues((prev) => {
        if (prev.some((i) => i._id === issue._id)) return prev
        return [issue, ...prev]
      })
    }
    const onUpdated = (issue) => {
      setIssues((prev) => prev.map((i) => (i._id === issue._id ? issue : i)))
    }

    socket.on('issue:created', onCreated)
    socket.on('issue:updated', onUpdated)
    socket.on('issue:commented', onUpdated)

    return () => {
      socket.off('issue:created', onCreated)
      socket.off('issue:updated', onUpdated)
      socket.off('issue:commented', onUpdated)
    }
  }, [socket])

  const value = {
    issues,
    loading,
    error,
    refetch: fetchIssues,
    createIssue,
    updateStatus,
    assignIssue,
    addComment,
  }

  return (
    <IssuesContext.Provider value={value}>{children}</IssuesContext.Provider>
  )
}
