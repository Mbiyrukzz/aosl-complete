import { useCallback, useEffect, useState } from 'react'
import useAuthedRequest from '../hooks/useAuthedRequest'
import { AccountsContext } from '../contexts/AccountsContext'

export const AccountsProvider = ({ children, scope = 'stats' }) => {
  const { isReady, get, post, patch, del } = useAuthedRequest()

  const [quotations, setQuotations] = useState([])
  const [invoices, setInvoices] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /* ─── Fetch helpers ─────────────────────────────────────── */

  const fetchStats = useCallback(async () => {
    if (!isReady) return

    setLoading(true)
    setError(null)

    try {
      const data = await get('/api/accounts/stats')
      setStats(data.stats)
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }, [isReady, get])

  const fetchQuotations = useCallback(
    async (filters = {}) => {
      if (!isReady) return

      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()

        if (filters.status && filters.status !== 'all') {
          params.set('status', filters.status)
        }

        if (filters.companyId) {
          params.set('companyId', filters.companyId)
        }

        if (filters.currency) {
          params.set('currency', filters.currency)
        }

        const qs = params.toString() ? `?${params.toString()}` : ''

        const data = await get(`/api/accounts/quotations${qs}`)

        setQuotations(data.quotations)
      } catch (err) {
        setError(err.response?.data?.error || err.message)
      } finally {
        setLoading(false)
      }
    },
    [isReady, get],
  )

  const fetchInvoices = useCallback(
    async (filters = {}) => {
      if (!isReady) return

      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()

        if (filters.status && filters.status !== 'all') {
          params.set('status', filters.status)
        }

        if (filters.companyId) {
          params.set('companyId', filters.companyId)
        }

        if (filters.type) {
          params.set('type', filters.type)
        }

        const qs = params.toString() ? `?${params.toString()}` : ''

        const data = await get(`/api/accounts/invoices${qs}`)

        setInvoices(data.invoices)
      } catch (err) {
        setError(err.response?.data?.error || err.message)
      } finally {
        setLoading(false)
      }
    },
    [isReady, get],
  )

  /* ─── Initial fetch ─────────────────────────────────────── */

  useEffect(() => {
    if (!isReady) return

    if (scope === 'quotations') {
      fetchQuotations()
    } else if (scope === 'invoices') {
      fetchInvoices()
    } else {
      fetchStats()
    }
  }, [isReady, scope, fetchStats, fetchQuotations, fetchInvoices])

  /* ─── Quotation actions ─────────────────────────────────── */

  const createQuotation = useCallback(
    async (payload) => {
      const data = await post('/api/accounts/quotations', payload)

      setQuotations((prev) => [data.quotation, ...prev])

      return data.quotation
    },
    [post],
  )

  const updateQuotation = useCallback(
    async (id, payload) => {
      const data = await patch(`/api/accounts/quotations/${id}`, payload)

      setQuotations((prev) =>
        prev.map((q) => (q._id === id ? data.quotation : q)),
      )

      return data.quotation
    },
    [patch],
  )

  const deleteQuotation = useCallback(
    async (id) => {
      await del(`/api/accounts/quotations/${id}`)

      setQuotations((prev) => prev.filter((q) => q._id !== id))
    },
    [del],
  )

  const sendQuotation = useCallback(
    async (id, email, pdfBase64) => {
      const data = await post(`/api/accounts/quotations/${id}/send`, {
        email,
        pdfBase64,
      })

      setQuotations((prev) =>
        prev.map((q) =>
          q._id === id
            ? {
                ...q,
                status: q.status === 'draft' ? 'sent' : q.status,
                sentTo: email,
              }
            : q,
        ),
      )

      return data
    },
    [post],
  )

  const convertQuotation = useCallback(
    async (id, dueDate) => {
      const data = await post(`/api/accounts/quotations/${id}/convert`, {
        dueDate,
      })

      setQuotations((prev) =>
        prev.map((q) => (q._id === id ? { ...q, status: 'converted' } : q)),
      )

      setInvoices((prev) => [data.invoice, ...prev])

      return data.invoice
    },
    [post],
  )

  /* ─── Invoice actions ───────────────────────────────────── */

  const createInvoice = useCallback(
    async (payload) => {
      const data = await post('/api/accounts/invoices', payload)

      setInvoices((prev) => [data.invoice, ...prev])

      return data.invoice
    },
    [post],
  )

  const updateInvoice = useCallback(
    async (id, payload) => {
      const data = await patch(`/api/accounts/invoices/${id}`, payload)

      setInvoices((prev) =>
        prev.map((inv) => (inv._id === id ? data.invoice : inv)),
      )

      return data.invoice
    },
    [patch],
  )

  const sendInvoice = useCallback(
    async (id, email, pdfBase64) => {
      const data = await post(`/api/accounts/invoices/${id}/send`, {
        email,
        pdfBase64,
      })

      setInvoices((prev) =>
        prev.map((inv) =>
          inv._id === id
            ? {
                ...inv,
                status: 'sent',
                sentTo: email,
              }
            : inv,
        ),
      )

      return data
    },
    [post],
  )

  const uploadInvoicePDF = useCallback(
    async (formData) => {
      const data = await post('/api/accounts/invoices/upload', formData)

      setInvoices((prev) => [data.invoice, ...prev])

      return data.invoice
    },
    [post],
  )

  return (
    <AccountsContext.Provider
      value={{
        quotations,
        invoices,
        stats,
        loading,
        error,

        fetchStats,
        fetchQuotations,
        fetchInvoices,

        createQuotation,
        updateQuotation,
        deleteQuotation,
        sendQuotation,
        convertQuotation,

        createInvoice,
        updateInvoice,
        sendInvoice,
        uploadInvoicePDF,
      }}
    >
      {children}
    </AccountsContext.Provider>
  )
}
