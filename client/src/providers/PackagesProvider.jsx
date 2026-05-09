import { useCallback, useEffect, useState } from 'react'
import { PackagesContext } from '../contexts/PackagesContext'
import { useAuthedRequest } from '../hooks/useAuthedRequest'
import { useUser } from '../hooks/useUser'

export const PackagesProvider = ({ children }) => {
  const { user, profile } = useUser()
  const { isReady, get, post, patch, del } = useAuthedRequest()

  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isStaff = profile?.role === 'staff' || profile?.role === 'admin'

  const fetchPackages = useCallback(
    async (filters = {}) => {
      if (!isReady || !isStaff) return
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (filters.status && filters.status !== 'all')
          params.set('status', filters.status)
        if (filters.type && filters.type !== 'all')
          params.set('type', filters.type)
        if (filters.companyId) params.set('companyId', filters.companyId) // ← was userId

        const qs = params.toString() ? `?${params}` : ''
        const data = await get(`/api/admin/packages${qs}`)
        setPackages(data.packages)
      } catch (err) {
        setError(err.response?.data?.error || err.message)
      } finally {
        setLoading(false)
      }
    },
    [isReady, isStaff, get],
  )
  // Client fetch — own packages only
  const fetchMyPackages = useCallback(async () => {
    if (!isReady) return
    setLoading(true)
    setError(null)
    try {
      const data = await get('/api/me/packages')
      setPackages(data.packages)
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }, [isReady, get])

  useEffect(() => {
    if (!user) {
      setPackages([])
      return
    }
    if (isStaff) fetchPackages()
    else fetchMyPackages()
  }, [user, isStaff, fetchPackages, fetchMyPackages])

  const createPackage = useCallback(
    async (data) => {
      const res = await post('/api/admin/packages', data)
      setPackages((prev) => [res.package, ...prev])
      return res.package
    },
    [post],
  )

  const updatePackage = useCallback(
    async (id, data) => {
      const res = await patch(`/api/admin/packages/${id}`, data)
      setPackages((prev) =>
        prev.map((p) => (p._id === res.package._id ? res.package : p)),
      )
      return res.package
    },
    [patch],
  )

  const deletePackage = useCallback(
    async (id) => {
      await del(`/api/admin/packages/${id}`)
      setPackages((prev) => prev.filter((p) => p._id !== id))
    },
    [del],
  )

  const value = {
    packages,
    loading,
    error,
    refetch: isStaff ? fetchPackages : fetchMyPackages,
    createPackage,
    updatePackage,
    deletePackage,
  }

  return (
    <PackagesContext.Provider value={value}>
      {children}
    </PackagesContext.Provider>
  )
}
