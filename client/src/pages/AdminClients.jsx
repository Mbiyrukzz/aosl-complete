import { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import {
  Users,
  UserPlus,
  Mail,
  Building2,
  Phone,
  Copy,
  CheckCircle2,
  Shield,
  ShieldCheck,
  User as UserIcon,
  Briefcase,
  Crown,
  Award,
  Gem,
  Eye,
} from 'lucide-react'
import Modal from '../components/Modal'
import { useClients } from '../hooks/useClients'
import { useCompanies } from '../hooks/useCompanies'
import { FullScreenLoader } from '../components/Loader'
import { buildAdminClientPath } from '../constants/routes'

/* ── Styled components (unchanged from original) ── */
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
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: rgba(99, 102, 241, 0.12);
    color: #6366f1;
    border-radius: ${({ theme }) => theme.radii.lg};
  }
  h1 {
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 0.2rem;
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
const CompanyGroup = styled.div`
  margin-bottom: 1.5rem;
`
const GroupHead = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.5rem;
  .name {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 700;
    font-size: 0.92rem;
  }
  .count {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.78rem;
  }
`
const TierBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${({ $tint }) => $tint};
  color: ${({ $color }) => $color};
`
const Row = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem 1.25rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: 0.5rem;
  transition: border-color 0.18s ease;
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
  @media (max-width: 720px) {
    grid-template-columns: auto 1fr auto;
    .desktop-only {
      display: none;
    }
  }
`
const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  flex-shrink: 0;
`
const RowInfo = styled.div`
  min-width: 0;
  .name {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.95rem;
    margin-bottom: 0.2rem;
  }
  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem;
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.82rem;
  }
  .meta-item {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }
`
const RolePill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${({ $tint }) => $tint};
  color: ${({ $color }) => $color};
`
const RoleSelect = styled.select`
  padding: 0.45rem 1.8rem 0.45rem 0.7rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.82rem;
  font-family: inherit;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.55rem center;
`
const IconLink = styled(Link)`
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.muted};
  text-decoration: none;
  transition: all 0.15s ease;
  &:hover {
    border-color: currentColor;
    color: ${({ theme }) => theme.colors.text};
  }
