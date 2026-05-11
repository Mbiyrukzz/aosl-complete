import { useState, useCallback, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import {
  Building2,
  ArrowLeft,
  Edit2,
  Trash2,
  Users,
  Package as PackageIcon,
  AlertCircle,
  Mail,
  Phone,
  Globe,
  MapPin,
  Award,
  Crown,
  Gem,
  ArrowUpRight,
  Archive,
  Pause,
  CheckCircle2,
  FileText,
  StickyNote,
  Calendar,
} from 'lucide-react'
import Modal from '../components/Modal'
import { useCompanies } from '../hooks/useCompanies'
import { ROUTES, buildAdminIssuesPath } from '../constants/routes'
import { FullScreenLoader } from '../components/Loader'

/* ---------- Styled components ---------- */

const Wrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
`

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: ${({ theme }) => theme.colors.muted};
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
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

const Heading = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  min-width: 0;
  flex: 1;

  .icon-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: rgba(99, 102, 241, 0.12);
    color: #6366f1;
    border-radius: ${({ theme }) => theme.radii.lg};
    flex-shrink: 0;
  }

  h1 {
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 0.2rem 0;
    font-size: 1.65rem;
    letter-spacing: -0.02em;
  }

  .slug {
    color: ${({ theme }) => theme.colors.muted};
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.76rem;
  }
`

const Badges = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.35rem;
`

const TierBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${({ $tint }) => $tint};
  color: ${({ $color }) => $color};
`

const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${({ $tint }) => $tint};
  color: ${({ $color }) => $color};
`

const HeadActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
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

const DangerButton = styled(PrimaryButton)`
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.25);

  &:hover:not(:disabled) {
    background: rgba(239, 68, 68, 0.18);
    transform: translateY(-1px);
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

/* Stats row */

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

const StatCard = styled(Link)`
  display: block;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1rem 1.2rem;
  text-decoration: none;
  transition:
    border-color 0.18s ease,
    transform 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
  }

  .label {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.74rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    margin-bottom: 0.45rem;
  }

  .num {
    font-size: 1.6rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1;
    letter-spacing: -0.025em;
  }

  .sub {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.muted};
    margin-top: 0.3rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
`

/* Detail grid */

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`

const Panel = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.25rem;
`

const PanelFull = styled(Panel)`
  grid-column: 1 / -1;
`

const PanelTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 1rem;
`

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.88rem;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .icon {
    color: ${({ theme }) => theme.colors.muted};
    flex-shrink: 0;
    margin-top: 1px;
  }

  .key {
    color: ${({ theme }) => theme.colors.muted};
    min-width: 110px;
    flex-shrink: 0;
  }

  .val {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
    word-break: break-all;

    a {
      color: ${({ theme }) => theme.colors.primary};
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`

const Notes = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.88rem;
  line-height: 1.65;
  white-space: pre-wrap;

  &:empty::before {
    content: 'No notes.';
    color: ${({ theme }) => theme.colors.muted};
  }
`

/* Tab nav */

const Tabs = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const Tab = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 1rem;
  background: transparent;
  border: none;
  border-bottom: 2px solid
    ${({ $active, theme }) => ($active ? theme.colors.primary : 'transparent')};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.muted};
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  font-size: 0.85rem;
  cursor: pointer;
  font-family: inherit;
  transition: color 0.15s ease;
  margin-bottom: -1px;

  .badge {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.border};
    color: ${({ $active, theme }) => ($active ? '#fff' : theme.colors.muted)};
    border-radius: 999px;
    font-size: 0.68rem;
    font-weight: 700;
    padding: 0.1rem 0.45rem;
    transition: background 0.15s ease;
  }
`

/* Table */

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.87rem;
`

const Th = styled.th`
  text-align: left;
  padding: 0.6rem 0.75rem;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const Td = styled.td`
  padding: 0.75rem;
  color: ${({ theme }) => theme.colors.text};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  vertical-align: middle;

  &:last-child {
    text-align: right;
  }

  tr:last-child & {
    border-bottom: none;
  }
`

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  background: ${({ $tint }) => $tint || 'rgba(99,102,241,0.1)'};
  color: ${({ $color }) => $color || '#6366f1'};
`

const Empty = styled.div`
  text-align: center;
  padding: 2.5rem 1rem;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.88rem;
`

const ErrorBox = styled.div`
  padding: 1rem 1.2rem;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: ${({ theme }) => theme.radii.lg};
  color: #ef4444;
  font-size: 0.88rem;
  margin-bottom: 1.5rem;
`

/* Form (reused from AdminCompanies) */

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
const SelectInput = styled.select`
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
const TierGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
`
const TierCard = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 0.85rem 0.5rem;
  background: ${({ $on, $tint, theme }) =>
    $on ? $tint : theme.colors.surface};
  border: 1px solid
    ${({ $on, $color, theme }) => ($on ? $color : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 600;
  color: ${({ $on, $color, theme }) => ($on ? $color : theme.colors.text)};
  user-select: none;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.15s ease;
  input {
    display: none;
  }
`
const FormActions = styled.div`
  display: flex;
  gap: 0.6rem;
  justify-content: flex-end;
`

/* ---------- Constants ---------- */

const TIER_CONFIG = {
  silver: {
    color: '#94a3b8',
    tint: 'rgba(148,163,184,0.15)',
    icon: Award,
    label: 'Silver',
    description: '24h SLA',
  },
  gold: {
    color: '#d97706',
    tint: 'rgba(217,119,6,0.15)',
    icon: Crown,
    label: 'Gold',
    description: '8h SLA',
  },
  platinum: {
    color: '#6366f1',
    tint: 'rgba(99,102,241,0.15)',
    icon: Gem,
    label: 'Platinum',
    description: '2h SLA',
  },
}

const STATUS_CONFIG = {
  active: {
    color: '#10b981',
    tint: 'rgba(16,185,129,0.12)',
    icon: CheckCircle2,
    label: 'Active',
  },
  on_hold: {
    color: '#f59e0b',
    tint: 'rgba(245,158,11,0.12)',
    icon: Pause,
    label: 'On hold',
  },
  archived: {
    color: '#6b7280',
    tint: 'rgba(107,114,128,0.15)',
    icon: Archive,
    label: 'Archived',
  },
}

const blankForm = {
  name: '',
  tier: 'silver',
  primaryContactEmail: '',
  phone: '',
  website: '',
  address: '',
  status: 'active',
  notes: '',
}

/* ---------- Component ---------- */

const AdminCompanyDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { updateCompany, deleteCompany, getCompanyDetail } = useCompanies()

  const [activeTab, setActiveTab] = useState('users')
  const [editOpen, setEditOpen] = useState(false)
  const [form, setForm] = useState(blankForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(true)

  const [company, setCompany] = useState(null)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    if (!id) return

    setLoading(true)
    setError(null)

    try {
      const data = await getCompanyDetail(id)

      // depending on backend response shape
      setCompany(data.company || data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [id, getCompanyDetail])

  useEffect(() => {
    refresh()
  }, [refresh])

  const openEdit = () => {
    setForm({
      name: company.name,
      tier: company.tier,
      primaryContactEmail: company.primaryContactEmail || '',
      phone: company.phone || '',
      website: company.website || '',
      address: company.address || '',
      status: company.status,
      notes: company.notes || '',
    })
    setFormError('')
    setEditOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      await updateCompany(id, form)
      await refresh()
      setEditOpen(false)
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to save company')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Delete "${company.name}"? This cannot be undone.`)) return
    try {
      await deleteCompany(id)
      navigate(ROUTES.ADMIN_COMPANIES)
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.error || err.message))
    }
  }

  const updateField = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value })

  /* ---------- Loading / error states ---------- */

  if (loading) {
    return (
      <Wrapper>
        <BackLink to={ROUTES.ADMIN_COMPANIES}>
          <ArrowLeft size={14} /> Back to Companies
        </BackLink>
        <FullScreenLoader label="Loading company details. Kindly wait..." />
      </Wrapper>
    )
  }

  if (error || !company) {
    return (
      <Wrapper>
        <BackLink to={ROUTES.ADMIN_COMPANIES}>
          <ArrowLeft size={14} /> Back to Companies
        </BackLink>
        <ErrorBox>{error || 'Company not found.'}</ErrorBox>
      </Wrapper>
    )
  }

  const tierCfg = TIER_CONFIG[company.tier] || TIER_CONFIG.silver
  const statusCfg = STATUS_CONFIG[company.status] || STATUS_CONFIG.active
  const TierIcon = tierCfg.icon
  const StatusIcon = statusCfg.icon

  const userCount = company.counts?.users ?? 0
  const packageCount = company.counts?.packages ?? 0
  const issueCount = company.counts?.openIssues ?? 0

  // These lists come from the enriched company object.
  // If your API returns them at company.users / company.packages / company.issues,
  // use those directly. Otherwise fetch them separately in the hook.
  const users = company.users || []
  const packages = company.packages || []
  const issues = company.issues || []

  return (
    <Wrapper>
      <BackLink to={ROUTES.ADMIN_COMPANIES}>
        <ArrowLeft size={14} /> Back to Companies
      </BackLink>

      {/* ---- Page header ---- */}
      <PageHead>
        <Heading>
          <span className="icon-wrap">
            <Building2 size={24} />
          </span>
          <div>
            <h1>{company.name}</h1>
            {company.slug && <div className="slug">@{company.slug}</div>}
            <Badges>
              <TierBadge $tint={tierCfg.tint} $color={tierCfg.color}>
                <TierIcon size={11} /> {tierCfg.label}
              </TierBadge>
              <StatusPill $tint={statusCfg.tint} $color={statusCfg.color}>
                <StatusIcon size={10} /> {statusCfg.label}
              </StatusPill>
            </Badges>
          </div>
        </Heading>

        <HeadActions>
          <PrimaryButton onClick={openEdit}>
            <Edit2 size={15} /> Edit
          </PrimaryButton>
          <DangerButton onClick={handleDelete}>
            <Trash2 size={15} /> Delete
          </DangerButton>
        </HeadActions>
      </PageHead>

      {/* ---- Stats ---- */}
      <Stats>
        <StatCard to={`${ROUTES.ADMIN_CLIENTS}?companyId=${company._id}`}>
          <div className="label">
            <Users size={12} /> Users
          </div>
          <div className="num">{userCount}</div>
          <div className="sub">linked accounts</div>
        </StatCard>

        <StatCard to={`${ROUTES.ADMIN_PACKAGES}?companyId=${company._id}`}>
          <div className="label">
            <PackageIcon size={12} /> Packages
          </div>
          <div className="num">{packageCount}</div>
          <div className="sub">active packages</div>
        </StatCard>

        <StatCard to={buildAdminIssuesPath(company._id)}>
          <div className="label">
            <AlertCircle size={12} /> Open issues
          </div>
          <div className="num">{issueCount}</div>
          <div className="sub">
            view in issues <ArrowUpRight size={11} />
          </div>
        </StatCard>
      </Stats>

      {/* ---- Detail panels ---- */}
      <Grid>
        {/* Contact info */}
        <Panel>
          <PanelTitle>
            <Mail size={13} /> Contact
          </PanelTitle>

          {company.primaryContactEmail && (
            <InfoRow>
              <Mail size={13} className="icon" />
              <span className="key">Email</span>
              <span className="val">
                <a href={`mailto:${company.primaryContactEmail}`}>
                  {company.primaryContactEmail}
                </a>
              </span>
            </InfoRow>
          )}

          {company.phone && (
            <InfoRow>
              <Phone size={13} className="icon" />
              <span className="key">Phone</span>
              <span className="val">
                <a href={`tel:${company.phone}`}>{company.phone}</a>
              </span>
            </InfoRow>
          )}

          {company.website && (
            <InfoRow>
              <Globe size={13} className="icon" />
              <span className="key">Website</span>
              <span className="val">
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {company.website.replace(/^https?:\/\//, '')}
                </a>
              </span>
            </InfoRow>
          )}

          {company.address && (
            <InfoRow>
              <MapPin size={13} className="icon" />
              <span className="key">Address</span>
              <span className="val">{company.address}</span>
            </InfoRow>
          )}

          {!company.primaryContactEmail &&
            !company.phone &&
            !company.website &&
            !company.address && <Empty>No contact info on record.</Empty>}
        </Panel>

        {/* Account info */}
        <Panel>
          <PanelTitle>
            <FileText size={13} /> Account
          </PanelTitle>

          <InfoRow>
            <TierIcon size={13} className="icon" />
            <span className="key">Tier</span>
            <span className="val">
              <TierBadge $tint={tierCfg.tint} $color={tierCfg.color}>
                <TierIcon size={10} /> {tierCfg.label}
              </TierBadge>
              &nbsp;— {tierCfg.description}
            </span>
          </InfoRow>

          <InfoRow>
            <StatusIcon size={13} className="icon" />
            <span className="key">Status</span>
            <span className="val">
              <StatusPill $tint={statusCfg.tint} $color={statusCfg.color}>
                <StatusIcon size={10} /> {statusCfg.label}
              </StatusPill>
            </span>
          </InfoRow>

          {company.createdAt && (
            <InfoRow>
              <Calendar size={13} className="icon" />
              <span className="key">Created</span>
              <span className="val">
                {new Date(company.createdAt).toLocaleDateString('en-KE', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </InfoRow>
          )}

          {company.updatedAt && (
            <InfoRow>
              <Calendar size={13} className="icon" />
              <span className="key">Updated</span>
              <span className="val">
                {new Date(company.updatedAt).toLocaleDateString('en-KE', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </InfoRow>
          )}
        </Panel>

        {/* Notes — full width */}
        <PanelFull>
          <PanelTitle>
            <StickyNote size={13} /> Internal notes
          </PanelTitle>
          <Notes>{company.notes}</Notes>
        </PanelFull>
      </Grid>

      {/* ---- Linked data tabs ---- */}
      <Tabs>
        <Tab
          $active={activeTab === 'users'}
          onClick={() => setActiveTab('users')}
        >
          <Users size={13} /> Users
          <span className="badge">{userCount}</span>
        </Tab>
        <Tab
          $active={activeTab === 'packages'}
          onClick={() => setActiveTab('packages')}
        >
          <PackageIcon size={13} /> Packages
          <span className="badge">{packageCount}</span>
        </Tab>
        <Tab
          $active={activeTab === 'issues'}
          onClick={() => setActiveTab('issues')}
        >
          <AlertCircle size={13} /> Open issues
          <span className="badge">{issueCount}</span>
        </Tab>
      </Tabs>

      <Panel>
        {/* Users tab */}
        {activeTab === 'users' &&
          (users.length === 0 ? (
            <Empty>No users linked to this company yet.</Empty>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Role</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <Td>{u.displayName || u.name || '—'}</Td>
                    <Td
                      style={{
                        color: 'var(--muted)',
                        fontFamily: 'monospace',
                        fontSize: '0.82rem',
                      }}
                    >
                      {u.email}
                    </Td>
                    <Td>
                      <Chip>{u.role}</Chip>
                    </Td>
                    <Td>
                      <Link
                        to={`${ROUTES.ADMIN_CLIENTS}?userId=${u._id}`}
                        style={{
                          color: 'var(--primary)',
                          fontSize: '0.8rem',
                          textDecoration: 'none',
                        }}
                      >
                        View <ArrowUpRight size={11} />
                      </Link>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ))}

        {/* Packages tab */}
        {activeTab === 'packages' &&
          (packages.length === 0 ? (
            <Empty>No packages linked to this company yet.</Empty>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Package</Th>
                  <Th>Status</Th>
                  <Th>Expires</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr key={pkg._id}>
                    <Td>{pkg.name || pkg.title || pkg._id}</Td>
                    <Td>
                      <Chip
                        $tint={
                          pkg.status === 'active'
                            ? 'rgba(16,185,129,0.12)'
                            : 'rgba(107,114,128,0.15)'
                        }
                        $color={pkg.status === 'active' ? '#10b981' : '#6b7280'}
                      >
                        {pkg.status}
                      </Chip>
                    </Td>
                    <Td style={{ color: 'var(--muted)', fontSize: '0.83rem' }}>
                      {pkg.expiresAt
                        ? new Date(pkg.expiresAt).toLocaleDateString('en-KE', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : '—'}
                    </Td>
                    <Td>
                      <Link
                        to={`${ROUTES.ADMIN_PACKAGES}?packageId=${pkg._id}`}
                        style={{
                          color: 'var(--primary)',
                          fontSize: '0.8rem',
                          textDecoration: 'none',
                        }}
                      >
                        View <ArrowUpRight size={11} />
                      </Link>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ))}

        {/* Issues tab */}
        {activeTab === 'issues' &&
          (issues.length === 0 ? (
            <Empty>No open issues for this company.</Empty>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Subject</Th>
                  <Th>Priority</Th>
                  <Th>Opened</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue._id}>
                    <Td>{issue.subject || issue.title}</Td>
                    <Td>
                      <Chip
                        $tint={
                          issue.priority === 'high'
                            ? 'rgba(239,68,68,0.1)'
                            : issue.priority === 'medium'
                              ? 'rgba(245,158,11,0.12)'
                              : 'rgba(107,114,128,0.15)'
                        }
                        $color={
                          issue.priority === 'high'
                            ? '#ef4444'
                            : issue.priority === 'medium'
                              ? '#f59e0b'
                              : '#6b7280'
                        }
                      >
                        {issue.priority || 'normal'}
                      </Chip>
                    </Td>
                    <Td style={{ color: 'var(--muted)', fontSize: '0.83rem' }}>
                      {issue.createdAt
                        ? new Date(issue.createdAt).toLocaleDateString(
                            'en-KE',
                            { year: 'numeric', month: 'short', day: 'numeric' },
                          )
                        : '—'}
                    </Td>
                    <Td>
                      <Link
                        to={`/support/${issue._id}`}
                        style={{
                          color: 'var(--primary)',
                          fontSize: '0.8rem',
                          textDecoration: 'none',
                        }}
                      >
                        View <ArrowUpRight size={11} />
                      </Link>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ))}
      </Panel>

      {/* ---- Edit modal ---- */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit company"
      >
        <Form onSubmit={handleSave}>
          {formError && (
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
              {formError}
            </div>
          )}

          <Field>
            <Label>Company name</Label>
            <Input
              value={form.name}
              onChange={updateField('name')}
              placeholder="Acme Ltd"
              required
              maxLength={200}
            />
          </Field>

          <Field>
            <Label>Tier — affects SLA and queue priority</Label>
            <TierGrid>
              {['silver', 'gold', 'platinum'].map((t) => {
                const cfg = TIER_CONFIG[t]
                const Icon = cfg.icon
                return (
                  <TierCard
                    key={t}
                    $on={form.tier === t}
                    $color={cfg.color}
                    $tint={cfg.tint}
                  >
                    <input
                      type="radio"
                      name="tier"
                      value={t}
                      checked={form.tier === t}
                      onChange={updateField('tier')}
                    />
                    <Icon size={20} />
                    {cfg.label}
                    <span
                      style={{
                        fontSize: '0.7rem',
                        opacity: 0.75,
                        fontWeight: 500,
                      }}
                    >
                      {cfg.description}
                    </span>
                  </TierCard>
                )
              })}
            </TierGrid>
          </Field>

          <FormRow>
            <Field>
              <Label>Primary contact email</Label>
              <Input
                type="email"
                value={form.primaryContactEmail}
                onChange={updateField('primaryContactEmail')}
                placeholder="ops@acme.com"
              />
            </Field>
            <Field>
              <Label>Phone</Label>
              <Input
                type="tel"
                value={form.phone}
                onChange={updateField('phone')}
                placeholder="+254 700 000 000"
              />
            </Field>
          </FormRow>

          <FormRow>
            <Field>
              <Label>Website</Label>
              <Input
                type="url"
                value={form.website}
                onChange={updateField('website')}
                placeholder="https://acme.com"
              />
            </Field>
            <Field>
              <Label>Status</Label>
              <SelectInput value={form.status} onChange={updateField('status')}>
                <option value="active">Active</option>
                <option value="on_hold">On hold</option>
                <option value="archived">Archived</option>
              </SelectInput>
            </Field>
          </FormRow>

          <Field>
            <Label>Address (optional)</Label>
            <Input
              value={form.address}
              onChange={updateField('address')}
              placeholder="Westlands, Nairobi"
            />
          </Field>

          <Field>
            <Label>Internal notes (admin only)</Label>
            <Textarea
              value={form.notes}
              onChange={updateField('notes')}
              placeholder="Anything the team should know…"
              maxLength={2000}
            />
          </Field>

          <FormActions>
            <SecondaryButton type="button" onClick={() => setEditOpen(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </PrimaryButton>
          </FormActions>
        </Form>
      </Modal>
    </Wrapper>
  )
}

export default AdminCompanyDetail
