import { useCallback, useEffect, useState } from 'react'
import { CompaniesContext } from '../contexts/CompaniesContext'
import { useAuthedRequest } from '../hooks/useAuthedRequest'
import { useUser } from '../hooks/useUser'

export const CompaniesProvider = ({ children }) => {
  const { user, profile } = useUser()
  const { isReady, get, post, patch, del } = useAuthedRequest()

  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isStaff = profile?.role === 'staff' || profile?.role === 'admin'

  const fetchCompanies = useCallback(
    async (filters = {}) => {
      if (!isReady || !isStaff) return
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (filters.tier && filters.tier !== 'all')
          params.set('tier', filters.tier)
        if (filters.status && filters.status !== 'all')
          params.set('status', filters.status)

        const qs = params.toString() ? `?${params}` : ''
        const data = await get(`/api/admin/companies${qs}`)
        setCompanies(data.companies)
      } catch (err) {
        setError(err.response?.data?.error || err.message)
      } finally {
        setLoading(false)
      }
    },
    [isReady, isStaff, get],
  )

  useEffect(() => {
    if (!user || !isStaff) {
      setCompanies([])
      return
    }
    fetchCompanies()
  }, [user, isStaff, fetchCompanies])

  const createCompany = useCallback(
    async (data) => {
      const res = await post('/api/admin/companies', data)
      // New companies have zero counts at creation — decorate to match list shape
      const decorated = {
        ...res.company,
        counts: { users: 0, packages: 0, openIssues: 0 },
      }
      setCompanies((prev) => [decorated, ...prev])
      return decorated
    },
    [post],
  )

  const updateCompany = useCallback(
    async (id, data) => {
      const res = await patch(`/api/admin/companies/${id}`, data)
      setCompanies((prev) =>
        prev.map((c) =>
          c._id === res.company._id
            ? { ...c, ...res.company, counts: c.counts }
            : c,
        ),
      )
      return res.company
    },
    [patch],
  )

  const deleteCompany = useCallback(
    async (id) => {
      await del(`/api/admin/companies/${id}`)
      setCompanies((prev) => prev.filter((c) => c._id !== id))
    },
    [del],
  )

  // Get a single company with full detail (users, packages, open issues)
  const getCompanyDetail = useCallback(
    async (id) => {
      const data = await get(`/api/admin/companies/${id}`)
      return data
    },
    [get],
  )

  const value = {
    companies,
    loading,
    error,
    refetch: fetchCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    getCompanyDetail,
  }

  return (
    <CompaniesContext.Provider value={value}>
      {children}
    </CompaniesContext.Provider>
  )
}
