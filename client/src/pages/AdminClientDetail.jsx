import { useState, useCallback, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import {
  User,
  ArrowLeft,
  Mail,
  Phone,
  Briefcase,
  Building2,
  Calendar,
  Shield,
  ShieldCheck,
  AlertCircle,
  Package as PackageIcon,
  Bell,
  ArrowUpRight,
  CheckCircle2,
  Edit2,
} from 'lucide-react'
import { useClients } from '../hooks/useClients'
import {
  ROUTES,
  buildAdminCompanyPath,
  buildAdminIssuesPath,
} from '../constants/routes'
import { FullScreenLoader } from '../components/Loader'
import Modal from '../components/Modal'

/* ── Styled components ── */
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
    margin: 0 0 0.2rem;
    font-size: 1.65rem;
    letter-spacing: -0.02em;
  }
`
const RolePill = styled.span`
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
  margin-top: 0.35rem;
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
const StatPlain = styled.div`
  display: block;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1rem 1.2rem;
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
  }
`
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
  grid-column: 1/-1;
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
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`
const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`
const FormLabel = styled.label`
  font-size: 0.82rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`
const FormSelect = styled.select`
  padding: 0.7rem 0.95rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 0.92rem;
  cursor: pointer;
`
const FormActions = styled.div`
  display: flex;
  gap: 0.6rem;
  justify-content: flex-end;
`

