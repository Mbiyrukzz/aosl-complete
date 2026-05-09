import { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Users,
  Package as PackageIcon,
  AlertCircle,
  Mail,
  Phone,
  Globe,
  Award,
  Crown,
  Gem,
  ArrowUpRight,
  Archive,
  Pause,
  CheckCircle2,
} from 'lucide-react'
import Modal from '../components/Modal'
import { useCompanies } from '../hooks/useCompanies'

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
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }
`

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.25rem;
  margin-bottom: 0.75rem;
  transition: border-color 0.18s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  /* Tier accent stripe */
  ${({ $tierColor }) =>
    $tierColor &&
    `&::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: ${$tierColor};
    }`}
`

const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.85rem;
  flex-wrap: wrap;
`

const CompanyTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  flex: 1;

  .name {
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: -0.015em;
    margin: 0;
  }

  .slug {
    color: ${({ theme }) => theme.colors.muted};
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    margin-top: 0.15rem;
  }
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
  flex-shrink: 0;
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

const CardActions = styled.div`
  display: flex;
  gap: 0.4rem;
  flex-shrink: 0;
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

const Meta = styled.div`
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.82rem;
  margin-bottom: 0.75rem;

  .item {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  a {
    color: ${({ theme }) => theme.colors.muted};
    text-decoration: none;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`

