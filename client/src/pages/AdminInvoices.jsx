import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  Receipt,
  Plus,
  Search,
  Send,
  Pencil,
  Upload,
  RefreshCw,
  CheckCircle,
} from 'lucide-react'
import { useAccounts } from '../hooks/useAccounts'
import { useAuthedRequest } from '../hooks/useAuthedRequest'
import { InvoiceFormModal } from '../components/InvoiceFormModal'
import { SendModal } from '../components/SendModal'
import {
  PageWrapper,
  PageHead,
  PageHeading,
  HeadActions,
  PrimaryButton,
  SecondaryButton,
  StatusBadge,
  INVOICE_STATUS,
  Toolbar,
  SearchWrap,
  SearchInput,
  Table,
  Thead,
  Th,
  Tr,
  Td,
  TableCard,
  Empty,
  StatsGrid,
  StatCard,
  Modal,
  ModalBox,
  ModalHead,
  ModalActions,
  CloseBtn,
  Field,
  Label,
  Input,
  Select,
  fmtDate,
  fmt,
} from '../components/AccountsShared'
import { X } from 'lucide-react'

const SmallBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.65rem;
  font-size: 0.78rem;
  font-weight: 500;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors?.border || '#e5e7eb'};
  background: transparent;
  color: ${({ theme }) => theme.colors?.text || '#1a1a1a'};
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
  transition: all 0.13s ease;

  &:hover {
    background: ${({ theme }) => theme.colors?.background || '#f9fafb'};
  }

  ${({ $primary, theme }) =>
    $primary &&
    `background: ${theme.colors?.text || '#1a1a1a'};
     color: ${theme.colors?.background || '#fff'};
     border-color: transparent;
     &:hover { opacity: 0.85; background: ${theme.colors?.text || '#1a1a1a'}; }`}

  ${({ $success }) =>
    $success &&
    `color: #10b981;
     &:hover { border-color: #10b981; background: rgba(16,185,129,0.06); }`}
`

const ActionGroup = styled.div`
  display: flex;
  gap: 0.4rem;
  justify-content: flex-end;
