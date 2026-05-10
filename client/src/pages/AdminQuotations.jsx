import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  FileText,
  Plus,
  Search,
  Send,
  Pencil,
  Trash2,
  ArrowRight,
  RefreshCw,
} from 'lucide-react'
import { useAccounts } from '../hooks/useAccounts'
import { useAuthedRequest } from '../hooks/useAuthedRequest'
import {
  PageWrapper,
  PageHead,
  PageHeading,
  HeadActions,
  PrimaryButton,
  SecondaryButton,
  StatusBadge,
  QUOTATION_STATUS,
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
  fmtDate,
  fmt,
} from '../components/AccountsShared'

import { SendModal } from '../components/SendModal'
import { ConvertModal } from '../components/ConvertModal'
import { QuotationFormModal } from '../components/QuotationFormModal'

const ActionGroup = styled.div`
  display: flex;
  gap: 0.4rem;
  justify-content: flex-end;
`

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

  ${({ $danger }) =>
    $danger &&
    `color: #ef4444;
    &:hover { border-color: #ef4444; background: rgba(239,68,68,0.06); }`}

  ${({ $primary, theme }) =>
    $primary &&
    `background: ${theme.colors?.text || '#1a1a1a'};
     color: ${theme.colors?.background || '#fff'};
     border-color: transparent;
     &:hover { opacity: 0.85; background: ${theme.colors?.text || '#1a1a1a'}; }`}
`

const AdminQuotations = () => {
  const { isReady, get } = useAuthedRequest()
  const {
    quotations,
    loading,
    fetchQuotations,
    createQuotation,
    updateQuotation,
    deleteQuotation,
    sendQuotation,
    convertQuotation,
  } = useAccounts()

  const [companies, setCompanies] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')

  const [showCreate, setShowCreate] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [sendTarget, setSendTarget] = useState(null)
  const [convertTarget, setConvertTarget] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Fetch companies for dropdowns
  useEffect(() => {
    if (!isReady) return
    get('/api/admin/companies')
      .then((d) => setCompanies(d.companies || []))
      .catch(() => {})
  }, [isReady])

  // Refetch on filter change
  useEffect(() => {
    fetchQuotations({ status: statusFilter })
  }, [statusFilter]) // eslint-disable-line

  const counts = useMemo(() => {
    const c = {
      all: quotations.length,
      draft: 0,
      sent: 0,
      accepted: 0,
      declined: 0,
      converted: 0,
    }
    quotations.forEach((q) => {
      if (c[q.status] !== undefined) c[q.status]++
    })
    return c
  }, [quotations])

  const filtered = useMemo(() => {
    if (!search.trim()) return quotations
    const q = search.toLowerCase()
    return quotations.filter(
      (doc) =>
        doc.refNumber?.toLowerCase().includes(q) ||
        doc.clientName?.toLowerCase().includes(q) ||
        doc.subject?.toLowerCase().includes(q),
    )
  }, [quotations, search])

  const handleCreate = async (payload) => {
    setSubmitting(true)
    try {
      await createQuotation(payload)
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
      await updateQuotation(editTarget._id, payload)
      setEditTarget(null)
    } catch (err) {
      alert(err.response?.data?.error || err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this quotation?')) return
    try {
      await deleteQuotation(id)
    } catch (err) {
      alert(err.response?.data?.error || err.message)
    }
  }

  const handleSend = async (email) => {
    setSubmitting(true)
    try {
      await sendQuotation(sendTarget._id, email, null)
      setSendTarget(null)
    } catch (err) {
      alert(err.response?.data?.error || err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleConvert = async (dueDate) => {
    setSubmitting(true)
    try {
      await convertQuotation(convertTarget._id, dueDate)
      setConvertTarget(null)
    } catch (err) {
      alert(err.response?.data?.error || err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageWrapper>
      <PageHead>
        <PageHeading>
          <span className="icon-wrap">
            <FileText size={22} />
          </span>
          <div>
            <h1>Quotations</h1>
            <p>Create, track, and convert quotations into invoices.</p>
          </div>
        </PageHeading>
        <HeadActions>
          <SecondaryButton
            onClick={() => fetchQuotations({ status: statusFilter })}
          >
            <RefreshCw size={14} />
          </SecondaryButton>
          <PrimaryButton onClick={() => setShowCreate(true)}>
            <Plus size={14} />
            New Quotation
          </PrimaryButton>
        </HeadActions>
      </PageHead>

      <StatsGrid>
        {['all', 'draft', 'sent', 'accepted', 'declined', 'converted'].map(
          (s) => (
            <StatCard
              key={s}
              $active={statusFilter === s}
              onClick={() => setStatusFilter(s)}
            >
              <div className="num">{counts[s] ?? 0}</div>
              <div className="lbl">
                {s === 'all' ? 'Total' : s.charAt(0).toUpperCase() + s.slice(1)}
              </div>
            </StatCard>
          ),
        )}
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
            <FileText size={36} />
            <h3>No quotations found</h3>
            <p>Create your first quotation to get started.</p>
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
                <Th>Valid Until</Th>
                <Th $right>Actions</Th>
              </tr>
            </Thead>
            <tbody>
              {filtered.map((q) => {
                const status =
                  QUOTATION_STATUS[q.status] || QUOTATION_STATUS.draft
                return (
                  <Tr key={q._id}>
                    <Td $mono>{q.refNumber}</Td>
                    <Td>
                      <div style={{ fontWeight: 500 }}>
                        {q.clientName || '—'}
                      </div>
                      {q.companyId?.name && (
                        <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                          {q.companyId.name}
                        </div>
                      )}
                    </Td>
                    <Td $muted>{q.subject || '—'}</Td>
                    <Td>
                      <StatusBadge $color={status.color} $tint={status.tint}>
                        {status.label}
                      </StatusBadge>
                    </Td>
                    <Td $right style={{ fontWeight: 600 }}>
                      {fmt(q.total, q.currency)}
                    </Td>
                    <Td $muted>{fmtDate(q.issueDate)}</Td>
                    <Td $muted>{fmtDate(q.validUntil)}</Td>
                    <Td $right>
                      <ActionGroup>
                        {q.status !== 'converted' && (
                          <>
                            <SmallBtn onClick={() => setSendTarget(q)}>
                              <Send size={12} /> Send
                            </SmallBtn>
                            <SmallBtn
                              $primary
                              onClick={() => setConvertTarget(q)}
                            >
                              <ArrowRight size={12} /> Invoice
                            </SmallBtn>
                            <SmallBtn onClick={() => setEditTarget(q)}>
                              <Pencil size={12} />
                            </SmallBtn>
                            <SmallBtn
                              $danger
                              onClick={() => handleDelete(q._id)}
                            >
                              <Trash2 size={12} />
                            </SmallBtn>
                          </>
                        )}
                        {q.status === 'converted' && (
                          <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>
                            Converted
                          </span>
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

      <QuotationFormModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        companies={companies}
        submitting={submitting}
      />

      <QuotationFormModal
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

      <ConvertModal
        open={!!convertTarget}
        onClose={() => setConvertTarget(null)}
        onConvert={handleConvert}
        quotation={convertTarget}
        submitting={submitting}
      />
    </PageWrapper>
  )
}

export default AdminQuotations
