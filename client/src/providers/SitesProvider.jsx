import { useCallback, useEffect, useState } from 'react'
import { useAuthedRequest } from '../hooks/useAuthedRequest'
import { useUser } from '../hooks/useUser'
import { SitesContext } from '../contexts/SitesContext'

export const SitesProvider = ({ children }) => {
  const { user, profile } = useUser()
  const { isReady, get, post, patch, del } = useAuthedRequest()

  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isStaff = profile?.role === 'staff' || profile?.role === 'admin'

  const fetchSites = useCallback(async () => {
    if (!isReady || !isStaff) return
    setLoading(true)
    setError(null)
    try {
      const data = await get('/api/admin/sites')
      setSites(data.sites)
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }, [isReady, isStaff, get])

  useEffect(() => {
    if (!user || !isStaff) {
      setSites([])
      return
    }
    fetchSites()
  }, [user, isStaff, fetchSites])

  const createSite = useCallback(
    async (payload) => {
      const data = await post('/api/admin/sites', payload)
      setSites((prev) =>
        [...prev, data.site].sort((a, b) => a.prefix.localeCompare(b.prefix)),
      )
      return data.site
    },
    [post],
  )

  const updateSite = useCallback(
    async (id, payload) => {
      const { site } = await patch(`/api/admin/sites/${id}`, payload)
      setSites((prev) => prev.map((s) => (s._id === site._id ? site : s)))
      return site
    },
    [patch],
  )

  const deleteSite = useCallback(
    async (id) => {
      await del(`/api/admin/sites/${id}`)
      setSites((prev) => prev.filter((s) => s._id !== id))
    },
    [del],
  )

  return (
    <SitesContext.Provider
      value={{
        sites,
        loading,
        error,
        refetch: fetchSites,
        createSite,
        updateSite,
        deleteSite,
      }}
    >
      {children}
    </SitesContext.Provider>
  )
}
