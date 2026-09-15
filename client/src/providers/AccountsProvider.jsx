import { useCallback, useEffect, useState } from 'react'
import useAuthedRequest from '../hooks/useAuthedRequest'
import { AccountsContext } from '../contexts/AccountsContext'
import { pdf } from '@react-pdf/renderer'
import { blobToBase64, ReceiptPDFDocument } from '../pdf/ReceiptPDF'
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const API_BASE = `${BASE_URL}/api/accounts`

export const AccountsProvider = ({ children, scope = 'stats' }) => {
  const { isReady, get, post, patch, del } = useAuthedRequest()

  const [quotations, setQuotations] = useState([])
  const [invoices, setInvoices] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /* ── Generic request wrapper with loading/error state ───────── */
  const withLoading = useCallback(async (fn) => {
    setLoading(true)
    setError(null)
    try {
      return await fn()
    } catch (err) {
      const msg = err.response?.data?.error || err.message
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /* ── Stats ──────────────────────────────────────────────────── */

  const fetchStats = useCallback(async () => {
    if (!isReady) return
    return withLoading(async () => {
      const data = await get(`${API_BASE}/stats`)
      setStats(data.stats)
      return data.stats
    })
  }, [isReady, get, withLoading])

  /* ── Quotations ─────────────────────────────────────────────── */

  const fetchQuotations = useCallback(
    async (filters = {}) => {
      if (!isReady) return
      return withLoading(async () => {
        const params = new URLSearchParams()
        if (filters.status && filters.status !== 'all')
          params.set('status', filters.status)
        if (filters.companyId) params.set('companyId', filters.companyId)
        if (filters.currency) params.set('currency', filters.currency)
        const qs = params.size ? `?${params}` : ''
        const data = await get(`${API_BASE}/quotations${qs}`)
        setQuotations(data.quotations)
        return data.quotations
      })
    },
    [isReady, get, withLoading],
  )

  const fetchQuotation = useCallback(
    async (id) => {
      if (!isReady) return
      const data = await get(`${API_BASE}/quotations/${id}`)
      return data.quotation
    },
    [isReady, get],
  )

  const createQuotation = useCallback(
    async (payload) => {
      const data = await post(`${API_BASE}/quotations`, payload)
      setQuotations((prev) => [data.quotation, ...prev])
      return data.quotation
    },
    [post],
  )

  const updateQuotation = useCallback(
    async (id, payload) => {
      const data = await patch(`${API_BASE}/quotations/${id}`, payload)
      setQuotations((prev) =>
        prev.map((q) => (q._id === id ? data.quotation : q)),
      )
      return data.quotation
    },
    [patch],
  )

  const deleteQuotation = useCallback(
    async (id) => {
      await del(`${API_BASE}/quotations/${id}`)
      setQuotations((prev) => prev.filter((q) => q._id !== id))
    },
    [del],
  )

  const sendQuotation = useCallback(
    async (id, email, pdfBase64 = null) => {
      const data = await post(`${API_BASE}/quotations/${id}/send`, {
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
      const data = await post(`${API_BASE}/quotations/${id}/convert`, {
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

  /* ── Invoices ───────────────────────────────────────────────── */

  const fetchInvoices = useCallback(
    async (filters = {}) => {
      if (!isReady) return
      return withLoading(async () => {
        const params = new URLSearchParams()
        if (filters.status && filters.status !== 'all')
          params.set('status', filters.status)
        if (filters.companyId) params.set('companyId', filters.companyId)
        if (filters.type) params.set('type', filters.type)
        const qs = params.size ? `?${params}` : ''
        const data = await get(`${API_BASE}/invoices${qs}`)
        setInvoices(data.invoices)
        return data.invoices
      })
    },
    [isReady, get, withLoading],
  )

  const fetchInvoice = useCallback(
    async (id) => {
      if (!isReady) return
      const data = await get(`${API_BASE}/invoices/${id}`)
      return data.invoice
    },
    [isReady, get],
  )

  const createInvoice = useCallback(
    async (payload) => {
      const data = await post(`${API_BASE}/invoices`, payload)
      setInvoices((prev) => [data.invoice, ...prev])
      return data.invoice
    },
    [post],
  )

  const updateInvoice = useCallback(
    async (id, payload) => {
      const data = await patch(`${API_BASE}/invoices/${id}`, payload)
      setInvoices((prev) =>
        prev.map((inv) => (inv._id === id ? data.invoice : inv)),
      )
      return data.invoice
    },
    [patch],
  )

  const sendInvoice = useCallback(
    async (id, email, pdfBase64 = null) => {
      const data = await post(`${API_BASE}/invoices/${id}/send`, {
        email,
        pdfBase64,
      })
      setInvoices((prev) =>
        prev.map((inv) =>
          inv._id === id ? { ...inv, status: 'sent', sentTo: email } : inv,
        ),
      )
      return data
    },
    [post],
  )

  /**
   * Marks an invoice paid and returns its freshly-created (or existing)
   * Receipt in the same round trip, so the UI can show it immediately.
   */
  const markInvoicePaid = useCallback(
    async (id, payload = {}) => {
      const data = await post(`${API_BASE}/invoices/${id}/mark-paid`, payload)
      setInvoices((prev) =>
        prev.map((inv) => (inv._id === id ? data.invoice : inv)),
      )
      return data // { invoice, receipt }
    },
    [post],
  )

  /**
   * Fetch the receipt already issued for a paid invoice — used to
   * reopen the receipt view without regenerating anything.
   */
  const fetchInvoiceReceipt = useCallback(
    async (id) => {
      const data = await get(`${API_BASE}/invoices/${id}/receipt`)
      return data.receipt
    },
    [get],
  )

  const saveReceiptPdf = useCallback(
  async (receiptId, pdfBase64) => {
    const data = await post(`${API_BASE}/receipts/${receiptId}/store-pdf`, {
      pdfBase64,
    })
    return data.receipt
  },
  [post],
)

  const regenerateReceipt = useCallback(
  async (invoiceId, receipt) => {
    const blob = await pdf(<ReceiptPDFDocument receipt={receipt} />).toBlob()
    const pdfBase64 = await blobToBase64(blob)
    const data = await post(`${API_BASE}/invoices/${invoiceId}/store-receipt`, { pdfBase64 })
    return data.receipt
  },
  [post],
)

  /**
   * Upload an eTIMS PDF invoice.
   */
  const uploadInvoicePDF = useCallback(
    async (formData) => {
      // post() works fine — axios sees FormData and sets Content-Type automatically
      const data = await post(`${API_BASE}/invoices/upload`, formData)
      setInvoices((prev) => [data.invoice, ...prev])
      return data.invoice
    },
    [post],
  )

  const unmarkInvoicePaid = useCallback(
  async (id) => {
    const data = await post(`${API_BASE}/invoices/${id}/unmark-paid`, {})
    setInvoices((prev) => prev.map((inv) => (inv._id === id ? data.invoice : inv)))
    return data.invoice
  },
  [post],
)
  /* ── Initial fetch ──────────────────────────────────────────── */

  useEffect(() => {
    if (!isReady) return
    if (scope === 'quotations') fetchQuotations()
    else if (scope === 'invoices') fetchInvoices()
    else fetchStats()
  }, [isReady, scope]) // eslint-disable-line

  /* ── Context value ──────────────────────────────────────────── */

  return (
    <AccountsContext.Provider
      value={{
        // State
        quotations,
        invoices,
        stats,
        loading,
        error,

        // Quotation actions
        fetchQuotations,
        fetchQuotation,
        createQuotation,
        updateQuotation,
        deleteQuotation,
        sendQuotation,
        convertQuotation,

        // Invoice actions
        fetchInvoices,
        fetchInvoice,
        createInvoice,
        updateInvoice,
        sendInvoice,
        uploadInvoicePDF,
        markInvoicePaid,
        fetchInvoiceReceipt,
        regenerateReceipt,
        saveReceiptPdf,
        unmarkInvoicePaid,

        // Stats
        fetchStats,
      }}
    >
      {children}
    </AccountsContext.Provider>
  )
}