const Counts = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`

const CountChip = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.75rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-size: 0.82rem;
  font-weight: 500;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }

  .num {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
  }

  &:hover .num {
    color: ${({ theme }) => theme.colors.primary};
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

/* ----- Constants ----- */

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

const TIER_WEIGHT = { platinum: 0, gold: 1, silver: 2 }

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

/* ----- Component ----- */

const AdminCompanies = () => {
  const {
    companies,
    loading,
    refetch,
    createCompany,
    updateCompany,
    deleteCompany,
  } = useCompanies()

  const [tierFilter, setTierFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(blankForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const openCreate = () => {
    setEditingId(null)
    setForm(blankForm)
    setError('')
    setModalOpen(true)
  }

  const openEdit = (company) => {
    setEditingId(company._id)
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
    setError('')
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editingId) {
        await updateCompany(editingId, form)
      } else {
        await createCompany(form)
      }
      setModalOpen(false)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save company')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (company) => {
    if (
      !confirm(
        `Delete "${company.name}"? This only works if no users or packages are linked. Otherwise, archive it instead.`,
      )
    )
      return
    try {
      await deleteCompany(company._id)
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.error || err.message))
    }
  }

  const updateField = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value })

  const counts = {
    all: companies.length,
    platinum: companies.filter((c) => c.tier === 'platinum').length,
    gold: companies.filter((c) => c.tier === 'gold').length,
    silver: companies.filter((c) => c.tier === 'silver').length,
  }

  // Filter + ensure platinum-first display
  const filtered = companies
    .filter((c) => (tierFilter === 'all' ? true : c.tier === tierFilter))
    .sort((a, b) => {
      const tw = (TIER_WEIGHT[a.tier] ?? 9) - (TIER_WEIGHT[b.tier] ?? 9)
      if (tw !== 0) return tw
      return a.name.localeCompare(b.name)
    })

  return (
    <Wrapper>
      <PageHead>
        <Heading>
          <span className="icon-wrap">
            <Building2 size={22} />
          </span>
          <div>
            <h1>Companies</h1>
            <p>Customer accounts grouped by tier — Silver, Gold, Platinum.</p>
          </div>
        </Heading>
        <PrimaryButton onClick={openCreate}>
          <Plus size={16} /> New company
        </PrimaryButton>
      </PageHead>

      <Stats>
        <Stat
          $active={tierFilter === 'all'}
          onClick={() => setTierFilter('all')}
        >
          <div className="num">{counts.all}</div>
          <div className="lbl">All</div>
        </Stat>
        <Stat
          $active={tierFilter === 'platinum'}
          onClick={() => setTierFilter('platinum')}
        >
          <div className="num">{counts.platinum}</div>
          <div className="lbl">
            <Gem size={11} /> Platinum
          </div>
        </Stat>
        <Stat
          $active={tierFilter === 'gold'}
          onClick={() => setTierFilter('gold')}
        >
          <div className="num">{counts.gold}</div>
          <div className="lbl">
            <Crown size={11} /> Gold
          </div>
        </Stat>
        <Stat
          $active={tierFilter === 'silver'}
          onClick={() => setTierFilter('silver')}
        >
          <div className="num">{counts.silver}</div>
          <div className="lbl">
            <Award size={11} /> Silver
          </div>
        </Stat>
      </Stats>

      {loading ? (
        <p style={{ color: 'var(--muted)' }}>Loading...</p>
      ) : filtered.length === 0 ? (
        <Empty>
          <p style={{ marginBottom: '1.25rem' }}>
            {companies.length === 0
              ? 'No companies yet. Create your first one to start onboarding clients.'
              : 'No companies match this filter.'}
          </p>
          {companies.length === 0 && (
            <PrimaryButton onClick={openCreate}>
              <Plus size={16} /> Create first company
            </PrimaryButton>
          )}
        </Empty>
      ) : (
        filtered.map((company) => {
          const tierCfg = TIER_CONFIG[company.tier] || TIER_CONFIG.silver
          const statusCfg =
            STATUS_CONFIG[company.status] || STATUS_CONFIG.active
          const TierIcon = tierCfg.icon
          const StatusIcon = statusCfg.icon

          return (
            <Card key={company._id} $tierColor={tierCfg.color}>
              <CardTop>
                <CompanyTitle>
                  <div>
                    <h3 className="name">{company.name}</h3>
                    {company.slug && (
                      <div className="slug">@{company.slug}</div>
                    )}
                  </div>
                  <TierBadge $tint={tierCfg.tint} $color={tierCfg.color}>
                    <TierIcon size={11} /> {tierCfg.label}
                  </TierBadge>
                  <StatusPill $tint={statusCfg.tint} $color={statusCfg.color}>
                    <StatusIcon size={10} /> {statusCfg.label}
                  </StatusPill>
                </CompanyTitle>
                <CardActions>
                  <IconButton
                    onClick={() => openEdit(company)}
                    aria-label="Edit"
                  >
                    <Edit2 size={15} />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(company)}
                    $danger
                    aria-label="Delete"
                  >
                    <Trash2 size={15} />
                  </IconButton>
                </CardActions>
              </CardTop>

              {(company.primaryContactEmail ||
                company.phone ||
                company.website) && (
                <Meta>
                  {company.primaryContactEmail && (
                    <span className="item">
                      <Mail size={12} />
                      <a href={`mailto:${company.primaryContactEmail}`}>
                        {company.primaryContactEmail}
                      </a>
                    </span>
                  )}
                  {company.phone && (
                    <span className="item">
                      <Phone size={12} />
                      <a href={`tel:${company.phone}`}>{company.phone}</a>
                    </span>
                  )}
                  {company.website && (
                    <span className="item">
                      <Globe size={12} />

                      <a
                        href={company.website}
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {company.website.replace(/^https?:\/\//, '')}
                      </a>
                    </span>
                  )}
                </Meta>
              )}

              <Counts>
                <CountChip to="/admin/clients">
                  <Users size={12} />
                  <span className="num">{company.counts?.users ?? 0}</span>
                  <span>
                    {(company.counts?.users ?? 0) === 1 ? 'user' : 'users'}
                  </span>
                </CountChip>
                <CountChip to="/admin/packages">
                  <PackageIcon size={12} />
                  <span className="num">{company.counts?.packages ?? 0}</span>
                  <span>
                    {(company.counts?.packages ?? 0) === 1
                      ? 'package'
                      : 'packages'}
                  </span>
                </CountChip>
                <CountChip to="/admin/issues">
                  <AlertCircle size={12} />
                  <span className="num">{company.counts?.openIssues ?? 0}</span>
                  <span>open issues</span>
                  <ArrowUpRight size={11} />
                </CountChip>
              </Counts>
            </Card>
          )
        })
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit company' : 'New company'}
      >
        <Form onSubmit={handleSave}>
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
              <Select value={form.status} onChange={updateField('status')}>
                <option value="active">Active</option>
                <option value="on_hold">On hold</option>
                <option value="archived">Archived</option>
              </Select>
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
              placeholder="Anything the team should know — billing quirks, key contacts, history..."
              maxLength={2000}
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
                  : 'Create company'}
            </PrimaryButton>
          </FormActions>
        </Form>
      </Modal>
    </Wrapper>
  )
}

export default AdminCompanies
