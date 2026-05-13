import { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  Bell,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Mail,
  MessageSquare,
  Check,
  AlertCircle,
  Clock,
  Repeat,
  XCircle,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthedRequest } from '../hooks/useAuthedRequest'
import Modal from '../components/Modal'
import { useReminders } from '../hooks/useReminders'
import { useCompanies } from '../hooks/useCompanies'
import { FullScreenLoader } from '../components/Loader'
import { buildAdminReminderPath } from '../constants/routes'

const Wrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
`

const PageHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`

const Heading = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;

  .icon-wrap {
    width: 44px;
    height: 44px;
    background: rgba(139, 92, 246, 0.12);
    color: #8b5cf6;
    border-radius: ${({ theme }) => theme.radii.lg};
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  h1 {
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 0.2rem 0;
    font-size: 1.65rem;
    letter-spacing: -0.02em;
  }

  p {
    color: ${({ theme }) => theme.colors.muted};
    margin: 0;
    font-size: 0.88rem;
  }
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

const Filters = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`

const FilterChip = styled.button`
  padding: 0.45rem 0.95rem;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.text : theme.colors.surface};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.background : theme.colors.text};
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.text : theme.colors.border};
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s ease;

  &:hover {
    transform: translateY(-1px);
  }
`

const ReminderRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  margin-bottom: 0.5rem;
  transition:
    border-color 0.15s ease,
    transform 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr auto;
  }
`

const ReminderInfo = styled.div`
  min-width: 0;

  .top {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 0.3rem;
    flex-wrap: wrap;
  }

  h3 {
    color: ${({ theme }) => theme.colors.text};
    margin: 0;
    font-size: 0.98rem;
    font-weight: 600;
  }

  .meta {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.82rem;
    display: flex;
    gap: 0.85rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .meta-item {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }

  .recipient {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
  }
`

const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${({ $tint }) => $tint};
  color: ${({ $color }) => $color};
`

const CategoryPill = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  padding: 0.15rem 0.55rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  color: ${({ theme }) => theme.colors.text};
`

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.muted};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({ $danger }) => ($danger ? '#ef4444' : 'currentColor')};
    color: ${({ $danger, theme }) => ($danger ? '#ef4444' : theme.colors.text)};
  }
`

const Empty = styled.div`
  text-align: center;
  padding: 4rem 1rem;
  color: ${({ theme }) => theme.colors.muted};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
