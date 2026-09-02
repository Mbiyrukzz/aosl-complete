import { useEffect, useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Home,
} from 'lucide-react'
import { useAdminPayments } from '../hooks/useAdminPayments'
import { ROUTES } from '../constants/routes'

const Wrapper = styled.div`
  max-width: 640px;
  margin: 0 auto;
  padding: 2rem;
`
const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: ${({ theme }) => theme.colors.muted};
  text-decoration: none;
  font-size: 0.88rem;
  margin-bottom: 1.25rem;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`
const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  padding: 1.5rem;
`
const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.6rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.88rem;
  &:last-child {
    border-bottom: none;
  }
  .label {
    color: ${({ theme }) => theme.colors.muted};
  }
  .value {
    font-weight: 600;
    text-align: right;
    word-break: break-all;
  }
`
const StatusTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 700;
  color: ${({ $status }) =>
    ({
      forwarded: '#10b981',
      local: '#3b82f6',
      failed: '#ef4444',
      unmatched: '#d97706',
    })[$status] || '#6b7280'};
`
const RawPayload = styled.pre`
  margin-top: 1rem;
  padding: 0.85rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.75rem;
  overflow-x: auto;
`

const STATUS_ICON = {
  forwarded: CheckCircle2,
  local: Home,
  failed: XCircle,
  unmatched: HelpCircle,
}

const PaymentDetailPage = () => {
  const { id } = useParams()
  const { getPaymentDetail } = useAdminPayments()
  const [payment, setPayment] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    getPaymentDetail(id)
      .then(setPayment)
      .catch(() => setNotFound(true))
  }, [id, getPaymentDetail])

  if (notFound) return <Navigate to={ROUTES.ADMIN_PAYMENTS} replace />
  if (!payment) return null

  const Icon = STATUS_ICON[payment.forwardStatus] || HelpCircle

  return (
    <Wrapper>
      <BackLink to={ROUTES.ADMIN_PAYMENTS}>
        <ArrowLeft size={15} /> All payments
      </BackLink>
      <Card>
        <h2 style={{ marginTop: 0 }}>KES {payment.amount}</h2>

        <InfoRow>
          <span className="label">Site</span>
          <span className="value">{payment.site || '—'}</span>
        </InfoRow>
        <InfoRow>
          <span className="label">Status</span>
          <StatusTag $status={payment.forwardStatus}>
            <Icon size={14} /> {payment.forwardStatus}
          </StatusTag>
        </InfoRow>
        <InfoRow>
          <span className="label">Account ref</span>
          <span className="value">{payment.billRefNumber}</span>
        </InfoRow>
        <InfoRow>
          <span className="label">M-Pesa code</span>
          <span
            className="value"
            style={{ fontFamily: 'ui-monospace, monospace' }}
          >
            {payment.transId}
          </span>
        </InfoRow>
        <InfoRow>
          <span className="label">MSISDN</span>
          <span className="value">{payment.msisdn}</span>
        </InfoRow>
        <InfoRow>
          <span className="label">Name</span>
          <span className="value">{payment.firstName}</span>
        </InfoRow>
        <InfoRow>
          <span className="label">Forwarded to</span>
          <span className="value">{payment.forwardedTo || '—'}</span>
        </InfoRow>
        <InfoRow>
          <span className="label">Transaction time (M-Pesa)</span>
          <span className="value">
            {payment.transactionDate
              ? new Date(payment.transactionDate).toLocaleString()
              : payment.transTime || '—'}
          </span>
        </InfoRow>
        <InfoRow>
          <span className="label">Received (server)</span>
          <span className="value">
            {new Date(payment.createdAt).toLocaleString()}
          </span>
        </InfoRow>

        <RawPayload>{JSON.stringify(payment.rawPayload, null, 2)}</RawPayload>
      </Card>
    </Wrapper>
  )
}

export default PaymentDetailPage
