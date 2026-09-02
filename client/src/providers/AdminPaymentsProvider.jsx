import { useCallback, useEffect, useState } from 'react'
import { useAuthedRequest } from '../hooks/useAuthedRequest'
import { useUser } from '../hooks/useUser'
import { AdminPaymentsContext } from '../contexts/AdminPaymentsContext'

export const AdminPaymentsProvider = ({ children }) => {
  const { user, profile } = useUser()
  const { isReady, get } = useAuthedRequest()

  const [payments, setPayments] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isStaff = profile?.role === 'staff' || profile?.role === 'admin'

  const fetchPayments = useCallback(
    async (params = {}) => {
      if (!isReady || !isStaff) return
      setLoading(true)
      setError(null)
      try {
        const qs = new URLSearchParams(params).toString()
        const data = await get(`/api/admin/payments${qs ? `?${qs}` : ''}`)
        setPayments(data.payments)
        setTotal(data.total)
      } catch (err) {
        setError(err.response?.data?.error || err.message)
      } finally {
        setLoading(false)
      }
    },
    [isReady, isStaff, get],
  )

  const getPaymentDetail = useCallback(
    async (id) => {
      const data = await get(`/api/admin/payments/${id}`)
      return data.payment
    },
    [get],
  )

  useEffect(() => {
    if (!user || !isStaff) {
      setPayments([])
      return
    }
    fetchPayments()
  }, [user, isStaff, fetchPayments])

  return (
    <AdminPaymentsContext.Provider
      value={{
        payments,
        total,
        loading,
        error,
        refetch: fetchPayments,
        getPaymentDetail,
      }}
    >
      {children}
    </AdminPaymentsContext.Provider>
  )
}