`

/* ----- Form ----- */

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

const blankForm = {
  companyId: '',
  userId: '', // empty = whole company
  title: '',
  message: '',
  category: 'general',
  scheduledFor: '',
  recurrence: 'none',
  recurrenceEndDate: '',
  channels: { email: true, whatsapp: false, inApp: true },
}

const formatDateTime = (date) =>
  new Date(date).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

const toLocalInputValue = (date) => {
  const d = new Date(date)
  const offset = d.getTimezoneOffset() * 60_000
  return new Date(d - offset).toISOString().slice(0, 16)
}

const AdminReminders = () => {
  const {
    reminders,
    loading,
    refetch,
    createReminder,
    updateReminder,
    deleteReminder,
  } = useReminders()

  const { companies } = useCompanies()
  const { isReady, get } = useAuthedRequest()

  const [usersInCompany, setUsersInCompany] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(blankForm)
  const [saving, setSaving] = useState(false)

  const navigate = useNavigate()

  // Fetch users for the selected company (for optional user targeting)
  useEffect(() => {
    const fetchUsers = async () => {
      if (!form.companyId || !isReady) {
        setUsersInCompany([])
        return
      }
      try {
        const data = await get(`/api/admin/clients?companyId=${form.companyId}`)
        setUsersInCompany(data.users.filter((u) => u.role === 'client'))
      } catch (err) {
        console.error('Failed to fetch company users:', err)
      }
    }
    fetchUsers()
  }, [form.companyId, isReady, get])

  // Refetch when filter changes
  useEffect(() => {
    refetch({ status: statusFilter })
  }, [statusFilter, refetch])

  const openCreate = () => {
    setEditingId(null)
    const defaultDate = new Date(Date.now() + 60 * 60 * 1000)
    setForm({ ...blankForm, scheduledFor: toLocalInputValue(defaultDate) })
    setModalOpen(true)
  }

  const openEdit = (reminder) => {
    setEditingId(reminder._id)
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
        userId: form.userId || null, // empty string → null on backend
        scheduledFor: new Date(form.scheduledFor).toISOString(),
        recurrenceEndDate: form.recurrenceEndDate
          ? new Date(form.recurrenceEndDate).toISOString()
          : null,
      }

      if (editingId) {
        await updateReminder(editingId, payload)
      } else {
        await createReminder(payload)
      }
      setModalOpen(false)
    } catch (err) {
      alert('Failed to save: ' + (err.response?.data?.error || err.message))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this reminder? It will not be sent.')) return
    try {
      await deleteReminder(id)
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.error || err.message))
    }
  }

  const updateField = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value })

  const toggleChannel = (channel) => () =>
    setForm({
      ...form,
      channels: { ...form.channels, [channel]: !form.channels[channel] },
    })

  return (
    <Wrapper>
      <PageHead>
        <Heading>
          <span className="icon-wrap">
            <Bell size={22} />
          </span>
          <div>
            <h1>Reminders</h1>
            <p>Schedule one-time and recurring reminders for clients.</p>
          </div>
        </Heading>
        <PrimaryButton onClick={openCreate}>
          <Plus size={16} /> New reminder
        </PrimaryButton>
      </PageHead>

      <Filters>
        {['all', 'scheduled', 'sent', 'failed', 'cancelled'].map((s) => (
          <FilterChip
            key={s}
            $active={statusFilter === s}
            onClick={() => setStatusFilter(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </FilterChip>
        ))}
      </Filters>

      {loading ? (
        <FullScreenLoader label="Loading reminders..." />
      ) : reminders.length === 0 ? (
        <Empty>
          <p style={{ marginBottom: '1.25rem' }}>
            No reminders yet. Schedule one to notify a client about an invoice,
            renewal, or anything else.
          </p>
          <PrimaryButton onClick={openCreate}>
            <Plus size={16} /> Create first reminder
          </PrimaryButton>
        </Empty>
      ) : (
        reminders.map((r) => {
          const status = STATUS_CONFIG[r.status] || STATUS_CONFIG.scheduled
          const StatusIcon = status.icon
          return (
            <ReminderRow
              key={r._id}
              onClick={() => navigate(buildAdminReminderPath(r._id))}
            >
              <ReminderInfo>
                <div className="top">
                  <h3>{r.title}</h3>
                  <StatusPill $tint={status.tint} $color={status.color}>
                    <StatusIcon size={11} /> {status.label}
                  </StatusPill>
                  <CategoryPill>{r.category.replace('_', ' ')}</CategoryPill>
                </div>
                <div className="meta">
                  <span className="meta-item">
                    To:{' '}
                    <span className="recipient">
                      {r.companyId?.name || 'Unknown company'}
                    </span>
                    {r.companyId?.tier && (
                      <TierTag $tier={r.companyId.tier}>
                        {r.companyId.tier}
                      </TierTag>
                    )}
                    {r.userId && (
                      <span style={{ marginLeft: '0.4rem', opacity: 0.8 }}>
                        → {r.userId.displayName || r.userId.email}
                      </span>
                    )}
                  </span>
                  <span className="meta-item">
                    <Calendar size={12} /> {formatDateTime(r.scheduledFor)}
                  </span>
                  {r.recurrence !== 'none' && (
                    <span className="meta-item">
                      <Repeat size={12} /> {r.recurrence}
                    </span>
                  )}
                  {r.channels?.email && <Mail size={12} />}
                  {r.channels?.whatsapp && <MessageSquare size={12} />}
                </div>
              </ReminderInfo>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation()
                  openEdit(r)
                }}
                aria-label="Edit"
              >
                <Edit2 size={15} />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(r._id)
                }}
                $danger
                aria-label="Delete"
              >
                <Trash2 size={15} />
              </IconButton>
            </ReminderRow>
          )
        })
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit reminder' : 'New reminder'}
      >
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
              placeholder="Domain renewal due"
              required
              maxLength={200}
            />
          </Field>

          <Field>
            <Label>Message</Label>
            <Textarea
              value={form.message}
              onChange={updateField('message')}
              placeholder="Your domain ashmif.com expires in 14 days. Renew before [date] to avoid downtime."
              required
              maxLength={2000}
            />
          </Field>

          <FormRow>
            <Field>
              <Label>Category</Label>
              <Select value={form.category} onChange={updateField('category')}>
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
            <SecondaryButton type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={saving}>
              {saving
                ? 'Saving...'
                : editingId
                  ? 'Save changes'
                  : 'Schedule reminder'}
            </PrimaryButton>
          </FormActions>
        </Form>
      </Modal>
    </Wrapper>
  )
}

export default AdminReminders
