import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import {
  Bell,
  ArrowLeft,
  Edit2,
  Trash2,
  Calendar,
  Mail,
  MessageSquare,
  Clock,
  Check,
  AlertCircle,
  XCircle,
  Repeat,
  Building2,
  User,
  Tag,
  Send,
  RefreshCw,
} from 'lucide-react'
import { useAuthedRequest } from '../hooks/useAuthedRequest'
import { useReminders } from '../hooks/useReminders'
import Modal from '../components/Modal'
import { useCompanies } from '../hooks/useCompanies'
import { FullScreenLoader } from '../components/Loader'

/* ─── Layout ─────────────────────────────────────────────────────────── */

const Wrapper = styled.div`
  max-width: 860px;
  margin: 0 auto;
  padding: 2rem;
`

const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.88rem;
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

const TitleBlock = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;

  .icon-wrap {
    width: 48px;
    height: 48px;
    border-radius: ${({ theme }) => theme.radii.lg};
    background: ${({ $tint }) => $tint};
    color: ${({ $color }) => $color};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
  }

  h1 {
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.55rem;
    letter-spacing: -0.025em;
    margin: 0 0 0.35rem 0;
  }
`

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`

const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${({ $tint }) => $tint};
  color: ${({ $color }) => $color};
`

const CategoryPill = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  padding: 0.18rem 0.55rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  color: ${({ theme }) => theme.colors.text};
`

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
`

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.65rem 1rem;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.88rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({ $danger }) => ($danger ? '#ef4444' : 'currentColor')};
    color: ${({ $danger, theme }) => ($danger ? '#ef4444' : theme.colors.text)};
  }
`

/* ─── Cards ──────────────────────────────────────────────────────────── */

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.5rem;
`

const CardLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`

const MessageBody = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;
  line-height: 1.7;
  margin: 0;
  white-space: pre-wrap;
`

const MetaList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`

const MetaItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;

  .meta-icon {
    color: ${({ theme }) => theme.colors.muted};
    flex-shrink: 0;
    margin-top: 2px;
  }

  .meta-label {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.muted};
    margin-bottom: 0.15rem;
  }

  .meta-value {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
  }

  .meta-sub {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.muted};
  }
`

const TierTag = styled.span`
  margin-left: 0.4rem;
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

const ChannelList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

const ChannelBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.background : 'transparent'};
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.border};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.muted};
  opacity: ${({ $active }) => ($active ? 1 : 0.45)};
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 1.25rem 0;
`

/* ─── Status change row ───────────────────────────────────────────────── */

const StatusBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding: 1rem 1.25rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  margin-bottom: 1rem;
`

const StatusBarLabel = styled.span`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 500;
  margin-right: auto;
`

const QuickStatusBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.9rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.8rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  border: 1px solid ${({ $color }) => $color};
  color: ${({ $color }) => $color};
  background: ${({ $tint }) => $tint};
  transition: opacity 0.15s ease;

  &:hover:not(:disabled) {
    opacity: 0.8;
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`

/* ─── Form (Edit modal) ───────────────────────────────────────────────── */

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
  min-height: 100px;
  resize: vertical;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 0.92rem;
  line-height: 1.5;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
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

const FormActions = styled.div`
  display: flex;
  gap: 0.6rem;
  justify-content: flex-end;
`

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.2rem;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  font-size: 0.92rem;
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

const SecondaryButton = styled.button`
  padding: 0.7rem 1.2rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
`

/* ─── Constants ──────────────────────────────────────────────────────── */

const STATUS_CONFIG = {
  scheduled: {
    color: '#3b82f6',
    tint: 'rgba(59,130,246,0.12)',
    label: 'Scheduled',
    icon: Clock,
  },
  sent: {
    color: '#10b981',
    tint: 'rgba(16,185,129,0.12)',
    label: 'Sent',
    icon: Check,
  },
  failed: {
    color: '#ef4444',
    tint: 'rgba(239,68,68,0.12)',
    label: 'Failed',
    icon: AlertCircle,
  },
  cancelled: {
    color: '#6b7280',
    tint: 'rgba(107,114,128,0.15)',
    label: 'Cancelled',
    icon: XCircle,
  },
}

const CATEGORY_CONFIG = {
  invoice: { color: '#f59e0b', tint: 'rgba(245,158,11,0.12)' },
  package_expiry: { color: '#3b82f6', tint: 'rgba(59,130,246,0.12)' },
  domain_renewal: { color: '#ef4444', tint: 'rgba(239,68,68,0.12)' },
  general: { color: '#6366f1', tint: 'rgba(99,102,241,0.12)' },
  support: { color: '#10b981', tint: 'rgba(16,185,129,0.12)' },
}

const toLocalInputValue = (date) => {
  const d = new Date(date)
  const offset = d.getTimezoneOffset() * 60_000
  return new Date(d - offset).toISOString().slice(0, 16)
}

const formatDateTime = (date) =>
  new Date(date).toLocaleString(undefined, {
    dateStyle: 'long',
    timeStyle: 'short',
  })

/* ─── Component ──────────────────────────────────────────────────────── */

const AdminReminderDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isReady, get } = useAuthedRequest()
  const { updateReminder, deleteReminder } = useReminders()
  const { companies } = useCompanies()

  const [reminder, setReminder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [usersInCompany, setUsersInCompany] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [changingStatus, setChangingStatus] = useState(false)

  // Fetch single reminder
  useEffect(() => {
    if (!isReady) return
    const fetch = async () => {
      setLoading(true)
      try {
        const data = await get(`/api/admin/reminders/${id}`)
        setReminder(data.reminder)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id, isReady, get])

  // Fetch users when company is known
  useEffect(() => {
    if (!reminder?.companyId?._id || !isReady) return
    const fetch = async () => {
      try {
        const data = await get(
          `/api/admin/clients?companyId=${reminder.companyId._id}`,
        )
        setUsersInCompany(data.users.filter((u) => u.role === 'client'))
      } catch (err) {
        console.error(err)
      }
    }
    fetch()
  }, [reminder?.companyId?._id, isReady, get])

  const openEdit = () => {
    setForm({
      companyId: reminder.companyId?._id || reminder.companyId || '',
      userId: reminder.userId?._id || reminder.userId || '',
      title: reminder.title,
      message: reminder.message,
      category: reminder.category,
      scheduledFor: toLocalInputValue(reminder.scheduledFor),
      recurrence: reminder.recurrence,
      recurrenceEndDate: reminder.recurrenceEndDate
        ? toLocalInputValue(reminder.recurrenceEndDate)
        : '',
      channels: reminder.channels,
    })
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        userId: form.userId || null,
        scheduledFor: new Date(form.scheduledFor).toISOString(),
        recurrenceEndDate: form.recurrenceEndDate
          ? new Date(form.recurrenceEndDate).toISOString()
          : null,
      }
      const updated = await updateReminder(id, payload)
      setReminder(updated)
      setModalOpen(false)
    } catch (err) {
      alert('Failed to save: ' + (err.response?.data?.error || err.message))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this reminder? It will not be sent.')) return
    try {
      await deleteReminder(id)
      navigate('/admin/reminders')
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.error || err.message))
    }
  }

  const handleStatusChange = async (newStatus) => {
    setChangingStatus(true)
    try {
      const updated = await updateReminder(id, { status: newStatus })
      setReminder(updated)
    } catch (err) {
      alert('Failed: ' + (err.response?.data?.error || err.message))
    } finally {
      setChangingStatus(false)
    }
  }

  const updateField = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value })

  const toggleChannel = (channel) => () =>
    setForm({
      ...form,
      channels: { ...form.channels, [channel]: !form.channels[channel] },
    })

  if (loading)
    return (
      <Wrapper>
        <FullScreenLoader label="Loading reminder..." />
      </Wrapper>
    )

  if (!reminder)
    return (
      <Wrapper>
        <BackLink onClick={() => navigate(-1)}>
          <ArrowLeft size={14} /> Back
        </BackLink>
        <p style={{ color: 'var(--colors-muted)' }}>Reminder not found.</p>
      </Wrapper>
    )

  const status = STATUS_CONFIG[reminder.status] || STATUS_CONFIG.scheduled
  const StatusIcon = status.icon
  const categoryCfg =
    CATEGORY_CONFIG[reminder.category] || CATEGORY_CONFIG.general

  return (
    <Wrapper>
      <BackLink onClick={() => navigate(-1)}>
        <ArrowLeft size={14} /> Back to reminders
      </BackLink>

      <PageHead>
        <TitleBlock $tint={categoryCfg.tint} $color={categoryCfg.color}>
          <span className="icon-wrap">
            <Bell size={22} />
          </span>
          <div>
            <h1>{reminder.title}</h1>
            <BadgeRow>
              <StatusPill $tint={status.tint} $color={status.color}>
                <StatusIcon size={11} /> {status.label}
              </StatusPill>
              <CategoryPill>{reminder.category.replace('_', ' ')}</CategoryPill>
            </BadgeRow>
          </div>
        </TitleBlock>

        <Actions>
          <IconButton onClick={openEdit}>
            <Edit2 size={14} /> Edit
          </IconButton>
          <IconButton $danger onClick={handleDelete}>
            <Trash2 size={14} /> Delete
          </IconButton>
        </Actions>
      </PageHead>

      {/* Quick status change */}
      {reminder.status === 'scheduled' && (
        <StatusBar>
          <StatusBarLabel>Quick actions</StatusBarLabel>
          <QuickStatusBtn
            $color="#10b981"
            $tint="rgba(16,185,129,0.1)"
            onClick={() => handleStatusChange('sent')}
            disabled={changingStatus}
          >
            <Send size={13} /> Mark as sent
          </QuickStatusBtn>
          <QuickStatusBtn
            $color="#6b7280"
            $tint="rgba(107,114,128,0.1)"
            onClick={() => handleStatusChange('cancelled')}
            disabled={changingStatus}
          >
            <XCircle size={13} /> Cancel
          </QuickStatusBtn>
        </StatusBar>
      )}

      {reminder.status === 'failed' && (
        <StatusBar>
          <StatusBarLabel>This reminder failed to send.</StatusBarLabel>
          <QuickStatusBtn
            $color="#3b82f6"
            $tint="rgba(59,130,246,0.1)"
            onClick={() => handleStatusChange('scheduled')}
            disabled={changingStatus}
          >
            <RefreshCw size={13} /> Re-schedule
          </QuickStatusBtn>
        </StatusBar>
      )}

      <Grid>
        {/* Message card */}
        <Card>
          <CardLabel>
            <MessageSquare size={12} /> Message
          </CardLabel>
          <MessageBody>{reminder.message}</MessageBody>

          <Divider />

          <CardLabel>
            <Bell size={12} /> Delivery channels
          </CardLabel>
          <ChannelList>
            <ChannelBadge $active={reminder.channels?.email}>
              <Mail size={13} /> Email
            </ChannelBadge>
            <ChannelBadge $active={reminder.channels?.whatsapp}>
              <MessageSquare size={13} /> WhatsApp
            </ChannelBadge>
            <ChannelBadge $active={reminder.channels?.inApp}>
              <Bell size={13} /> In-app
            </ChannelBadge>
          </ChannelList>
        </Card>

        {/* Meta card */}
        <Card>
          <CardLabel>
            <Tag size={12} /> Details
          </CardLabel>
          <MetaList>
            <MetaItem>
              <Building2 size={15} className="meta-icon" />
              <div>
                <div className="meta-label">Company</div>
                <div className="meta-value">
                  {reminder.companyId?.name || '—'}
                  {reminder.companyId?.tier && (
                    <TierTag $tier={reminder.companyId.tier}>
                      {reminder.companyId.tier}
                    </TierTag>
                  )}
                </div>
              </div>
            </MetaItem>

            <MetaItem>
              <User size={15} className="meta-icon" />
              <div>
                <div className="meta-label">Recipient</div>
                <div className="meta-value">
                  {reminder.userId
                    ? reminder.userId.displayName || reminder.userId.email
                    : 'Everyone at company'}
                </div>
                {reminder.userId && (
                  <div className="meta-sub">{reminder.userId.email}</div>
                )}
              </div>
            </MetaItem>

            <MetaItem>
              <Calendar size={15} className="meta-icon" />
              <div>
                <div className="meta-label">Scheduled for</div>
                <div className="meta-value">
                  {formatDateTime(reminder.scheduledFor)}
                </div>
              </div>
            </MetaItem>

            {reminder.recurrence !== 'none' && (
              <MetaItem>
                <Repeat size={15} className="meta-icon" />
                <div>
                  <div className="meta-label">Recurrence</div>
                  <div className="meta-value">
                    {reminder.recurrence.charAt(0).toUpperCase() +
                      reminder.recurrence.slice(1)}
                  </div>
                  {reminder.recurrenceEndDate && (
                    <div className="meta-sub">
                      Ends {formatDateTime(reminder.recurrenceEndDate)}
                    </div>
                  )}
                </div>
              </MetaItem>
            )}
          </MetaList>
        </Card>
      </Grid>

      {/* Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit reminder"
      >
        {form && (
          <Form onSubmit={handleSave}>
            <Field>
              <Label>Company</Label>
              <Select
                value={form.companyId}
                onChange={(e) =>
                  setForm({ ...form, companyId: e.target.value, userId: '' })
                }
                required
              >
                <option value="">Select a company...</option>
                {companies
                  .filter((c) => c.status === 'active')
                  .map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} ({c.tier})
                    </option>
                  ))}
              </Select>
            </Field>

            <Field>
              <Label>Send to</Label>
              <Select value={form.userId} onChange={updateField('userId')}>
                <option value="">Everyone at this company</option>
                {usersInCompany.map((u) => (
                  <option key={u._id} value={u._id}>
                    Just {u.displayName || u.email}
                  </option>
                ))}
              </Select>
            </Field>

            <Field>
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={updateField('title')}
                required
                maxLength={200}
              />
            </Field>

            <Field>
              <Label>Message</Label>
              <Textarea
                value={form.message}
                onChange={updateField('message')}
                required
                maxLength={2000}
              />
            </Field>

            <FormRow>
              <Field>
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onChange={updateField('category')}
                >
                  <option value="general">General</option>
                  <option value="invoice">Invoice</option>
                  <option value="package_expiry">Package expiry</option>
                  <option value="domain_renewal">Domain renewal</option>
                  <option value="support">Support</option>
                </Select>
              </Field>
              <Field>
                <Label>Send at</Label>
                <Input
                  type="datetime-local"
                  value={form.scheduledFor}
                  onChange={updateField('scheduledFor')}
                  required
                />
              </Field>
            </FormRow>

            <FormRow>
              <Field>
                <Label>Recurrence</Label>
                <Select
                  value={form.recurrence}
                  onChange={updateField('recurrence')}
                >
                  <option value="none">One-time</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </Select>
              </Field>
              <Field>
                <Label>End date (optional)</Label>
                <Input
                  type="datetime-local"
                  value={form.recurrenceEndDate}
                  onChange={updateField('recurrenceEndDate')}
                  disabled={form.recurrence === 'none'}
                />
              </Field>
            </FormRow>

            <Field>
              <Label>Send via</Label>
              <ChannelGrid>
                <ChannelCard $on={form.channels.email}>
                  <input
                    type="checkbox"
                    checked={form.channels.email}
                    onChange={toggleChannel('email')}
                  />
                  <Mail size={16} /> Email
                </ChannelCard>
                <ChannelCard $on={form.channels.whatsapp}>
                  <input
                    type="checkbox"
                    checked={form.channels.whatsapp}
                    onChange={toggleChannel('whatsapp')}
                  />
                  <MessageSquare size={16} /> WhatsApp
                </ChannelCard>
                <ChannelCard $on={form.channels.inApp}>
                  <input
                    type="checkbox"
                    checked={form.channels.inApp}
                    onChange={toggleChannel('inApp')}
                  />
                  <Bell size={16} /> In-app
                </ChannelCard>
              </ChannelGrid>
            </Field>

            <FormActions>
              <SecondaryButton
                type="button"
                onClick={() => setModalOpen(false)}
              >
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

export default AdminReminderDetail
