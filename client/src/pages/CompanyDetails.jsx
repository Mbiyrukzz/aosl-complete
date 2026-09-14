import { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Users,
  Package,
  AlertCircle,
  Crown,
  Gem,
  Award,
  User2,
  Briefcase,
  CheckCircle2,
  Pause,
  Archive,
  FileText,
  Download,
  FolderKanban,
  Clock,
  ArrowUpRight,
} from 'lucide-react'

import { useAuthedRequest } from '../hooks/useAuthedRequest'
import { useUser } from '../hooks/useUser'
import { CompaniesContext } from '../contexts/CompaniesContext'
import { useProjects } from '../hooks/useProjects'
import { buildMyProjectPath } from '../constants/routes'

/* -------------------------------------------------------------------------- */
/*                                    STYLE                                   */
/* -------------------------------------------------------------------------- */

const Wrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
`

const Hero = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.8rem;
  margin-bottom: 1.5rem;
`

const HeroTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`

const CompanyBlock = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;

  .icon-wrap {
    width: 56px;
    height: 56px;
    border-radius: ${({ theme }) => theme.radii.lg};
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(99, 102, 241, 0.12);
    color: #6366f1;
    flex-shrink: 0;
  }

  h1 {
    margin: 0;
    font-size: 1.8rem;
    color: ${({ theme }) => theme.colors.text};
    letter-spacing: -0.03em;
  }

  .email {
    margin-top: 0.35rem;
    display: inline-block;
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    font-size: 0.9rem;

    &:hover {
      text-decoration: underline;
    }
  }

  .website {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.84rem;
    color: ${({ theme }) => theme.colors.muted};
    text-decoration: none;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.7rem;
  flex-wrap: wrap;
`

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${({ $tint }) => $tint};
  color: ${({ $color }) => $color};
`

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.8rem;
  margin-top: 1.5rem;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1rem;

  .label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.74rem;
    color: ${({ theme }) => theme.colors.muted};
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 0.55rem;
  }

  .value {
    font-size: 1.6rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    letter-spacing: -0.03em;
  }

  .sub {
    margin-top: 0.3rem;
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.muted};
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`

const Panel = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.4rem;
`

const FullPanel = styled(Panel)`
  grid-column: 1 / -1;
`

const PanelTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`

const InfoRow = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .icon {
    color: ${({ theme }) => theme.colors.muted};
    flex-shrink: 0;
  }

  .key {
    min-width: 110px;
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.84rem;
  }

  .value {
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.9rem;
    font-weight: 500;
    word-break: break-word;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`

const Section = styled.div`
  margin-top: 1.5rem;
`

const SectionTitle = styled.h2`
  margin: 0 0 1rem 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.05rem;
`

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
`

const Avatar = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: rgba(99, 102, 241, 0.12);
  color: #6366f1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const UserCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1rem;
  display: flex;
  gap: 0.9rem;
`

const UserInfo = styled.div`
  min-width: 0;
  flex: 1;

  .top {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    flex-wrap: wrap;
  }

  .name {
    font-size: 0.92rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
  }

  .email {
    font-size: 0.78rem;
    color: ${({ theme }) => theme.colors.muted};
    margin-top: 0.2rem;
    word-break: break-all;
  }

  .job {
    margin-top: 0.25rem;
    font-size: 0.76rem;
    color: ${({ theme }) => theme.colors.muted};
  }
`

const RoleBadge = styled.span`
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
`

const PackageCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  .name {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
  }

  .expiry {
    font-size: 0.78rem;
    color: ${({ theme }) => theme.colors.muted};
  }
`

const IssueCard = styled(PackageCard)``

const ProjectCard = styled(Link)`
  display: block;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1rem 1.1rem;
  text-decoration: none;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
  }

  .name {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    font-size: 0.95rem;
  }
`

const ProjectMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.muted};

  span {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }
`

const ProjectProgressBar = styled.div`
  margin-top: 0.75rem;
  height: 6px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.border};
  overflow: hidden;

  div {
    height: 100%;
    background: #6366f1;
    width: ${({ $pct }) => $pct}%;
  }
`

const StatusPill = styled.span`
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  background: rgba(99, 102, 241, 0.12);
  color: #6366f1;
`

const InvoiceCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;

  .left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 0;
  }

  .icon-wrap {
    width: 38px;
    height: 38px;
    border-radius: ${({ theme }) => theme.radii.md};
    background: rgba(99, 102, 241, 0.1);
    color: #6366f1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .ref {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.92rem;
  }

  .meta {
    font-size: 0.78rem;
    color: ${({ theme }) => theme.colors.muted};
    margin-top: 0.15rem;
  }

  .right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
  }

  .amount {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.95rem;
  }
`

const DownloadLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.75rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 600;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`

const NoDownload = styled.span`
  font-size: 0.76rem;
  color: ${({ theme }) => theme.colors.muted};
  font-style: italic;
`

const Empty = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
`

const Loading = styled.div`
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.muted};
`

const ErrorBox = styled.div`
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: ${({ theme }) => theme.radii.lg};
  color: #ef4444;
`

/* -------------------------------------------------------------------------- */
/*                                  CONSTANTS                                 */
/* -------------------------------------------------------------------------- */

const TIER_CONFIG = {
  silver: {
    color: '#94a3b8',
    tint: 'rgba(148,163,184,0.15)',
    icon: Award,
  },
  gold: {
    color: '#d97706',
    tint: 'rgba(217,119,6,0.15)',
    icon: Crown,
  },
  platinum: {
    color: '#6366f1',
    tint: 'rgba(99,102,241,0.15)',
    icon: Gem,
  },
}

const ROLE_CONFIG = {
  admin: {
    bg: 'rgba(239,68,68,0.12)',
    color: '#ef4444',
  },
  staff: {
    bg: 'rgba(59,130,246,0.12)',
    color: '#3b82f6',
  },
  client: {
    bg: 'rgba(16,185,129,0.12)',
    color: '#10b981',
  },
}

