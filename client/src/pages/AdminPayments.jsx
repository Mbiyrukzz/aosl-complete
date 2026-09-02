import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { CheckCircle2, XCircle, HelpCircle, Home } from 'lucide-react'
import { useAdminPayments } from '../hooks/useAdminPayments'
import { buildAdminPaymentPath } from '../constants/routes'

const Wrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
`
const Row = styled.div`
  display: grid;
  grid-template-columns: 90px 90px 1fr 110px 140px 130px;
  gap: 0.75rem;
  align-items: center;
  padding: 0.7rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.85rem;
  &:last-child {
    border-bottom: none;
  }
`
const RowLink = styled(Link)`
  display: contents;
  color: inherit;
  text-decoration: none;
`
const Head = styled(Row)`
  font-weight: 700;
  font-size: 0.72rem;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};
`
const StatusTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 600;
  color: ${({ $status }) =>
    ({
      forwarded: '#10b981',
      local: '#3b82f6',
      failed: '#ef4444',
      unmatched: '#d97706',
    })[$status] || '#6b7280'};
`
const MonoCell = styled.span`
  font-family: ui-monospace, monospace;
  font-size: 0.78rem;
`

const STATUS_ICON = {
  forwarded: CheckCircle2,
  local: Home,
  failed: XCircle,
  unmatched: HelpCircle,
}

const AdminPayments = () => {
  const { payments, loading, refetch } = useAdminPayments()

  useEffect(() => {
    const interval = setInterval(() => refetch({ limit: 50 }), 8000) // poll while testing live
    return () => clearInterval(interval)
  }, [refetch])

  return (
    <Wrapper>
      <h1 style={{ marginBottom: '1.5rem' }}>Payments</h1>
      <Head>
        <span>Site</span>
        <span>Amount</span>
        <span>Account ref</span>
        <span>Status</span>
        <span>M-Pesa code</span>
        <span>Received</span>
      </Head>
      {!loading &&
        payments.map((p) => {
          const Icon = STATUS_ICON[p.forwardStatus] || HelpCircle
          return (
            <RowLink key={p._id} to={buildAdminPaymentPath(p._id)}>
              <Row>
                <span>{p.site || '—'}</span>
                <span>KES {p.amount}</span>
                <span>{p.billRefNumber}</span>
                <StatusTag $status={p.forwardStatus}>
                  <Icon size={13} /> {p.forwardStatus}
                </StatusTag>
                <MonoCell>{p.transId}</MonoCell>
                <span>
                  {new Date(
                    p.transactionDate || p.createdAt,
                  ).toLocaleTimeString()}
                </span>
              </Row>
            </RowLink>
          )
        })}
      {loading && <Row style={{ gridTemplateColumns: '1fr' }}>Loading…</Row>}
      {!loading && payments.length === 0 && (
        <Row style={{ gridTemplateColumns: '1fr', color: 'var(--muted)' }}>
          No payments yet.
        </Row>
      )}
    </Wrapper>
  )
}

export default AdminPayments
