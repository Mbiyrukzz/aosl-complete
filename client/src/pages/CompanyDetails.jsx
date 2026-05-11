import { useEffect, useState } from 'react'
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
} from 'lucide-react'

import { useAuthedRequest } from '../hooks/useAuthedRequest'
import { useUser } from '../hooks/useUser'

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

const UserCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1rem;
  display: flex;
  gap: 0.9rem;
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

/* -------------------------------------------------------------------------- */
/*                                 COMPONENT                                  */
/* -------------------------------------------------------------------------- */

export default function CompanyDetails() {
  const { profile } = useUser()
  const { isReady, get } = useAuthedRequest()

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
        const endpoint = isStaff
          ? `/api/admin/companies/${profile.companyId}`
          : '/api/companies/mine'

        const res = await get(endpoint)

        setData(res)
      } catch (err) {
        setError(err.response?.data?.error || err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCompany()
  }, [isReady, profile, isStaff, get])

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
