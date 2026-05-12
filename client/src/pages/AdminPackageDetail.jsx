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
  Edit2,
  Trash2,
  Building2,
  CreditCard,
  Clock,
  RefreshCw,
  StickyNote,
  ChevronRight,
  Activity,
} from 'lucide-react'
import Modal from '../components/Modal'
import { usePackages } from '../hooks/usePackages'
import { useAuthedRequest } from '../hooks/useAuthedRequest'
import { FullScreenLoader } from '../components/Loader'
import { useCompanies } from '../hooks/useCompanies'

/* ── Styled Components ── */

const Wrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
`

const BackBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.85rem;
  font-family: inherit;
  cursor: pointer;
  padding: 0;
  margin-bottom: 1.5rem;
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`

const PageHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`

const HeadLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const TypeIconBox = styled.div`
  width: 52px;
  height: 52px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ $tint }) => $tint};
  color: ${({ $color }) => $color};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

const HeadInfo = styled.div`
  h1 {
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 0.3rem 0;
    font-size: 1.55rem;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;
  }

  p {
    color: ${({ theme }) => theme.colors.muted};
    margin: 0;
    font-size: 0.88rem;
  }
`

const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${({ $tint }) => $tint};
  color: ${({ $color }) => $color};
`

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.1rem;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  font-family: inherit;
  transition: transform 0.15s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const DangerButton = styled(PrimaryButton)`
  background: #ef4444;
  color: #fff;
`

const SecondaryButton = styled.button`
  padding: 0.65rem 1.1rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 500;
  font-size: 0.88rem;
  cursor: pointer;
  font-family: inherit;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 1.25rem;
  align-items: start;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.4rem;
  margin-bottom: 1.25rem;
`

const CardTitle = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }
`

const InfoItem = styled.div`
  .label {
    font-size: 0.76rem;
    color: ${({ theme }) => theme.colors.muted};
    margin-bottom: 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
  }
  .value {
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.95rem;
    font-weight: 500;
  }
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 1.1rem 0;
`

const ExpiryBar = styled.div`
  margin-top: 0.6rem;
`

const BarTrack = styled.div`
  height: 6px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  overflow: hidden;
  margin-top: 0.5rem;
`

const BarFill = styled.div`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $color }) => $color};
  border-radius: 999px;
  transition: width 0.4s ease;
`

const ChannelList = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`

const ChannelChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  background: ${({ $on, theme }) =>
    $on ? 'rgba(59,130,246,0.12)' : theme.colors.border};
  color: ${({ $on, theme }) => ($on ? '#3b82f6' : theme.colors.muted)};
  border: 1px solid
    ${({ $on }) => ($on ? 'rgba(59,130,246,0.25)' : 'transparent')};
`

const ReminderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`

const ReminderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.85rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.85rem;

  .day {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
  }
  .date {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.78rem;
  }
`

const ReminderBadge = styled.span`
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: ${({ $sent }) =>
    $sent ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)'};
  color: ${({ $sent }) => ($sent ? '#10b981' : '#f59e0b')};
`

const CompanyLink = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 0.9rem 1rem;
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  .left {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    text-align: left;
  }

  .name {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    font-size: 0.92rem;
  }

  .tier {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.78rem;
    margin-top: 0.1rem;
  }
`

const TierTag = styled.span`
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${({ $tier }) =>
    ({
      platinum: 'rgba(99,102,241,0.15)',
      gold: 'rgba(217,119,6,0.15)',
      silver: 'rgba(148,163,184,0.15)',
    })[$tier] || 'rgba(107,114,128,0.15)'};
  color: ${({ $tier }) =>
    ({
      platinum: '#6366f1',
      gold: '#d97706',
      silver: '#94a3b8',
    })[$tier] || '#6b7280'};
`

const NotesBox = styled.div`
  padding: 0.85rem 1rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.88rem;
  line-height: 1.6;
  white-space: pre-wrap;
`

const Empty = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.85rem;
  font-style: italic;
`

const DescriptionText = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.92rem;
  line-height: 1.65;
  margin: 0;
`

/* ── Form (reused from AdminPackages) ── */

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`
const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }
`
const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`
const Label = styled.label`
  font-size: 0.82rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`
const Input = styled.input`
  padding: 0.7rem 0.95rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 0.92rem;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`