`

/* ── Upload PDF Modal ─────────────────────────────────────── */
const UploadModal = ({
  open,
  onClose,
  onUpload,
  companies = [],
  submitting,
}) => {
  const [form, setForm] = useState({
    file: null,
    etimsRef: '',
    companyId: '',
    clientName: '',
    clientEmail: '',
    total: '',
    currency: 'KES',
    dueDate: '',
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.file) return alert('Please select a PDF file.')
    const fd = new FormData()
    fd.append('invoice', form.file)
    fd.append('etimsRef', form.etimsRef)
    fd.append('companyId', form.companyId)
    fd.append('clientName', form.clientName)
    fd.append('clientEmail', form.clientEmail)
    fd.append('total', form.total)
    fd.append('currency', form.currency)
    if (form.dueDate) fd.append('dueDate', form.dueDate)
    onUpload(fd)
  }

  if (!open) return null

  return (
    <Modal>
      <ModalBox as="form" onSubmit={handleSubmit}>
        <ModalHead>
          <h2>Upload eTIMS Invoice</h2>
          <CloseBtn type="button" onClick={onClose}>
            <X size={16} />
          </CloseBtn>
        </ModalHead>

        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
        >
          <Field>
            <Label>Invoice PDF *</Label>
            <Input
              type="file"
              accept="application/pdf"
              required
              onChange={(e) => set('file', e.target.files[0])}
            />
          </Field>
          <Field>
            <Label>eTIMS Ref Number</Label>
            <Input
              value={form.etimsRef}
              onChange={(e) => set('etimsRef', e.target.value)}
              placeholder="e.g. ETIMS-2024-001"
            />
          </Field>
          <Field>
            <Label>Company (optional)</Label>
            <Select
              value={form.companyId}
              onChange={(e) => set('companyId', e.target.value)}
            >
              <option value="">— Select company —</option>
              {companies.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field>
            <Label>Client Name</Label>
            <Input
              value={form.clientName}
              onChange={(e) => set('clientName', e.target.value)}
            />
          </Field>
          <Field>
            <Label>Client Email</Label>
            <Input
              type="email"
              value={form.clientEmail}
              onChange={(e) => set('clientEmail', e.target.value)}
            />
          </Field>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
            }}
          >
            <Field>
              <Label>Total Amount *</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                required
                value={form.total}
                onChange={(e) => set('total', e.target.value)}
                placeholder="0.00"
              />
            </Field>
            <Field>
              <Label>Currency</Label>
              <Select
                value={form.currency}
                onChange={(e) => set('currency', e.target.value)}
              >
                <option value="KES">KES</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </Select>
            </Field>
          </div>
          <Field>
            <Label>Due Date</Label>
            <Input
              type="date"
              value={form.dueDate}
              onChange={(e) => set('dueDate', e.target.value)}
            />
          </Field>
        </div>

        <ModalActions>
          <SecondaryButton type="button" onClick={onClose}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" disabled={submitting}>
            <Upload size={14} />
            {submitting ? 'Uploading…' : 'Upload Invoice'}
          </PrimaryButton>
        </ModalActions>
      </ModalBox>
    </Modal>
  )
}

/* ── Main page ────────────────────────────────────────────── */

const AdminInvoices = () => {
  const { isReady, get, patch } = useAuthedRequest()
  const {
    invoices,
    loading,
    fetchInvoices,
    createInvoice,
    updateInvoice,
    sendInvoice,
    uploadInvoicePDF,
  } = useAccounts()

  const [companies, setCompanies] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')

  const [showCreate, setShowCreate] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [sendTarget, setSendTarget] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isReady) return
    get('/api/admin/companies')
      .then((d) => setCompanies(d.companies || []))
      .catch(() => {})
  }, [isReady])

  useEffect(() => {
    fetchInvoices({ status: statusFilter })
  }, [statusFilter]) // eslint-disable-line

  const counts = useMemo(() => {
    const c = {
      all: invoices.length,
      draft: 0,
      sent: 0,
      paid: 0,
      overdue: 0,
      cancelled: 0,
    }
    invoices.forEach((inv) => {
      if (c[inv.status] !== undefined) c[inv.status]++
    })
    return c
  }, [invoices])

  const filtered = useMemo(() => {
    if (!search.trim()) return invoices
    const q = search.toLowerCase()
    return invoices.filter(
      (inv) =>
        inv.refNumber?.toLowerCase().includes(q) ||
        inv.clientName?.toLowerCase().includes(q) ||
        inv.subject?.toLowerCase().includes(q),
    )
  }, [invoices, search])

  const handleCreate = async (payload) => {
    setSubmitting(true)
    try {
      await createInvoice(payload)
      setShowCreate(false)
    } catch (err) {
      alert(err.response?.data?.error || err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async (payload) => {
    setSubmitting(true)
    try {
      await updateInvoice(editTarget._id, payload)
      setEditTarget(null)
    } catch (err) {
      alert(err.response?.data?.error || err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSend = async (email) => {
    setSubmitting(true)
    try {
      await sendInvoice(sendTarget._id, email, null)
      setSendTarget(null)
    } catch (err) {
      alert(err.response?.data?.error || err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpload = async (formData) => {
    setSubmitting(true)
    try {
      await uploadInvoicePDF(formData)
      setShowUpload(false)
    } catch (err) {
      alert(err.response?.data?.error || err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const markPaid = async (id) => {
    if (!confirm('Mark this invoice as paid?')) return
    try {
      await updateInvoice(id, {
        status: 'paid',
        paidAt: new Date().toISOString(),
      })
    } catch (err) {
      alert(err.response?.data?.error || err.message)
    }
  }

  const isDueSoon = (inv) => {
    if (!inv.dueDate || inv.status === 'paid') return false
    const days = (new Date(inv.dueDate) - Date.now()) / 86400000
    return days >= 0 && days <= 7
  }

  const isOverdue = (inv) => {
    if (!inv.dueDate || inv.status === 'paid') return false
    return (
      new Date(inv.dueDate) < new Date() &&
      inv.status !== 'paid' &&
      inv.status !== 'cancelled'
    )
  }

  return (
    <PageWrapper>
      <PageHead>
        <PageHeading>
          <span className="icon-wrap">
            <Receipt size={22} />
          </span>
          <div>
            <h1>Invoices</h1>
            <p>Track payments, send invoices, and upload eTIMS documents.</p>
          </div>
        </PageHeading>
        <HeadActions>
          <SecondaryButton
            onClick={() => fetchInvoices({ status: statusFilter })}
          >
            <RefreshCw size={14} />
          </SecondaryButton>
          <SecondaryButton onClick={() => setShowUpload(true)}>
            <Upload size={14} /> Upload eTIMS
          </SecondaryButton>
          <PrimaryButton onClick={() => setShowCreate(true)}>
            <Plus size={14} /> New Invoice
          </PrimaryButton>
        </HeadActions>
      </PageHead>

      <StatsGrid>
        {[
          { key: 'all', label: 'Total' },
          { key: 'draft', label: 'Draft' },
          { key: 'sent', label: 'Sent' },
          { key: 'paid', label: 'Paid' },
          { key: 'overdue', label: 'Overdue' },
        ].map(({ key, label }) => (
          <StatCard
            key={key}
            $active={statusFilter === key}
            onClick={() => setStatusFilter(key)}
          >
            <div className="num">{counts[key] ?? 0}</div>
            <div className="lbl">{label}</div>
          </StatCard>
        ))}
      </StatsGrid>

      <Toolbar>
        <SearchWrap>
          <Search size={15} />
          <SearchInput
            placeholder="Search by ref, client, or subject…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchWrap>
      </Toolbar>

      <TableCard>
        {loading ? (
          <Empty>
            <p>Loading…</p>
          </Empty>
        ) : filtered.length === 0 ? (
          <Empty>
            <Receipt size={36} />
            <h3>No invoices found</h3>
            <p>Create an invoice or upload an eTIMS PDF to get started.</p>
          </Empty>
        ) : (
          <Table>
            <Thead>
              <tr>
                <Th>Ref</Th>
                <Th>Client</Th>
                <Th>Subject</Th>
                <Th>Status</Th>
                <Th $right>Total</Th>
                <Th>Issue Date</Th>
                <Th>Due Date</Th>
                <Th $right>Actions</Th>
              </tr>
            </Thead>
            <tbody>
              {filtered.map((inv) => {
                const status =
                  INVOICE_STATUS[inv.status] || INVOICE_STATUS.draft
                const overdue = isOverdue(inv)
                const dueSoon = isDueSoon(inv)
                return (
                  <Tr key={inv._id}>
                    <Td $mono>
                      {inv.refNumber}
                      {inv.type === 'uploaded' && (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            opacity: 0.5,
                            marginLeft: '0.4rem',
                          }}
                        >
                          (eTIMS)
                        </span>
                      )}
                    </Td>
                    <Td>
                      <div style={{ fontWeight: 500 }}>
                        {inv.clientName || '—'}
                      </div>
                      {inv.companyId?.name && (
                        <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                          {inv.companyId.name}
                        </div>
                      )}
                    </Td>
                    <Td $muted>{inv.subject || '—'}</Td>
                    <Td>
                      <StatusBadge $color={status.color} $tint={status.tint}>
                        {status.label}
                      </StatusBadge>
                    </Td>
                    <Td $right style={{ fontWeight: 600 }}>
                      {fmt(inv.total, inv.currency)}
                    </Td>
                    <Td $muted>{fmtDate(inv.issueDate)}</Td>
                    <Td>
                      <span
                        style={{
                          color: overdue
                            ? '#ef4444'
                            : dueSoon
                              ? '#d97706'
                              : 'inherit',
                          fontWeight: overdue || dueSoon ? 600 : 400,
                          fontSize: '0.85rem',
                        }}
                      >
                        {fmtDate(inv.dueDate)}
                      </span>
                    </Td>
                    <Td $right>
                      <ActionGroup>
                        <SmallBtn onClick={() => setSendTarget(inv)}>
                          <Send size={12} /> Send
                        </SmallBtn>
                        {inv.status !== 'paid' &&
                          inv.status !== 'cancelled' && (
                            <SmallBtn
                              $success
                              onClick={() => markPaid(inv._id)}
                            >
                              <CheckCircle size={12} /> Paid
                            </SmallBtn>
                          )}
                        {inv.type !== 'uploaded' && (
                          <SmallBtn onClick={() => setEditTarget(inv)}>
                            <Pencil size={12} />
                          </SmallBtn>
                        )}
                      </ActionGroup>
                    </Td>
                  </Tr>
                )
              })}
            </tbody>
          </Table>
        )}
      </TableCard>

      <InvoiceFormModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        companies={companies}
        submitting={submitting}
      />

      <InvoiceFormModal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={handleUpdate}
        initial={editTarget}
        companies={companies}
        submitting={submitting}
      />

      <SendModal
        open={!!sendTarget}
        onClose={() => setSendTarget(null)}
        onSend={handleSend}
        defaultEmail={sendTarget?.clientEmail || ''}
        refNumber={sendTarget?.refNumber || ''}
        submitting={submitting}
      />

      <UploadModal
        open={showUpload}
        onClose={() => setShowUpload(false)}
        onUpload={handleUpload}
        companies={companies}
        submitting={submitting}
      />
    </PageWrapper>
  )
}

export default AdminInvoices
