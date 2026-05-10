import { useCallback, useEffect, useState } from 'react'
import { IssuesContext } from '../contexts/IssuesContext'
import { useAuthedRequest } from '../hooks/useAuthedRequest'
import { useSocket } from '../hooks/useSocket'
import { useUser } from '../hooks/useUser'

export const IssuesProvider = ({ children }) => {
  const { user, profile } = useUser()
  const { isReady, get, post, patch, del } = useAuthedRequest()
  const socket = useSocket()

  const [issues, setIssues] = useState([])
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isStaffUser = profile?.role === 'staff' || profile?.role === 'admin'

  const fetchIssues = useCallback(async () => {
    if (!isReady) return
    setLoading(true)
    setError(null)
    try {
      const endpoint = isStaffUser ? '/api/admin/issues' : '/api/issues'
      const data = await get(endpoint)
      setIssues(data.issues)
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }, [isReady, isStaffUser, get])

  const fetchStaff = useCallback(async () => {
    if (!isReady || !isStaffUser) return
    try {
      const data = await get('/api/users/staff')
      setStaff(data.users)
    } catch (err) {
      console.error('Failed to fetch staff list:', err)
    }
  }, [isReady, isStaffUser, get])

  useEffect(() => {
    if (!user) {
      setIssues([])
      setStaff([])
      return
    }
    fetchIssues()
    fetchStaff()
  }, [user, fetchIssues, fetchStaff])

  const createIssue = useCallback(
    async (formData) => {
      const data = await post('/api/issues', formData)
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

  /**
   * Post a comment with optional file attachments.
   * Sends as multipart/form-data so multer handles the files server-side.
   */
  const addComment = useCallback(
    async (id, text, files = []) => {
      const formData = new FormData()
      formData.append('text', text)
      files.forEach((f) => formData.append('attachments', f))
      // Pass FormData directly — useAuthedRequest must not set Content-Type
      // so the browser sets the multipart boundary automatically.
      const data = await post(`/api/issues/${id}/comments`, formData)
      return data.issue
    },
    [post],
  )

  const editComment = useCallback(
    async (issueId, commentId, text) => {
      const data = await patch(`/api/issues/${issueId}/comments/${commentId}`, {
        text,
      })
      return data.issue
    },
    [patch],
  )

  const deleteComment = useCallback(
    async (issueId, commentId) => {
      const data = await del(`/api/issues/${issueId}/comments/${commentId}`)
      return data.issue
    },
    [del],
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
    staff,
    loading,
    error,
    refetch: fetchIssues,
    createIssue,
    updateStatus,
    assignIssue,
    addComment,
    editComment,
    deleteComment,
  }

  return (
    <IssuesContext.Provider value={value}>{children}</IssuesContext.Provider>
  )
}