const Select = styled.select`
  padding: 0.7rem 0.95rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 0.92rem;
  cursor: pointer;
`
const Textarea = styled.textarea`
  padding: 0.7rem 0.95rem;
  min-height: 80px;
  resize: vertical;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 0.92rem;
  line-height: 1.5;
`
const ChannelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }
`
const ChannelCard = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 0.85rem;
  background: ${({ $on, theme }) =>
    $on ? theme.colors.background : theme.colors.surface};
  border: 1px solid
    ${({ $on, theme }) => ($on ? theme.colors.primary : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text};
  user-select: none;
  input {
    display: none;
  }
  svg {
    color: ${({ $on, theme }) =>
      $on ? theme.colors.primary : theme.colors.muted};
  }
`
const ReminderHint = styled.div`
  padding: 0.85rem 1rem;
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: ${({ theme }) => theme.radii.md};
  color: #3b82f6;
  font-size: 0.85rem;
  line-height: 1.5;
  display: flex;
  gap: 0.55rem;
  svg {
    flex-shrink: 0;
    margin-top: 1px;
  }
`
const FormActions = styled.div`
  display: flex;
  gap: 0.6rem;
  justify-content: flex-end;
`

/* ── Constants ── */

const TYPE_CONFIG = {
  hosting: {
    color: '#10b981',
    tint: 'rgba(16,185,129,0.12)',
    icon: Server,
    label: 'Hosting',
  },
  domain: {
    color: '#ef4444',
    tint: 'rgba(239,68,68,0.12)',
    icon: Globe,
    label: 'Domain',
  },
  maintenance: {
    color: '#f59e0b',
    tint: 'rgba(245,158,11,0.12)',
    icon: Wrench,
    label: 'Maintenance',
  },
  subscription: {
    color: '#6366f1',
    tint: 'rgba(99,102,241,0.12)',
    icon: RepeatIcon,
    label: 'Subscription',
  },
  license: {
    color: '#8b5cf6',
    tint: 'rgba(139,92,246,0.12)',
    icon: KeyRound,
    label: 'License',
  },
  support_plan: {
    color: '#06b6d4',
    tint: 'rgba(6,182,212,0.12)',
    icon: Headphones,
    label: 'Support plan',
  },
  other: {
    color: '#6b7280',
    tint: 'rgba(107,114,128,0.15)',
    icon: Box,
    label: 'Other',
  },
}

const STATUS_CONFIG = {
  active: {
    color: '#10b981',
    tint: 'rgba(16,185,129,0.12)',
    label: 'Active',
    icon: CheckCircle2,
  },
  expiring_soon: {
    color: '#f59e0b',
    tint: 'rgba(245,158,11,0.12)',
    label: 'Expiring soon',
    icon: AlertTriangle,
  },
  expired: {
    color: '#ef4444',
    tint: 'rgba(239,68,68,0.12)',
    label: 'Expired',
    icon: XCircle,
  },
  cancelled: {
    color: '#6b7280',
    tint: 'rgba(107,114,128,0.15)',
    label: 'Cancelled',
    icon: XCircle,
  },
}

const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

const daysUntil = (date) => Math.ceil((new Date(date) - new Date()) / 86400000)

const toDateInputValue = (date) =>
  date ? new Date(date).toISOString().slice(0, 10) : ''

const formatCurrency = (amount, currency) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(
    amount,
  )

/* ── Component ── */

const AdminPackageDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { get } = useAuthedRequest()
  const { updatePackage, deletePackage } = usePackages()
  const { companies } = useCompanies?.() ?? { companies: [] }

  const [pkg, setPkg] = useState(null)
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [pkgData, remData] = await Promise.all([
        get(`/api/admin/packages/${id}`),
        get(`/api/admin/packages/${id}/reminders`).catch(() => ({
          reminders: [],
        })),
      ])
      setPkg(pkgData.package)
      setReminders(remData.reminders || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [id, get])

  useEffect(() => {
    load()
  }, [load])

  const openEdit = () => {
    setForm({
      companyId: pkg.companyId?._id || pkg.companyId,
      name: pkg.name,
      description: pkg.description || '',
      type: pkg.type,
      price: pkg.price || {
        amount: 0,
        currency: 'KES',
        billingCycle: 'yearly',
      },
      startDate: toDateInputValue(pkg.startDate),
      expiryDate: toDateInputValue(pkg.expiryDate),
      autoRenew: pkg.autoRenew,
      reminderDaysBefore: (pkg.reminderDaysBefore || []).join(', '),
      reminderChannels: pkg.reminderChannels || {
        email: true,
        whatsapp: false,
        inApp: true,
      },
      notes: pkg.notes || '',
    })
    setEditOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const reminderDaysBefore = form.reminderDaysBefore
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n) && n > 0)
        .sort((a, b) => b - a)

      const payload = {
        ...form,
        reminderDaysBefore,
        startDate: form.startDate
          ? new Date(form.startDate).toISOString()
          : undefined,
        expiryDate: new Date(form.expiryDate).toISOString(),
      }
      const updated = await updatePackage(id, payload)
      setPkg(updated)
      setEditOpen(false)
      load()
    } catch (err) {
      alert('Failed to save: ' + (err.response?.data?.error || err.message))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this package? Scheduled reminders will be cancelled.'))
      return
    try {
      await deletePackage(id)
      navigate(-1)
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.error || err.message))
    }
  }

  const updateField = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value })
  const toggleChannel = (ch) => () =>
    setForm({
      ...form,
      reminderChannels: {
        ...form.reminderChannels,
        [ch]: !form.reminderChannels[ch],
      },
    })

  if (loading) return <FullScreenLoader label="Loading package..." />
  if (!pkg)
    return (
      <Wrapper>
        <p>Package not found.</p>
      </Wrapper>
    )

  const typeCfg = TYPE_CONFIG[pkg.type] || TYPE_CONFIG.other
  const statusCfg = STATUS_CONFIG[pkg.status] || STATUS_CONFIG.active
  const TypeIcon = typeCfg.icon
  const StatusIcon = statusCfg.icon
  const days = daysUntil(pkg.expiryDate)
  const totalDays = Math.ceil(
    (new Date(pkg.expiryDate) - new Date(pkg.startDate)) / 86400000,
  )
  const elapsed = totalDays - days
  const pct = Math.min(100, Math.max(0, (elapsed / totalDays) * 100))
  const reminderCount = form
    ? form.reminderDaysBefore
        .split(',')
        .map((s) => parseInt(s.trim()))
        .filter((n) => !isNaN(n) && n > 0).length
    : 0

  return (
    <Wrapper>
      <BackBtn onClick={() => navigate(-1)}>
        <ArrowLeft size={14} /> Back to packages
      </BackBtn>

      <PageHead>
        <HeadLeft>
          <TypeIconBox $tint={typeCfg.tint} $color={typeCfg.color}>
            <TypeIcon size={24} />
          </TypeIconBox>
          <HeadInfo>
            <h1>
              {pkg.name}
              <StatusPill $tint={statusCfg.tint} $color={statusCfg.color}>
                <StatusIcon size={11} /> {statusCfg.label}
              </StatusPill>
            </h1>
            <p>
              {typeCfg.label} · {pkg.companyId?.name || 'Unknown company'}
            </p>
          </HeadInfo>
        </HeadLeft>
        <Actions>
          <SecondaryButton onClick={openEdit}>
            <Edit2 size={14} style={{ marginRight: 4 }} />
            Edit
          </SecondaryButton>
          <DangerButton onClick={handleDelete}>
            <Trash2 size={14} style={{ marginRight: 4 }} />
            Delete
          </DangerButton>
        </Actions>
      </PageHead>

      <Grid>
        {/* ── Left column ── */}
        <div>
          {/* Expiry progress */}
          <Card>
            <CardTitle>
              <Clock size={14} /> Timeline
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
            <ExpiryBar>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.78rem',
                  marginBottom: '0.3rem',
                }}
              >
                <span style={{ color: 'var(--color-muted, #94a3b8)' }}>
                  Progress
                </span>
                <span style={{ color: statusCfg.color, fontWeight: 600 }}>
                  {days >= 0
                    ? `${days} days remaining`
                    : `${Math.abs(days)} days overdue`}
                </span>
              </div>
              <BarTrack>
                <BarFill $pct={pct} $color={statusCfg.color} />
              </BarTrack>
            </ExpiryBar>
            {pkg.autoRenew && (
              <div
                style={{
                  marginTop: '0.85rem',
                  fontSize: '0.82rem',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <RefreshCw size={13} /> Auto-renew enabled
              </div>
            )}
          </Card>

          {/* Pricing */}
          <Card>
            <CardTitle>
              <CreditCard size={14} /> Pricing
            </CardTitle>
            <InfoGrid>
              <InfoItem>
                <div className="label">Amount</div>
                <div
                  className="value"
                  style={{ fontSize: '1.2rem', fontWeight: 700 }}
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

          {/* Description */}
          {pkg.description && (
            <Card>
              <CardTitle>
                <PackageIcon size={14} /> Description
              </CardTitle>
              <DescriptionText>{pkg.description}</DescriptionText>
            </Card>
          )}

          {/* Reminders schedule */}
          <Card>
            <CardTitle>
              <Bell size={14} /> Reminders
            </CardTitle>
            <div style={{ marginBottom: '0.85rem' }}>
              <div
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--color-muted, #94a3b8)',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: 600,
                }}
              >
                Channels
              </div>
              <ChannelList>
                <ChannelChip $on={pkg.reminderChannels?.email}>
                  <Mail size={12} /> Email
                </ChannelChip>
                <ChannelChip $on={pkg.reminderChannels?.whatsapp}>
                  <MessageSquare size={12} /> WhatsApp
                </ChannelChip>
                <ChannelChip $on={pkg.reminderChannels?.inApp}>
                  <Bell size={12} /> In-app
                </ChannelChip>
              </ChannelList>
            </div>
            <Divider />
            <div
              style={{
                fontSize: '0.78rem',
                color: 'var(--color-muted, #94a3b8)',
                marginBottom: '0.6rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 600,
              }}
            >
              Scheduled
            </div>
            {reminders.length > 0 ? (
              <ReminderList>
                {reminders.map((r, i) => (
                  <ReminderRow key={r._id || i}>
                    <div>
                      <div className="day">{r.daysBefore}d before</div>
                      <div className="date">
                        {r.scheduledFor ? formatDate(r.scheduledFor) : '—'}
                      </div>
                    </div>
                    <ReminderBadge $sent={r.sent}>
                      {r.sent ? 'Sent' : 'Pending'}
                    </ReminderBadge>
                  </ReminderRow>
                ))}
              </ReminderList>
            ) : pkg.reminderDaysBefore?.length > 0 ? (
              <ReminderList>
                {pkg.reminderDaysBefore.map((d) => {
                  const reminderDate = new Date(pkg.expiryDate)
                  reminderDate.setDate(reminderDate.getDate() - d)
                  return (
                    <ReminderRow key={d}>
                      <div>
                        <div className="day">{d}d before</div>
                        <div className="date">{formatDate(reminderDate)}</div>
                      </div>
                      <ReminderBadge $sent={false}>Pending</ReminderBadge>
                    </ReminderRow>
                  )
                })}
              </ReminderList>
            ) : (
              <Empty>No reminders scheduled.</Empty>
            )}
          </Card>

          {/* Admin notes */}
          {pkg.notes && (
            <Card>
              <CardTitle>
                <StickyNote size={14} /> Admin notes
              </CardTitle>
              <NotesBox>{pkg.notes}</NotesBox>
            </Card>
          )}
        </div>

        {/* ── Right column ── */}
        <div>
          {/* Company card */}
          <Card>
            <CardTitle>
              <Building2 size={14} /> Company
            </CardTitle>
            {pkg.companyId ? (
              <CompanyLink
                onClick={() =>
                  navigate(
                    `/admin/companies/${pkg.companyId._id || pkg.companyId}`,
                  )
                }
              >
                <div className="left">
                  <Building2 size={18} />
                  <div>
                    <div className="name">
                      {pkg.companyId.name || 'Unknown'}
                    </div>
                    <div className="tier">
                      {pkg.companyId.tier && (
                        <TierTag $tier={pkg.companyId.tier}>
                          {pkg.companyId.tier}
                        </TierTag>
                      )}{' '}
                      {pkg.companyId.industry || ''}
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} />
              </CompanyLink>
            ) : (
              <Empty>No company linked.</Empty>
            )}
          </Card>

          {/* Quick stats */}
          <Card>
            <CardTitle>
              <Activity size={14} /> Quick info
            </CardTitle>
            <InfoItem style={{ marginBottom: '0.85rem' }}>
              <div className="label">Package type</div>
              <div className="value">{typeCfg.label}</div>
            </InfoItem>
            <Divider />
            <InfoItem style={{ marginBottom: '0.85rem', marginTop: '0.85rem' }}>
              <div className="label">Created</div>
              <div className="value">
                {pkg.createdAt ? formatDate(pkg.createdAt) : '—'}
              </div>
            </InfoItem>
            <Divider />
            <InfoItem style={{ marginTop: '0.85rem' }}>
              <div className="label">Last updated</div>
              <div className="value">
                {pkg.updatedAt ? formatDate(pkg.updatedAt) : '—'}
              </div>
            </InfoItem>
          </Card>
        </div>
      </Grid>

      {/* ── Edit Modal ── */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit package"
      >
        {form && (
          <Form onSubmit={handleSave}>
            <Field>
              <Label>Company</Label>
              <Select
                value={form.companyId}
                onChange={updateField('companyId')}
                required
              >
                <option value="">Select a company...</option>
                {(companies || [])
                  .filter((c) => c.status === 'active')
                  .map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} ({c.tier})
                    </option>
                  ))}
              </Select>
            </Field>
            <FormRow>
              <Field>
                <Label>Package name</Label>
                <Input
                  value={form.name}
                  onChange={updateField('name')}
                  required
                />
              </Field>
              <Field>
                <Label>Type</Label>
                <Select value={form.type} onChange={updateField('type')}>
                  {Object.entries(TYPE_CONFIG).map(([k, c]) => (
                    <option key={k} value={k}>
                      {c.label}
                    </option>
                  ))}
                </Select>
              </Field>
            </FormRow>
            <Field>
              <Label>Description (optional)</Label>
              <Textarea
                value={form.description}
                onChange={updateField('description')}
                maxLength={1000}
              />
            </Field>
            <FormRow>
              <Field>
                <Label>Start date</Label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={updateField('startDate')}
                />
              </Field>
              <Field>
                <Label>Expiry date</Label>
                <Input
                  type="date"
                  value={form.expiryDate}
                  onChange={updateField('expiryDate')}
                  required
                />
              </Field>
            </FormRow>
            <FormRow>
              <Field>
                <Label>Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.price.amount}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: {
                        ...form.price,
                        amount: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                />
              </Field>
              <Field>
                <Label>Currency</Label>
                <Select
                  value={form.price.currency}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: { ...form.price, currency: e.target.value },
                    })
                  }
                >
                  <option value="KES">KES</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </Select>
              </Field>
            </FormRow>
            <Field>
              <Label>
                Reminder schedule (days before expiry, comma-separated)
              </Label>
              <Input
                value={form.reminderDaysBefore}
                onChange={updateField('reminderDaysBefore')}
                placeholder="30, 14, 7, 1"
              />
            </Field>
            <Field>
              <Label>Reminder channels</Label>
              <ChannelGrid>
                <ChannelCard $on={form.reminderChannels.email}>
                  <input
                    type="checkbox"
                    checked={form.reminderChannels.email}
                    onChange={toggleChannel('email')}
                  />
                  <Mail size={16} /> Email
                </ChannelCard>
                <ChannelCard $on={form.reminderChannels.whatsapp}>
                  <input
                    type="checkbox"
                    checked={form.reminderChannels.whatsapp}
                    onChange={toggleChannel('whatsapp')}
                  />
                  <MessageSquare size={16} /> WhatsApp
                </ChannelCard>
                <ChannelCard $on={form.reminderChannels.inApp}>
                  <input
                    type="checkbox"
                    checked={form.reminderChannels.inApp}
                    onChange={toggleChannel('inApp')}
                  />
                  <Bell size={16} /> In-app
                </ChannelCard>
              </ChannelGrid>
            </Field>
            {form.expiryDate && reminderCount > 0 && (
              <ReminderHint>
                <Bell size={15} />
                <span>
                  {reminderCount} reminder{reminderCount === 1 ? '' : 's'} will
                  be automatically scheduled. Editing the expiry date or
                  schedule will regenerate them.
                </span>
              </ReminderHint>
            )}
            <Field>
              <Label>Notes (admin only)</Label>
              <Textarea
                value={form.notes}
                onChange={updateField('notes')}
                placeholder="Internal notes — not shown to the client"
              />
            </Field>
            <FormActions>
              <SecondaryButton type="button" onClick={() => setEditOpen(false)}>
                Cancel
              </SecondaryButton>
              <PrimaryButton type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save changes'}
              </PrimaryButton>
            </FormActions>
          </Form>
        )}
      </Modal>
    </Wrapper>
  )
}

export default AdminPackageDetail
