import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import {
  ArrowLeft,
  Package as PackageIcon,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Globe,
  Server,
  Wrench,
  Repeat as RepeatIcon,
  KeyRound,
  Headphones,
  Box,
  Mail,
  MessageSquare,
  Bell,
  Building2,
  CreditCard,
  Clock,
  RefreshCw,
  ChevronRight,
} from 'lucide-react'

import { useAuthedRequest } from '../hooks/useAuthedRequest'
import { FullScreenLoader } from '../components/Loader'

/* ───────────────── Styled ───────────────── */

const Wrapper = styled.div`
  max-width: 1050px;
  margin: 0 auto;
  padding: 2rem;
`

const BackBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.muted};
  cursor: pointer;
  font-family: inherit;
  padding: 0;
  margin-bottom: 1.5rem;
  font-size: 0.85rem;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const IconBox = styled.div`
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ $tint }) => $tint};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
`

const HeaderInfo = styled.div`
  h1 {
    margin: 0 0 0.35rem 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.6rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.9rem;
  }
`

const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${({ $tint }) => $tint};
  color: ${({ $color }) => $color};
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 330px;
  gap: 1.2rem;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.35rem;
  margin-bottom: 1.2rem;
`

const CardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 1rem;
`

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`

const InfoItem = styled.div`
  .label {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.76rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.3rem;
    font-weight: 700;
  }

  .value {
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.95rem;
    font-weight: 500;
  }
`

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.7;
  font-size: 0.92rem;
`

const ChannelList = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`

const ChannelChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  background: ${({ $active, theme }) =>
    $active ? 'rgba(59,130,246,0.12)' : theme.colors.border};
  color: ${({ $active, theme }) => ($active ? '#3b82f6' : theme.colors.muted)};
`

const ProgressTrack = styled.div`
  height: 7px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  overflow: hidden;
  margin-top: 0.7rem;
`

const ProgressFill = styled.div`
  width: ${({ $width }) => $width}%;
  height: 100%;
  background: ${({ $color }) => $color};
`

const ReminderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`

const ReminderRow = styled.div`
  padding: 0.75rem 0.9rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;

  .left {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .title {
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.88rem;
    font-weight: 600;
  }

  .date {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.75rem;
  }
`

const Badge = styled.span`
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  background: ${({ $sent }) =>
    $sent ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)'};
  color: ${({ $sent }) => ($sent ? '#10b981' : '#f59e0b')};
`

const CompanyCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 0.9rem 1rem;
`

/* ───────────────── Config ───────────────── */

const TYPE_CONFIG = {
  hosting: {
    icon: Server,
    color: '#10b981',
    tint: 'rgba(16,185,129,0.12)',
    label: 'Hosting',
  },
  domain: {
    icon: Globe,
    color: '#ef4444',
    tint: 'rgba(239,68,68,0.12)',
    label: 'Domain',
  },
  maintenance: {
    icon: Wrench,
    color: '#f59e0b',
    tint: 'rgba(245,158,11,0.12)',
    label: 'Maintenance',
  },
  subscription: {
    icon: RepeatIcon,
    color: '#6366f1',
    tint: 'rgba(99,102,241,0.12)',
    label: 'Subscription',
  },
  license: {
    icon: KeyRound,
    color: '#8b5cf6',
    tint: 'rgba(139,92,246,0.12)',
    label: 'License',
  },
  support_plan: {
    icon: Headphones,
    color: '#06b6d4',
    tint: 'rgba(6,182,212,0.12)',
    label: 'Support plan',
  },
  other: {
    icon: Box,
    color: '#6b7280',
    tint: 'rgba(107,114,128,0.15)',
    label: 'Other',
  },
}

const STATUS_CONFIG = {
  active: {
    icon: CheckCircle2,
    color: '#10b981',
    tint: 'rgba(16,185,129,0.12)',
    label: 'Active',
  },
  expiring_soon: {
    icon: AlertTriangle,
    color: '#f59e0b',
    tint: 'rgba(245,158,11,0.12)',
    label: 'Expiring soon',
  },
  expired: {
    icon: XCircle,
    color: '#ef4444',
    tint: 'rgba(239,68,68,0.12)',
    label: 'Expired',
  },
}

const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

const daysUntil = (date) => Math.ceil((new Date(date) - new Date()) / 86400000)

const formatCurrency = (amount, currency) =>
  new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
  }).format(amount)

/* ───────────────── Component ───────────────── */

const MyPackageDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { get } = useAuthedRequest()

  const [pkg, setPkg] = useState(null)
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      setLoading(true)

      const pkgRes = await get(`/api/me/packages/${id}`)
      setPkg(pkgRes.package)

      try {
        const remRes = await get(`/api/me/packages/${id}/reminders`)
        setReminders(remRes.reminders || [])
      } catch {
        setReminders([])
      }
    } catch (err) {
      console.error(err)
      setPkg(null)
    } finally {
      setLoading(false)
    }
  }, [id, get])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return <FullScreenLoader label="Loading package..." />
  }

  if (!pkg) {
    return (
      <Wrapper>
        <p>Package not found.</p>
      </Wrapper>
    )
  }

  const typeCfg = TYPE_CONFIG[pkg.type] || TYPE_CONFIG.other
  const statusCfg = STATUS_CONFIG[pkg.status] || STATUS_CONFIG.active

  const TypeIcon = typeCfg.icon
  const StatusIcon = statusCfg.icon

  const days = daysUntil(pkg.expiryDate)

  const totalDays = Math.ceil(
    (new Date(pkg.expiryDate) - new Date(pkg.startDate)) / 86400000,
  )

  const elapsed = totalDays - days
  const progress = Math.min(100, Math.max(0, (elapsed / totalDays) * 100))

  return (
    <Wrapper>
      <BackBtn onClick={() => navigate(-1)}>
        <ArrowLeft size={14} />
        Back to packages
      </BackBtn>

      <Header>
        <HeaderLeft>
          <IconBox $color={typeCfg.color} $tint={typeCfg.tint}>
            <TypeIcon size={25} />
          </IconBox>

          <HeaderInfo>
            <h1>
              {pkg.name}

              <StatusPill $color={statusCfg.color} $tint={statusCfg.tint}>
                <StatusIcon size={11} />
                {statusCfg.label}
              </StatusPill>
            </h1>

            <p>
              {typeCfg.label} · {pkg.companyId?.name || 'Your company'}
            </p>
          </HeaderInfo>
        </HeaderLeft>
      </Header>

      <Grid>
        <div>
          <Card>
            <CardTitle>
              <Clock size={14} />
              Subscription timeline
            </CardTitle>

            <InfoGrid>
              <InfoItem>
                <div className="label">Start date</div>
                <div className="value">
                  {pkg.startDate ? formatDate(pkg.startDate) : '—'}
                </div>
              </InfoItem>

              <InfoItem>
                <div className="label">Expiry date</div>
                <div className="value">{formatDate(pkg.expiryDate)}</div>
              </InfoItem>
            </InfoGrid>

            <ProgressTrack>
              <ProgressFill $width={progress} $color={statusCfg.color} />
            </ProgressTrack>

            <div
              style={{
                marginTop: '0.75rem',
                color: statusCfg.color,
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              {days >= 0
                ? `${days} days remaining`
                : `${Math.abs(days)} days overdue`}
            </div>

            {pkg.autoRenew && (
              <div
                style={{
                  marginTop: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: '#10b981',
                  fontSize: '0.83rem',
                }}
              >
                <RefreshCw size={13} />
                Auto-renew enabled
              </div>
            )}
          </Card>

          <Card>
            <CardTitle>
              <CreditCard size={14} />
              Billing
            </CardTitle>

            <InfoGrid>
              <InfoItem>
                <div className="label">Amount</div>
                <div
                  className="value"
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                  }}
                >
                  {pkg.price?.amount != null
                    ? formatCurrency(
                        pkg.price.amount,
                        pkg.price.currency || 'KES',
                      )
                    : '—'}
                </div>
              </InfoItem>

              <InfoItem>
                <div className="label">Billing cycle</div>
                <div className="value" style={{ textTransform: 'capitalize' }}>
                  {pkg.price?.billingCycle || '—'}
                </div>
              </InfoItem>
            </InfoGrid>
          </Card>

          {pkg.description && (
            <Card>
              <CardTitle>
                <PackageIcon size={14} />
                Description
              </CardTitle>

              <Description>{pkg.description}</Description>
            </Card>
          )}

          <Card>
            <CardTitle>
              <Bell size={14} />
              Reminder channels
            </CardTitle>

            <ChannelList>
              <ChannelChip $active={pkg.reminderChannels?.email}>
                <Mail size={12} />
                Email
              </ChannelChip>

              <ChannelChip $active={pkg.reminderChannels?.whatsapp}>
                <MessageSquare size={12} />
                WhatsApp
              </ChannelChip>

              <ChannelChip $active={pkg.reminderChannels?.inApp}>
                <Bell size={12} />
                In-app
              </ChannelChip>
            </ChannelList>
          </Card>
        </div>

        <div>
          <Card>
            <CardTitle>
              <Building2 size={14} />
              Company
            </CardTitle>

            <CompanyCard>
              <div>
                <div
                  style={{
                    color: 'var(--text)',
                    fontWeight: 700,
                    marginBottom: '0.2rem',
                  }}
                >
                  {pkg.companyId?.name || 'Company'}
                </div>

                <div
                  style={{
                    color: 'var(--muted)',
                    fontSize: '0.78rem',
                  }}
                >
                  {pkg.companyId?.industry || 'Client account'}
                </div>
              </div>

              <ChevronRight size={16} />
            </CompanyCard>
          </Card>

          <Card>
            <CardTitle>
              <Bell size={14} />
              Scheduled reminders
            </CardTitle>

            {reminders.length > 0 ? (
              <ReminderList>
                {reminders.map((r) => (
                  <ReminderRow key={r._id}>
                    <div className="left">
                      <div className="title">{r.daysBefore}d before expiry</div>

                      <div className="date">
                        {r.scheduledFor ? formatDate(r.scheduledFor) : '—'}
                      </div>
                    </div>

                    <Badge $sent={r.sent}>{r.sent ? 'Sent' : 'Pending'}</Badge>
                  </ReminderRow>
                ))}
              </ReminderList>
            ) : (
              <div
                style={{
                  color: '#94a3b8',
                  fontSize: '0.85rem',
                }}
              >
                No reminders scheduled.
              </div>
            )}
          </Card>
        </div>
      </Grid>
    </Wrapper>
  )
}

export default MyPackageDetailPage