/* ── Constants ── */
const ROLE_CONFIG = {
  client: {
    color: '#6b7280',
    tint: 'rgba(107,114,128,0.12)',
    icon: User,
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

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—'

/* ── Component ── */
const AdminClientDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getClientDetail, updateClientRole } = useClients()

  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('packages')
  const [roleOpen, setRoleOpen] = useState(false)
  const [newRole, setNewRole] = useState('')
  const [saving, setSaving] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getClientDetail(id)
      setClient(data.user)
      setNewRole(data.user.role)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load client')
    } finally {
      setLoading(false)
    }
  }, [id, getClientDetail])

  useEffect(() => {
    refresh()
  }, [refresh])

  const handleRoleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateClientRole(id, newRole)
      await refresh()
      setRoleOpen(false)
    } catch (err) {
      alert('Failed: ' + (err.response?.data?.error || err.message))
    } finally {
      setSaving(false)
    }
  }

  if (loading)
    return (
      <Wrapper>
        <BackLink to={ROUTES.ADMIN_CLIENTS}>
          <ArrowLeft size={14} /> Back to Clients
        </BackLink>
        <FullScreenLoader label="Loading client details..." />
      </Wrapper>
    )

  if (error || !client)
    return (
      <Wrapper>
        <BackLink to={ROUTES.ADMIN_CLIENTS}>
          <ArrowLeft size={14} /> Back to Clients
        </BackLink>
        <ErrorBox>{error || 'Client not found.'}</ErrorBox>
      </Wrapper>
    )

  const roleCfg = ROLE_CONFIG[client.role] || ROLE_CONFIG.client
  const RoleIcon = roleCfg.icon
  const company =
    client.companyId && typeof client.companyId === 'object'
      ? client.companyId
      : null

  const packages = client.packages || []
  const issues = client.issues || []
  const reminders = client.reminders || []

  return (
    <Wrapper>
      <BackLink to={ROUTES.ADMIN_CLIENTS}>
        <ArrowLeft size={14} /> Back to Clients
      </BackLink>

      {/* ── Header ── */}
      <PageHead>
        <Heading>
          <span className="icon-wrap">
            <User size={24} />
          </span>
          <div>
            <h1>{client.displayName || client.name || '(no name)'}</h1>
            <div>
              <RolePill $tint={roleCfg.tint} $color={roleCfg.color}>
                <RoleIcon size={11} /> {roleCfg.label}
              </RolePill>
            </div>
          </div>
        </Heading>
        <PrimaryButton onClick={() => setRoleOpen(true)}>
          <Edit2 size={15} /> Change role
        </PrimaryButton>
      </PageHead>

      {/* ── Stats ── */}
      <Stats>
        <StatCard to={`${ROUTES.ADMIN_PACKAGES}?userId=${client._id}`}>
          <div className="label">
            <PackageIcon size={12} /> Packages
          </div>
          <div className="num">{packages.length}</div>
          <div className="sub">assigned packages</div>
        </StatCard>
        <StatCard to={buildAdminIssuesPath(company?._id)}>
          <div className="label">
            <AlertCircle size={12} /> Open issues
          </div>
          <div className="num">{issues.length}</div>
          <div className="sub">
            view in issues <ArrowUpRight size={11} />
          </div>
        </StatCard>
        <StatPlain>
          <div className="label">
            <Bell size={12} /> Reminders
          </div>
          <div className="num">{reminders.length}</div>
          <div className="sub">scheduled reminders</div>
        </StatPlain>
      </Stats>

      {/* ── Detail panels ── */}
      <Grid>
        <Panel>
          <PanelTitle>
            <Mail size={13} /> Contact
          </PanelTitle>
          <InfoRow>
            <Mail size={13} className="icon" />
            <span className="key">Email</span>
            <span className="val">
              <a href={`mailto:${client.email}`}>{client.email}</a>
            </span>
          </InfoRow>
          {client.phone && (
            <InfoRow>
              <Phone size={13} className="icon" />
              <span className="key">Phone</span>
              <span className="val">
                <a href={`tel:${client.phone}`}>{client.phone}</a>
              </span>
            </InfoRow>
          )}
          {client.jobTitle && (
            <InfoRow>
              <Briefcase size={13} className="icon" />
              <span className="key">Job title</span>
              <span className="val">{client.jobTitle}</span>
            </InfoRow>
          )}
          {!client.phone && !client.jobTitle && (
            <Empty>No additional contact info.</Empty>
          )}
        </Panel>

        <Panel>
          <PanelTitle>
            <Building2 size={13} /> Account
          </PanelTitle>
          <InfoRow>
            <RoleIcon size={13} className="icon" />
            <span className="key">Role</span>
            <span className="val">
              <RolePill $tint={roleCfg.tint} $color={roleCfg.color}>
                <RoleIcon size={10} /> {roleCfg.label}
              </RolePill>
            </span>
          </InfoRow>
          {company && (
            <InfoRow>
              <Building2 size={13} className="icon" />
              <span className="key">Company</span>
              <span className="val">
                <Link
                  to={buildAdminCompanyPath(company._id)}
                  style={{ color: 'inherit' }}
                >
                  {company.name}
                </Link>
              </span>
            </InfoRow>
          )}
          {client.createdAt && (
            <InfoRow>
              <Calendar size={13} className="icon" />
              <span className="key">Registered</span>
              <span className="val">{fmtDate(client.createdAt)}</span>
            </InfoRow>
          )}
          {client.lastLoginAt && (
            <InfoRow>
              <CheckCircle2 size={13} className="icon" />
              <span className="key">Last login</span>
              <span className="val">{fmtDate(client.lastLoginAt)}</span>
            </InfoRow>
          )}
        </Panel>
      </Grid>

      {/* ── Tabs ── */}
      <Tabs>
        <Tab
          $active={activeTab === 'packages'}
          onClick={() => setActiveTab('packages')}
        >
          <PackageIcon size={13} /> Packages{' '}
          <span className="badge">{packages.length}</span>
        </Tab>
        <Tab
          $active={activeTab === 'issues'}
          onClick={() => setActiveTab('issues')}
        >
          <AlertCircle size={13} /> Issues{' '}
          <span className="badge">{issues.length}</span>
        </Tab>
        <Tab
          $active={activeTab === 'reminders'}
          onClick={() => setActiveTab('reminders')}
        >
          <Bell size={13} /> Reminders{' '}
          <span className="badge">{reminders.length}</span>
        </Tab>
      </Tabs>

      <Panel>
        {/* Packages */}
        {activeTab === 'packages' &&
          (packages.length === 0 ? (
            <Empty>No packages assigned to this client.</Empty>
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
                      {fmtDate(pkg.expiresAt)}
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

        {/* Issues */}
        {activeTab === 'issues' &&
          (issues.length === 0 ? (
            <Empty>No open issues for this client.</Empty>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Subject</Th>
                  <Th>Status</Th>
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
                      <Chip $tint="rgba(99,102,241,0.1)" $color="#6366f1">
                        {issue.status}
                      </Chip>
                    </Td>
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
                      {fmtDate(issue.createdAt)}
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

        {/* Reminders */}
        {activeTab === 'reminders' &&
          (reminders.length === 0 ? (
            <Empty>No reminders for this client.</Empty>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Title</Th>
                  <Th>Due</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {reminders.map((r) => (
                  <tr key={r._id}>
                    <Td>{r.title || r.message || '—'}</Td>
                    <Td style={{ color: 'var(--muted)', fontSize: '0.83rem' }}>
                      {fmtDate(r.dueDate || r.scheduledAt)}
                    </Td>
                    <Td>
                      <Chip
                        $tint={
                          r.status === 'sent'
                            ? 'rgba(16,185,129,0.12)'
                            : 'rgba(245,158,11,0.12)'
                        }
                        $color={r.status === 'sent' ? '#10b981' : '#d97706'}
                      >
                        {r.status || 'pending'}
                      </Chip>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ))}
      </Panel>

      {/* ── Role modal ── */}
      <Modal
        open={roleOpen}
        onClose={() => setRoleOpen(false)}
        title="Change role"
      >
        <Form onSubmit={handleRoleSave}>
          <Field>
            <FormLabel>Role</FormLabel>
            <FormSelect
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option value="client">Client — standard access</option>
              <option value="staff">Staff — internal team</option>
              <option value="admin">Admin — full access</option>
            </FormSelect>
          </Field>
          <FormActions>
            <SecondaryButton type="button" onClick={() => setRoleOpen(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </PrimaryButton>
          </FormActions>
        </Form>
      </Modal>
    </Wrapper>
  )
}

export default AdminClientDetail
