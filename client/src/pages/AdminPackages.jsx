import { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  Package as PackageIcon,
  Plus,
  Edit2,
  Trash2,
  Calendar,
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
} from 'lucide-react'
import Modal from '../components/Modal'
import { usePackages } from '../hooks/usePackages'
import { useCompanies } from '../hooks/useCompanies'
import { FullScreenLoader } from '../components/Loader'

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
    background: rgba(59, 130, 246, 0.12);
    color: #3b82f6;
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

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  @media (max-width: 720px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const Stat = styled.button`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 0.85rem 1rem;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  transition:
    border-color 0.18s ease,
    transform 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
  }

  .num {
    font-size: 1.4rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1;
    letter-spacing: -0.02em;
  }

  .lbl {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.74rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-top: 0.4rem;
  }
`

const Row = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto auto auto;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: 0.5rem;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: 720px) {
    grid-template-columns: auto 1fr auto;
    .desktop {
      display: none;
    }
  }
`

const TypeIconBox = styled.div`
  width: 38px;
  height: 38px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $tint }) => $tint};
  color: ${({ $color }) => $color};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

const RowInfo = styled.div`
  min-width: 0;

  .name {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    font-size: 0.95rem;
    margin-bottom: 0.25rem;
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

const IconButton = styled.button`
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

/* ----- Constants ----- */

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

const blankForm = {
  companyId: '',
  name: '',
  description: '',
  type: 'subscription',
  price: { amount: 0, currency: 'KES', billingCycle: 'yearly' },
  startDate: '',
  expiryDate: '',
  autoRenew: false,
  reminderDaysBefore: '30, 14, 7, 1',
  reminderChannels: { email: true, whatsapp: false, inApp: true },
  notes: '',
}

const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

