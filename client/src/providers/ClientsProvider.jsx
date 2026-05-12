import { useCallback, useEffect, useState } from 'react'
import { useAuthedRequest } from '../hooks/useAuthedRequest'
import { useUser } from '../hooks/useUser'
import { ClientsContext } from '../contexts/ClientsContext'

export const ClientsProvider = ({ children }) => {
  const { user, profile } = useUser()
  const { isReady, get, post, patch } = useAuthedRequest()

  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isStaff = profile?.role === 'staff' || profile?.role === 'admin'

  const fetchClients = useCallback(async () => {
    if (!isReady || !isStaff) return
    setLoading(true)
    setError(null)
    try {
      const data = await get('/api/admin/clients')
      setClients(data.users)
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }, [isReady, isStaff, get])

  useEffect(() => {
    if (!user || !isStaff) {
      setClients([])
      return
    }
    fetchClients()
  }, [user, isStaff, fetchClients])

  const createClient = useCallback(
    async (payload) => {
      const data = await post('/api/admin/clients', payload)
      setClients((prev) => [data.user, ...prev])
      return data
    },
    [post],
  )

  const updateClientRole = useCallback(
    async (id, role) => {
      const { user: updated } = await patch(`/api/admin/clients/${id}/role`, {
        role,
      })
      setClients((prev) =>
        prev.map((u) => (u._id === updated._id ? { ...u, ...updated } : u)),
      )
      return updated
    },
    [patch],
  )

  const getClientDetail = useCallback(
    async (id) => {
      const data = await get(`/api/admin/clients/${id}`)
      return data
    },
    [get],
  )

  return (
    <ClientsContext.Provider
      value={{
        clients,
        loading,
        error,
        refetch: fetchClients,
        createClient,
        updateClientRole,
        getClientDetail,
      }}
    >
      {children}
    </ClientsContext.Provider>
  )
}