`
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
  .required {
    color: #ef4444;
  }
`
const Input = styled.input`
  padding: 0.65rem 0.9rem;
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
  padding: 0.65rem 0.9rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 0.92rem;
  cursor: pointer;
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`
const FormActions = styled.div`
  display: flex;
  gap: 0.6rem;
  justify-content: flex-end;
`
const SuccessBox = styled.div`
  padding: 1rem;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: 1rem;
  .top {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #10b981;
    font-weight: 600;
    font-size: 0.92rem;
    margin-bottom: 0.5rem;
  }
  .desc {
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.86rem;
    line-height: 1.55;
    margin-bottom: 0.85rem;
  }
  .link-wrap {
    display: flex;
    gap: 0.5rem;
    align-items: stretch;
  }
  .link-input {
    flex: 1;
    padding: 0.55rem 0.8rem;
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.md};
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.78rem;
    color: ${({ theme }) => theme.colors.text};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .copy-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0 0.85rem;
    background: ${({ theme }) => theme.colors.text};
    color: ${({ theme }) => theme.colors.background};
    border: none;
    border-radius: ${({ theme }) => theme.radii.md};
    font-weight: 600;
    font-size: 0.82rem;
    cursor: pointer;
    font-family: inherit;
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

const ROLE_CONFIG = {
  client: {
    color: '#6b7280',
    tint: 'rgba(107,114,128,0.12)',
    icon: UserIcon,
    label: 'Client',
  },
  staff: {
    color: '#d97706',
    tint: 'rgba(245,158,11,0.12)',
    icon: Shield,
    label: 'Staff',
  },
  admin: {
    color: '#6366f1',
    tint: 'rgba(99,102,241,0.12)',
    icon: ShieldCheck,
    label: 'Admin',
  },
}
const TIER_CONFIG = {
  silver: {
    color: '#94a3b8',
    tint: 'rgba(148,163,184,0.15)',
    icon: Award,
    label: 'Silver',
  },
  gold: {
    color: '#d97706',
    tint: 'rgba(217,119,6,0.15)',
    icon: Crown,
    label: 'Gold',
  },
  platinum: {
    color: '#6366f1',
    tint: 'rgba(99,102,241,0.15)',
    icon: Gem,
    label: 'Platinum',
  },
}
const TIER_WEIGHT = { platinum: 0, gold: 1, silver: 2 }

const initials = (name = '') => {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase() || '?'
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
const blankForm = {
  name: '',
  email: '',
  phone: '',
  companyId: '',
  jobTitle: '',
  role: 'client',
}

const AdminClients = () => {
  const {
    clients: users,
    loading,
    createClient,
    updateClientRole,
  } = useClients()

  const { companies } = useCompanies()

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(blankForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [resetLink, setResetLink] = useState('')
  const [createdUser, setCreatedUser] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const data = await createClient(form)
      setResetLink(data.resetLink)
      setCreatedUser(data.user)
      setForm(blankForm)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create client')
    } finally {
      setSaving(false)
    }
  }

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateClientRole(id, newRole)
    } catch (err) {
      alert(
        'Failed to update role: ' + (err.response?.data?.error || err.message),
      )
    }
  }

  const closeModal = () => {
    setModalOpen(false)
    setError('')
    setResetLink('')
    setCreatedUser(null)
    setForm(blankForm)
    setCopied(false)
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(resetLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      alert('Could not copy. Select the link manually.')
    }
  }

  const updateField = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value })

  const grouped = (() => {
    const byCompany = new Map()
    const ungrouped = []
    users.forEach((u) => {
      if (u.companyId && typeof u.companyId === 'object') {
        const id = u.companyId._id
        if (!byCompany.has(id))
          byCompany.set(id, { company: u.companyId, users: [] })
        byCompany.get(id).users.push(u)
      } else {
        ungrouped.push(u)
      }
    })
    const groups = Array.from(byCompany.values()).sort((a, b) => {
      const tw =
        (TIER_WEIGHT[a.company.tier] ?? 9) - (TIER_WEIGHT[b.company.tier] ?? 9)
      return tw !== 0
        ? tw
        : (a.company.name || '').localeCompare(b.company.name || '')
    })
    return { groups, ungrouped }
  })()

  const renderUserRow = (user) => {
    const cfg = ROLE_CONFIG[user.role] || ROLE_CONFIG.client
    const Icon = cfg.icon
    return (
      <Row key={user._id}>
        <Avatar>{initials(user.displayName || user.email)}</Avatar>
        <RowInfo>
          <div className="name">{user.displayName || '(no name)'}</div>
          <div className="meta">
            <span className="meta-item">
              <Mail size={12} /> {user.email}
            </span>
            {user.jobTitle && (
              <span className="meta-item desktop-only">
                <Briefcase size={12} /> {user.jobTitle}
              </span>
            )}
            {user.phone && (
              <span className="meta-item desktop-only">
                <Phone size={12} /> {user.phone}
              </span>
            )}
          </div>
        </RowInfo>
        <RolePill className="desktop-only" $tint={cfg.tint} $color={cfg.color}>
          <Icon size={11} /> {cfg.label}
        </RolePill>
        <RoleSelect
          value={user.role}
          onChange={(e) => handleRoleChange(user._id, e.target.value)}
        >
          <option value="client">Client</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </RoleSelect>
        <IconLink to={buildAdminClientPath(user._id)} aria-label="View client">
          <Eye size={15} />
        </IconLink>
      </Row>
    )
  }

  return (
    <Wrapper>
      <PageHead>
        <Heading>
          <span className="icon-wrap">
            <Users size={22} />
          </span>
          <div>
            <h1>Clients & team</h1>
            <p>
              Register new client accounts, group by company, and manage roles.
            </p>
          </div>
        </Heading>
        <PrimaryButton onClick={() => setModalOpen(true)}>
          <UserPlus size={16} /> Register client
        </PrimaryButton>
      </PageHead>

      {loading ? (
        <FullScreenLoader label="Loading clients and team members..." />
      ) : users.length === 0 ? (
        <Empty>
          <p style={{ marginBottom: '1.25rem' }}>No accounts yet.</p>
          <PrimaryButton onClick={() => setModalOpen(true)}>
            <UserPlus size={16} /> Register client
          </PrimaryButton>
        </Empty>
      ) : (
        <>
          {grouped.groups.map(({ company, users: groupUsers }) => {
            const tierCfg = TIER_CONFIG[company.tier] || TIER_CONFIG.silver
            const TierIcon = tierCfg.icon
            return (
              <CompanyGroup key={company._id}>
                <GroupHead>
                  <Building2
                    size={15}
                    style={{ color: 'var(--muted,#6b7280)' }}
                  />
                  <span className="name">{company.name}</span>
                  <TierBadge $tint={tierCfg.tint} $color={tierCfg.color}>
                    <TierIcon size={10} /> {tierCfg.label}
                  </TierBadge>
                  <span className="count">
                    · {groupUsers.length}{' '}
                    {groupUsers.length === 1 ? 'user' : 'users'}
                  </span>
                </GroupHead>
                {groupUsers.map(renderUserRow)}
              </CompanyGroup>
            )
          })}
          {grouped.ungrouped.length > 0 && (
            <CompanyGroup>
              <GroupHead>
                <ShieldCheck
                  size={15}
                  style={{ color: 'var(--muted,#6b7280)' }}
                />
                <span className="name">Internal team</span>
                <span className="count">
                  · {grouped.ungrouped.length}{' '}
                  {grouped.ungrouped.length === 1 ? 'member' : 'members'}
                </span>
              </GroupHead>
              {grouped.ungrouped.map(renderUserRow)}
            </CompanyGroup>
          )}
        </>
      )}

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={createdUser ? 'Client registered' : 'Register new client'}
      >
        {createdUser ? (
          <div>
            <SuccessBox>
              <div className="top">
                <CheckCircle2 size={18} />
                <span>{createdUser.displayName} added successfully</span>
              </div>
              <p className="desc">
                Share the password reset link below with{' '}
                <strong>{createdUser.email}</strong>.
              </p>
              <div className="link-wrap">
                <input
                  className="link-input"
                  value={resetLink}
                  readOnly
                  onFocus={(e) => e.target.select()}
                />
                <button className="copy-btn" onClick={copyLink}>
                  <Copy size={13} />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </SuccessBox>
            <FormActions>
              <PrimaryButton onClick={closeModal}>Done</PrimaryButton>
            </FormActions>
          </div>
        ) : (
          <Form onSubmit={handleCreate}>
            {error && (
              <div
                style={{
                  padding: '0.7rem 0.9rem',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  borderRadius: '8px',
                  color: '#ef4444',
                  fontSize: '0.86rem',
                }}
              >
                {error}
              </div>
            )}
            <FormRow>
              <Field>
                <Label>Full name</Label>
                <Input
                  value={form.name}
                  onChange={updateField('name')}
                  placeholder="Jane Doe"
                  required
                />
              </Field>
              <Field>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={updateField('email')}
                  placeholder="jane@company.com"
                  required
                />
              </Field>
            </FormRow>
            <Field>
              <Label>
                Company{' '}
                {form.role === 'client' && <span className="required">*</span>}
              </Label>
              <Select
                value={form.companyId}
                onChange={updateField('companyId')}
                required={form.role === 'client'}
                disabled={form.role !== 'client'}
              >
                <option value="">
                  {form.role === 'client'
                    ? companies.length === 0
                      ? 'No companies yet'
                      : 'Select a company...'
                    : 'Not required for staff/admin'}
                </option>
                {companies.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({TIER_CONFIG[c.tier]?.label || c.tier})
                  </option>
                ))}
              </Select>
            </Field>
            <FormRow>
              <Field>
                <Label>Job title (optional)</Label>
                <Input
                  value={form.jobTitle}
                  onChange={updateField('jobTitle')}
                  placeholder="Operations Manager"
                />
              </Field>
              <Field>
                <Label>Phone (optional)</Label>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={updateField('phone')}
                  placeholder="+254 700 000 000"
                />
              </Field>
            </FormRow>
            <Field>
              <Label>Role</Label>
              <Select value={form.role} onChange={updateField('role')}>
                <option value="client">Client — standard access</option>
                <option value="staff">Staff — internal team</option>
                <option value="admin">Admin — full access</option>
              </Select>
            </Field>
            <FormActions>
              <SecondaryButton type="button" onClick={closeModal}>
                Cancel
              </SecondaryButton>
              <PrimaryButton
                type="submit"
                disabled={saving || (form.role === 'client' && !form.companyId)}
              >
                {saving ? 'Creating...' : 'Create account'}
              </PrimaryButton>
            </FormActions>
          </Form>
        )}
      </Modal>
    </Wrapper>
  )
}

export default AdminClients