const daysUntil = (date) => {
  const diff = new Date(date) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const toDateInputValue = (date) => {
  if (!date) return ''
  return new Date(date).toISOString().slice(0, 10)
}

/* ----- Component ----- */

const AdminPackages = () => {
  const {
    packages,
    loading,
    refetch,
    createPackage,
    updatePackage,
    deletePackage,
  } = usePackages()
  const { companies } = useCompanies()

  const [statusFilter, setStatusFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(blankForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    refetch({ status: statusFilter })
  }, [statusFilter, refetch])

  const filtered =
    statusFilter === 'all'
      ? packages
      : packages.filter((p) => p.status === statusFilter)

  const counts = {
    all: packages.length,
    active: packages.filter((p) => p.status === 'active').length,
    expiring_soon: packages.filter((p) => p.status === 'expiring_soon').length,
    expired: packages.filter((p) => p.status === 'expired').length,
  }

  const openCreate = () => {
    setEditingId(null)
    setForm({
      ...blankForm,
      startDate: toDateInputValue(new Date()),
    })
    setModalOpen(true)
  }

  const openEdit = (pkg) => {
    setEditingId(pkg._id)
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
    setModalOpen(true)
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

      if (editingId) {
        await updatePackage(editingId, payload)
      } else {
        await createPackage(payload)
      }
      setModalOpen(false)
    } catch (err) {
      alert('Failed to save: ' + (err.response?.data?.error || err.message))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this package? Scheduled reminders will be cancelled.'))
      return
    try {
      await deletePackage(id)
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.error || err.message))
    }
  }

  const updateField = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value })

  const toggleChannel = (channel) => () =>
    setForm({
      ...form,
      reminderChannels: {
        ...form.reminderChannels,
        [channel]: !form.reminderChannels[channel],
      },
    })

  const reminderCount = form.reminderDaysBefore
    .split(',')
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n) && n > 0).length

  return (
    <Wrapper>
      <PageHead>
        <Heading>
          <span className="icon-wrap">
            <PackageIcon size={22} />
          </span>
          <div>
            <h1>Packages</h1>
            <p>Track client subscriptions, hosting, domains, and renewals.</p>
          </div>
        </Heading>
        <PrimaryButton onClick={openCreate}>
          <Plus size={16} /> New package
        </PrimaryButton>
      </PageHead>

      <Stats>
        {[
          { key: 'all', label: 'Total' },
          { key: 'active', label: 'Active' },
          { key: 'expiring_soon', label: 'Expiring soon' },
          { key: 'expired', label: 'Expired' },
        ].map((s) => (
          <Stat
            key={s.key}
            $active={statusFilter === s.key}
            onClick={() => setStatusFilter(s.key)}
          >
            <div className="num">{counts[s.key] ?? 0}</div>
            <div className="lbl">{s.label}</div>
          </Stat>
        ))}
      </Stats>

      {loading ? (
        <FullScreenLoader label="Loading Packages" />
      ) : filtered.length === 0 ? (
        <Empty>
          <p style={{ marginBottom: '1.25rem' }}>
            No packages here yet. Create one to start tracking renewals and
            reminders for a client.
          </p>
          <PrimaryButton onClick={openCreate}>
            <Plus size={16} /> Create first package
          </PrimaryButton>
        </Empty>
      ) : (
        filtered.map((pkg) => {
          const typeCfg = TYPE_CONFIG[pkg.type] || TYPE_CONFIG.other
          const statusCfg = STATUS_CONFIG[pkg.status] || STATUS_CONFIG.active
          const TypeIcon = typeCfg.icon
          const StatusIcon = statusCfg.icon
          const days = daysUntil(pkg.expiryDate)

          return (
            <Row key={pkg._id}>
              <TypeIconBox $tint={typeCfg.tint} $color={typeCfg.color}>
                <TypeIcon size={18} />
              </TypeIconBox>
              <RowInfo>
                <div className="name">{pkg.name}</div>
                <div className="meta">
                  <span className="meta-item">
                    <span className="recipient">
                      {pkg.companyId?.name || 'Unknown company'}
                    </span>
                    {pkg.companyId?.tier && (
                      <TierTag $tier={pkg.companyId.tier}>
                        {pkg.companyId.tier}
                      </TierTag>
                    )}
                  </span>
                  <span className="meta-item">
                    <Calendar size={12} />
                    {formatDate(pkg.expiryDate)}
                    {days >= 0 ? ` (in ${days}d)` : ` (${Math.abs(days)}d ago)`}
                  </span>
                  <span className="meta-item desktop">{typeCfg.label}</span>
                </div>
              </RowInfo>
              <StatusPill
                className="desktop"
                $tint={statusCfg.tint}
                $color={statusCfg.color}
              >
                <StatusIcon size={11} /> {statusCfg.label}
              </StatusPill>
              <IconButton onClick={() => openEdit(pkg)} aria-label="Edit">
                <Edit2 size={15} />
              </IconButton>
              <IconButton
                onClick={() => handleDelete(pkg._id)}
                $danger
                aria-label="Delete"
              >
                <Trash2 size={15} />
              </IconButton>
            </Row>
          )
        })
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit package' : 'New package'}
      >
        <Form onSubmit={handleSave}>
          {/* Replace this whole Field block: */}
          <Field>
            <Label>Company</Label>
            <Select
              value={form.companyId}
              onChange={updateField('companyId')}
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

          <FormRow>
            <Field>
              <Label>Package name</Label>
              <Input
                value={form.name}
                onChange={updateField('name')}
                placeholder="ashmif.com hosting"
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
              placeholder="Plan details, what's included, special terms..."
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
                {reminderCount} reminder{reminderCount === 1 ? '' : 's'} will be
                automatically scheduled before expiry. Editing the expiry date
                or schedule will regenerate them.
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
            <SecondaryButton type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={saving}>
              {saving
                ? 'Saving...'
                : editingId
                  ? 'Save changes'
                  : 'Create package'}
            </PrimaryButton>
          </FormActions>
        </Form>
      </Modal>
    </Wrapper>
  )
}

export default AdminPackages