const INVOICE_STATUS_CONFIG = {
  draft: { bg: 'rgba(107,114,128,0.12)', color: '#6b7280', label: 'Draft' },
  sent: { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', label: 'Sent' },
  paid: { bg: 'rgba(16,185,129,0.12)', color: '#10b981', label: 'Paid' },
  overdue: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', label: 'Overdue' },
  cancelled: {
    bg: 'rgba(107,114,128,0.15)',
    color: '#6b7280',
    label: 'Cancelled',
  },
}

const PROJECT_STATUS_LABEL = {
  not_started: 'Not started',
  in_progress: 'In progress',
  review: 'In review',
  completed: 'Completed',
  on_hold: 'On hold',
  cancelled: 'Cancelled',
}

/* -------------------------------------------------------------------------- */
/*                                 COMPONENT                                  */
/* -------------------------------------------------------------------------- */

export default function CompanyDetails() {
  const { profile } = useUser()
  const { isReady, get } = useAuthedRequest()
  const { getCompanyDetail, myInvoices, myInvoicesLoading } =
    useContext(CompaniesContext)
  const { myProjects, myProjectsLoading } = useProjects()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const isStaff = profile?.role === 'staff' || profile?.role === 'admin'

  useEffect(() => {
    if (!isReady || !profile) return

    const fetchCompany = async () => {
      setLoading(true)
      setError(null)

      try {
        // Staff go through the shared CompaniesContext so the detail
        // view stays in sync with anything the provider already cached.
        const res = isStaff
          ? await getCompanyDetail(profile.companyId)
          : await get('/api/companies/mine')

        setData(res)
      } catch (err) {
        setError(err.response?.data?.error || err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCompany()
  }, [isReady, profile, isStaff, get, getCompanyDetail])

  if (loading) {
    return <Loading>Loading company details…</Loading>
  }

  if (error) {
    return (
      <Wrapper>
        <ErrorBox>{error}</ErrorBox>
      </Wrapper>
    )
  }

  if (!data) return null

  const { company, users = [], packages = [], openIssues = [] } = data

  const tierCfg = TIER_CONFIG[company.tier] || TIER_CONFIG.silver
  const TierIcon = tierCfg.icon

  return (
    <Wrapper>
      {/* HEADER */}
      <Hero>
        <HeroTop>
          <CompanyBlock>
            <div className="icon-wrap">
              <Building2 size={26} />
            </div>

            <div>
              <h1>{company.name}</h1>

              {company.primaryContactEmail && (
                <a
                  href={`mailto:${company.primaryContactEmail}`}
                  className="email"
                >
                  {company.primaryContactEmail}
                </a>
              )}

              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="website"
                >
                  {company.website.replace(/^https?:\/\//, '')}
                </a>
              )}

              <BadgeRow>
                <Badge $color={tierCfg.color} $tint={tierCfg.tint}>
                  <TierIcon size={11} />
                  {company.tier}
                </Badge>
              </BadgeRow>
            </div>
          </CompanyBlock>
        </HeroTop>

        <Stats>
          <StatCard>
            <div className="label">
              <Users size={13} />
              Team Members
            </div>
            <div className="value">{users.length}</div>
            <div className="sub">linked users</div>
          </StatCard>

          <StatCard>
            <div className="label">
              <Package size={13} />
              Packages
            </div>
            <div className="value">{packages.length}</div>
            <div className="sub">active subscriptions</div>
          </StatCard>

          <StatCard>
            <div className="label">
              <AlertCircle size={13} />
              Open Issues
            </div>
            <div className="value">{openIssues.length}</div>
            <div className="sub">support requests</div>
          </StatCard>
        </Stats>
      </Hero>

      {/* PROJECTS — the main thing a client wants to check in on */}
      <Section style={{ marginTop: 0, marginBottom: '1.5rem' }}>
        <SectionTitle>
          <FolderKanban
            size={17}
            style={{ verticalAlign: 'middle', marginRight: 8 }}
          />
          Projects {myProjects.length > 0 && `(${myProjects.length})`}
        </SectionTitle>

        {myProjectsLoading ? (
          <Empty>Loading your projects…</Empty>
        ) : myProjects.length === 0 ? (
          <Empty>
            No projects yet. When we start work for you, it'll show up here.
          </Empty>
        ) : (
          <CardGrid>
            {myProjects.map((p) => (
              <ProjectCard key={p._id} to={buildMyProjectPath(p._id)}>
                <div className="top">
                  <span className="name">{p.title}</span>
                  <StatusPill>
                    {PROJECT_STATUS_LABEL[p.status] || p.status}
                  </StatusPill>
                </div>
                <ProjectMeta>
                  {p.dueDate && (
                    <span>
                      <Clock size={12} /> Due{' '}
                      {new Date(p.dueDate).toLocaleDateString('en-KE')}
                    </span>
                  )}
                  <span style={{ marginLeft: 'auto' }}>
                    View <ArrowUpRight size={11} />
                  </span>
                </ProjectMeta>
                <ProjectProgressBar $pct={p.progress || 0}>
                  <div />
                </ProjectProgressBar>
              </ProjectCard>
            ))}
          </CardGrid>
        )}
      </Section>

      {/* INFO GRID */}
      <Grid>
        <Panel>
          <PanelTitle>
            <Mail size={13} />
            Contact Information
          </PanelTitle>

          {company.primaryContactEmail && (
            <InfoRow>
              <Mail size={14} className="icon" />
              <div className="key">Email</div>
              <div className="value">
                <a href={`mailto:${company.primaryContactEmail}`}>
                  {company.primaryContactEmail}
                </a>
              </div>
            </InfoRow>
          )}

          {company.phone && (
            <InfoRow>
              <Phone size={14} className="icon" />
              <div className="key">Phone</div>
              <div className="value">{company.phone}</div>
            </InfoRow>
          )}

          {company.website && (
            <InfoRow>
              <Globe size={14} className="icon" />
              <div className="key">Website</div>
              <div className="value">
                <a href={company.website} target="_blank" rel="noreferrer">
                  {company.website}
                </a>
              </div>
            </InfoRow>
          )}

          {company.address && (
            <InfoRow>
              <MapPin size={14} className="icon" />
              <div className="key">Address</div>
              <div className="value">{company.address}</div>
            </InfoRow>
          )}
        </Panel>

        <Panel>
          <PanelTitle>
            <Building2 size={13} />
            Company Meta
          </PanelTitle>

          {company.accountManagerId && (
            <InfoRow>
              <User2 size={14} className="icon" />
              <div className="key">Manager</div>
              <div className="value">
                {company.accountManagerId.displayName}
                <div
                  style={{
                    fontSize: '0.75rem',
                    opacity: 0.7,
                    marginTop: '0.2rem',
                  }}
                >
                  {company.accountManagerId.email}
                </div>
              </div>
            </InfoRow>
          )}

          <InfoRow>
            <Gem size={14} className="icon" />
            <div className="key">Tier</div>
            <div className="value">{company.tier}</div>
          </InfoRow>

          {company.status && (
            <InfoRow>
              {company.status === 'active' ? (
                <CheckCircle2 size={14} className="icon" />
              ) : company.status === 'on_hold' ? (
                <Pause size={14} className="icon" />
              ) : (
                <Archive size={14} className="icon" />
              )}

              <div className="key">Status</div>
              <div className="value">{company.status}</div>
            </InfoRow>
          )}
        </Panel>

        {company.notes && (
          <FullPanel>
            <PanelTitle>
              <Briefcase size={13} />
              Internal Notes
            </PanelTitle>

            <div
              style={{
                color: 'var(--text)',
                lineHeight: 1.7,
                fontSize: '0.9rem',
                whiteSpace: 'pre-wrap',
              }}
            >
              {company.notes}
            </div>
          </FullPanel>
        )}
      </Grid>

      {/* USERS */}
      <Section>
        <SectionTitle>Team Members ({users.length})</SectionTitle>

        {users.length === 0 ? (
          <Empty>No users found.</Empty>
        ) : (
          <CardGrid>
            {users.map((u) => {
              const roleCfg = ROLE_CONFIG[u.role] || {
                bg: 'rgba(107,114,128,0.15)',
                color: '#6b7280',
              }

              return (
                <UserCard key={u._id || u.uid}>
                  <Avatar>
                    {u.avatarUrl ? (
                      <img src={u.avatarUrl} alt={u.displayName} />
                    ) : (
                      (u.displayName?.[0]?.toUpperCase() ?? '?')
                    )}
                  </Avatar>

                  <UserInfo>
                    <div className="top">
                      <div className="name">{u.displayName}</div>

                      <RoleBadge $bg={roleCfg.bg} $color={roleCfg.color}>
                        {u.role}
                      </RoleBadge>
                    </div>

                    <div className="email">{u.email}</div>

                    {u.jobTitle && <div className="job">{u.jobTitle}</div>}
                  </UserInfo>
                </UserCard>
              )
            })}
          </CardGrid>
        )}
      </Section>

      {/* PACKAGES */}
      {packages.length > 0 && (
        <Section>
          <SectionTitle>Packages ({packages.length})</SectionTitle>

          <div style={{ display: 'grid', gap: '0.8rem' }}>
            {packages.map((pkg) => (
              <PackageCard key={pkg._id}>
                <div>
                  <div className="name">{pkg.name}</div>
                </div>

                {pkg.expiryDate && (
                  <div className="expiry">
                    Expires{' '}
                    {new Date(pkg.expiryDate).toLocaleDateString('en-KE')}
                  </div>
                )}
              </PackageCard>
            ))}
          </div>
        </Section>
      )}

      {/* INVOICES — clients only; staff manage these under /accounts/invoices */}
      {!isStaff && (
        <Section>
          <SectionTitle>
            Invoices {myInvoices.length > 0 && `(${myInvoices.length})`}
          </SectionTitle>

          {myInvoicesLoading ? (
            <Empty>Loading invoices…</Empty>
          ) : myInvoices.length === 0 ? (
            <Empty>No invoices yet.</Empty>
          ) : (
            <div style={{ display: 'grid', gap: '0.8rem' }}>
              {myInvoices.map((inv) => {
                const statusCfg =
                  INVOICE_STATUS_CONFIG[inv.status] ||
                  INVOICE_STATUS_CONFIG.draft

                return (
                  <InvoiceCard key={inv._id}>
                    <div className="left">
                      <div className="icon-wrap">
                        <FileText size={18} />
                      </div>
                      <div>
                        <div className="ref">{inv.refNumber}</div>
                        <div className="meta">
                          {inv.subject ? `${inv.subject} · ` : ''}
                          Issued{' '}
                          {new Date(inv.issueDate).toLocaleDateString('en-KE')}
                          {inv.dueDate &&
                            ` · Due ${new Date(inv.dueDate).toLocaleDateString('en-KE')}`}
                        </div>
                      </div>
                    </div>

                    <div className="right">
                      <div className="amount">
                        {inv.currency}{' '}
                        {Number(inv.total).toLocaleString('en-KE', {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                      <RoleBadge $bg={statusCfg.bg} $color={statusCfg.color}>
                        {statusCfg.label}
                      </RoleBadge>
                      {inv.downloadUrl ? (
                        <DownloadLink
                          href={inv.downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Download size={13} /> Download
                        </DownloadLink>
                      ) : (
                        <NoDownload>Sent via email</NoDownload>
                      )}
                    </div>
                  </InvoiceCard>
                )
              })}
            </div>
          )}
        </Section>
      )}

      {/* ISSUES */}
      {isStaff && openIssues.length > 0 && (
        <Section>
          <SectionTitle>Open Issues ({openIssues.length})</SectionTitle>

          <div style={{ display: 'grid', gap: '0.8rem' }}>
            {openIssues.map((issue) => (
              <IssueCard key={issue._id}>
                <div className="name">{issue.title}</div>

                <RoleBadge
                  $bg={
                    issue.status === 'in_progress'
                      ? 'rgba(245,158,11,0.12)'
                      : 'rgba(239,68,68,0.12)'
                  }
                  $color={
                    issue.status === 'in_progress' ? '#f59e0b' : '#ef4444'
                  }
                >
                  {issue.status}
                </RoleBadge>
              </IssueCard>
            ))}
          </div>
        </Section>
      )}
    </Wrapper>
  )
}