import { useCallback, useEffect, useState } from 'react'
import { ProjectsContext } from '../contexts/ProjectsContext'
import { useAuthedRequest } from '../hooks/useAuthedRequest'
import { useUser } from '../hooks/useUser'
import { useSocket } from '../hooks/useSocket'

export const ProjectsProvider = ({ children }) => {
  const { user, profile } = useUser()
  const { isReady, get, post, patch, del } = useAuthedRequest()
  const socket = useSocket()

  const isStaff = profile?.role === 'staff' || profile?.role === 'admin'

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [myProjects, setMyProjects] = useState([])
  const [myProjectsLoading, setMyProjectsLoading] = useState(false)
  const [myProjectsError, setMyProjectsError] = useState(null)

  const fetchProjects = useCallback(
    async (filters = {}) => {
      if (!isReady || !isStaff) return
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (filters.companyId) params.set('companyId', filters.companyId)
        if (filters.status && filters.status !== 'all')
          params.set('status', filters.status)

        const qs = params.toString() ? `?${params}` : ''
        const data = await get(`/api/admin/projects${qs}`)
        setProjects(data.projects)
      } catch (err) {
        setError(err.response?.data?.error || err.message)
      } finally {
        setLoading(false)
      }
    },
    [isReady, isStaff, get],
  )

  const fetchMyProjects = useCallback(async () => {
    if (!isReady) return
    setMyProjectsLoading(true)
    setMyProjectsError(null)
    try {
      const data = await get('/api/projects/mine')
      setMyProjects(data.projects || [])
    } catch (err) {
      setMyProjectsError(err.response?.data?.error || err.message)
    } finally {
      setMyProjectsLoading(false)
    }
  }, [isReady, get])

  useEffect(() => {
    if (!user) {
      setProjects([])
      setMyProjects([])
      return
    }
    if (isStaff) fetchProjects()
    else fetchMyProjects()
  }, [user, isStaff, fetchProjects, fetchMyProjects])

  const createProject = useCallback(
    async (data) => {
      const res = await post('/api/admin/projects', data)
      setProjects((prev) => [res.project, ...prev])
      return res.project
    },
    [post],
  )

  const updateProject = useCallback(
    async (id, data) => {
      const res = await patch(`/api/admin/projects/${id}`, data)
      setProjects((prev) =>
        prev.map((p) => (p._id === res.project._id ? res.project : p)),
      )
      return res.project
    },
    [patch],
  )

  const addProjectUpdate = useCallback(
    async (id, data) => {
      const res = await post(`/api/admin/projects/${id}/updates`, data)
      setProjects((prev) =>
        prev.map((p) => (p._id === res.project._id ? res.project : p)),
      )
      return res.project
    },
    [post],
  )

  const deleteProject = useCallback(
    async (id) => {
      await del(`/api/admin/projects/${id}`)
      setProjects((prev) => prev.filter((p) => p._id !== id))
    },
    [del],
  )

  const getProjectDetail = useCallback(
    async (id) => {
      const data = await get(`/api/admin/projects/${id}`)
      return data.project
    },
    [get],
  )

  // Staff helper — fetch just one company's projects (used on the company detail page)
  const getCompanyProjects = useCallback(
    async (companyId) => {
      const data = await get(`/api/admin/projects?companyId=${companyId}`)
      return data.projects || []
    },
    [get],
  )

  const getMyProjectDetail = useCallback(
    async (id) => {
      const data = await get(`/api/projects/mine/${id}`)
      return data.project
    },
    [get],
  )

  /* ─── Socket subscriptions ────────────────────────────────── */

  useEffect(() => {
    if (!socket) return

    const upsert = (project) => {
      const merge = (list) => {
        const exists = list.some((p) => p._id === project._id)
        return exists
          ? list.map((p) => (p._id === project._id ? project : p))
          : [project, ...list]
      }
      setProjects(merge)
      setMyProjects(merge)
    }

    socket.on('project:created', upsert)
    socket.on('project:updated', upsert)
    socket.on('project:commented', upsert)

    return () => {
      socket.off('project:created', upsert)
      socket.off('project:updated', upsert)
      socket.off('project:commented', upsert)
    }
  }, [socket])

  const value = {
    projects,
    loading,
    error,
    refetch: fetchProjects,
    createProject,
    updateProject,
    addProjectUpdate,
    deleteProject,
    getProjectDetail,
    getCompanyProjects,
    myProjects,
    myProjectsLoading,
    myProjectsError,
    refetchMyProjects: fetchMyProjects,
    getMyProjectDetail,
  }

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  )
}