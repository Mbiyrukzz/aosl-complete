import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import {
  Plus,
  CircleDot,
  Activity,
  CheckCircle2,
  AlertTriangle,
  UserX,
  Clock,
  Inbox,
  TrendingUp,
  ArrowRight,
  Shield,
  LifeBuoy,
} from 'lucide-react'
import { useUser } from '../hooks/useUser'
import { useIssues } from '../hooks/useIssues'
import { ROUTES, ROLES, buildIssuePath } from '../constants/routes'
import IssueListSkeleton from '../components/IssueListSkeleton'

/* ---------- Layout ---------- */

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`

const Header = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const Greeting = styled.div`
  h1 {
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.85rem;
    margin: 0 0 0.25rem 0;
    letter-spacing: -0.02em;
  }

  p {
    color: ${({ theme }) => theme.colors.muted};
    margin: 0;
    font-size: 0.92rem;
  }
`

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 1.15rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition:
    opacity 0.2s ease,
    transform 0.15s ease;

  &:hover {
    opacity: 0.92;
    transform: translateY(-1px);
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: ${({ $cols }) => `repeat(${$cols}, 1fr)`};
  gap: 0.85rem;
  margin-bottom: 2rem;

  @media (max-width: 720px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const StatCard = styled(Link)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  text-decoration: none;
  color: inherit;
  transition:
    border-color 0.18s ease,
    transform 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
  }

  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ $tint }) => $tint};
    color: ${({ $color }) => $color};
    flex-shrink: 0;
  }

  .num {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1;
    letter-spacing: -0.02em;
  }

  .lbl {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-top: 0.3rem;
  }
`

/* ---------- Sections ---------- */

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: ${({ $variant }) =>
    $variant === 'split' ? '1fr 1fr' : '1fr'};
  gap: 1.25rem;

  @media (max-width: 880px) {
    grid-template-columns: 1fr;
  }
`

const Panel = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
`

const PanelHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.95rem 1.2rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  h2 {
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.text};
    margin: 0;
    font-weight: 600;
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    color: ${({ theme }) => theme.colors.muted};
    text-decoration: none;
    font-size: 0.82rem;
    transition: color 0.15s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`

const PanelBody = styled.div`
  padding: 0.5rem;
`

const IssueRow = styled(Link)`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.85rem;
  padding: 0.7rem 0.85rem;
  border-radius: ${({ theme }) => theme.radii.md};
  text-decoration: none;
  color: inherit;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }

  .status-icon {
    color: ${({ $color }) => $color};
    display: inline-flex;
  }

  .body {
    min-width: 0;

    h4 {
      font-size: 0.9rem;
      font-weight: 600;
      color: ${({ theme }) => theme.colors.text};
      margin: 0 0 0.2rem 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .meta {
      color: ${({ theme }) => theme.colors.muted};
      font-size: 0.75rem;
      display: flex;
      gap: 0.5rem;
    }
  }

  .time {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.75rem;
    flex-shrink: 0;
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 2.5rem 1rem;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.9rem;
`

const PriorityDot = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $priority }) =>
    ({
      low: '#9ca3af',
      normal: '#3b82f6',
      high: '#f59e0b',
      urgent: '#ef4444',
    })[$priority] || '#9ca3af'};
  flex-shrink: 0;
`

/* ---------- Helpers ---------- */

const STATUS_CONFIG = {
  open: { color: '#3b82f6', icon: CircleDot },
  in_progress: { color: '#d97706', icon: Activity },
  resolved: { color: '#10b981', icon: CheckCircle2 },
  closed: { color: '#6b7280', icon: CircleDot },
}

const formatTime = (date) => {
  const d = new Date(date)
  const diffMs = Date.now() - d
  const diffHr = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)
  if (diffHr < 1) return 'just now'
  if (diffHr < 24) return `${diffHr}h ago`
  if (diffDay < 7) return `${diffDay}d ago`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

const greeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

/* ---------- Issue list helper ---------- */

const IssueList = ({ issues, emptyText }) => {
  if (issues.length === 0) {
    return <EmptyState>{emptyText}</EmptyState>
  }
  return issues.map((issue) => {
    const cfg = STATUS_CONFIG[issue.status] || STATUS_CONFIG.open
    const Glyph = cfg.icon
    return (
      <IssueRow
        key={issue._id}
        to={buildIssuePath(issue._id)}
        $color={cfg.color}
      >
        <span className="status-icon">
          <Glyph size={16} />
        </span>
        <div className="body">
          <h4>{issue.title}</h4>
          <div className="meta">
            <PriorityDot $priority={issue.priority} />
            <span>{issue.priority}</span>
            <span>·</span>
            <span>{issue.commentCount || 0} comments</span>
          </div>
        </div>
        <span className="time">{formatTime(issue.updatedAt)}</span>
      </IssueRow>
    )
  })
}

/* ---------- Client Dashboard ---------- */

const ClientDashboard = ({ user, issues, loading }) => {
  const stats = useMemo(() => {
    const open = issues.filter((i) => i.status === 'open').length
    const inProgress = issues.filter((i) => i.status === 'in_progress').length
    const resolved = issues.filter((i) => i.status === 'resolved').length
    return { open, inProgress, resolved }
  }, [issues])

  const recentActive = useMemo(
    () =>
      [...issues]
        .filter((i) => i.status !== 'closed' && i.status !== 'resolved')
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5),
    [issues],
  )

  return (
    <>
      <Header>
        <Greeting>
          <h1>
            {greeting()}, {user.email.split('@')[0]}
          </h1>
          <p>Here's what's happening with your issues.</p>
        </Greeting>
        <PrimaryButton to={ROUTES.SUPPORT}>
          <Plus size={16} /> New issue
        </PrimaryButton>
      </Header>

      <Grid $cols={3}>
        <StatCard
          to={`${ROUTES.SUPPORT}`}
          $tint="rgba(59,130,246,0.12)"
          $color="#3b82f6"
        >
          <span className="icon">
            <CircleDot size={20} />
          </span>
          <div>
            <div className="num">{stats.open}</div>
            <div className="lbl">Open</div>
          </div>
        </StatCard>
        <StatCard
          to={ROUTES.SUPPORT}
          $tint="rgba(245,158,11,0.12)"
          $color="#d97706"
        >
          <span className="icon">
            <Activity size={20} />
          </span>
          <div>
            <div className="num">{stats.inProgress}</div>
            <div className="lbl">In progress</div>
          </div>
        </StatCard>
        <StatCard
          to={ROUTES.SUPPORT}
          $tint="rgba(16,185,129,0.12)"
          $color="#10b981"
        >
          <span className="icon">
            <CheckCircle2 size={20} />
          </span>
          <div>
            <div className="num">{stats.resolved}</div>
            <div className="lbl">Resolved</div>
          </div>
        </StatCard>
      </Grid>

      <Panel>
        <PanelHead>
          <h2>Active issues</h2>
          <Link to={ROUTES.SUPPORT}>
            View all <ArrowRight size={13} />
          </Link>
        </PanelHead>
        <PanelBody>
          {loading ? (
            <div style={{ padding: '0.5rem' }}>
              <IssueListSkeleton count={3} />
            </div>
          ) : (
            <IssueList
              issues={recentActive}
              emptyText="You have no active issues. Nice."
            />
          )}
        </PanelBody>
      </Panel>
    </>
  )
}

/* ---------- Admin Dashboard ---------- */

const AdminDashboard = ({ user, issues, loading }) => {
  const stats = useMemo(() => {
    const open = issues.filter((i) => i.status === 'open').length
    const inProgress = issues.filter((i) => i.status === 'in_progress').length
    const urgent = issues.filter(
      (i) => i.priority === 'urgent' && i.status !== 'closed',
    ).length
    const unassigned = issues.filter(
      (i) => !i.assignedTo && i.status !== 'closed' && i.status !== 'resolved',
    ).length
    return { open, inProgress, urgent, unassigned }
  }, [issues])

  const myQueue = useMemo(
    () =>
      [...issues]
        .filter(
          (i) =>
            i.assignedTo === user.uid &&
            i.status !== 'closed' &&
            i.status !== 'resolved',
        )
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5),
    [issues, user.uid],
  )

  const needsTriage = useMemo(
    () =>
      [...issues]
        .filter((i) => !i.assignedTo && i.status === 'open')
        .sort((a, b) => {
          // Urgent first, then oldest first (oldest needs attention most)
          if (a.priority === 'urgent' && b.priority !== 'urgent') return -1
          if (b.priority === 'urgent' && a.priority !== 'urgent') return 1
          return new Date(a.createdAt) - new Date(b.createdAt)
        })
        .slice(0, 5),
    [issues],
  )

  return (
    <>
      <Header>
        <Greeting>
          <h1>
            {greeting()}, {user.email.split('@')[0]}
          </h1>
          <p>Team support overview and your assigned work.</p>
        </Greeting>
        <PrimaryButton to={ROUTES.ADMIN_ISSUES}>
          <Shield size={16} /> Manage issues
        </PrimaryButton>
      </Header>

      <Grid $cols={4}>
        <StatCard
          to={ROUTES.ADMIN_ISSUES}
          $tint="rgba(59,130,246,0.12)"
          $color="#3b82f6"
        >
          <span className="icon">
            <CircleDot size={20} />
          </span>
          <div>
            <div className="num">{stats.open}</div>
            <div className="lbl">Open</div>
          </div>
        </StatCard>
        <StatCard
          to={ROUTES.ADMIN_ISSUES}
          $tint="rgba(245,158,11,0.12)"
          $color="#d97706"
        >
          <span className="icon">
            <Activity size={20} />
          </span>
          <div>
            <div className="num">{stats.inProgress}</div>
            <div className="lbl">In progress</div>
          </div>
        </StatCard>
        <StatCard
          to={ROUTES.ADMIN_ISSUES}
          $tint="rgba(239,68,68,0.12)"
          $color="#ef4444"
        >
          <span className="icon">
            <AlertTriangle size={20} />
          </span>
          <div>
            <div className="num">{stats.urgent}</div>
            <div className="lbl">Urgent</div>
          </div>
        </StatCard>
        <StatCard
          to={ROUTES.ADMIN_ISSUES}
          $tint="rgba(107,114,128,0.15)"
          $color="#6b7280"
        >
          <span className="icon">
            <UserX size={20} />
          </span>
          <div>
            <div className="num">{stats.unassigned}</div>
            <div className="lbl">Unassigned</div>
          </div>
        </StatCard>
      </Grid>

      <SectionGrid $variant="split">
        <Panel>
          <PanelHead>
            <h2>Your queue</h2>
            <Link to={ROUTES.ADMIN_ISSUES}>
              View all <ArrowRight size={13} />
            </Link>
          </PanelHead>
          <PanelBody>
            {loading ? (
              <div style={{ padding: '0.5rem' }}>
                <IssueListSkeleton count={3} />
              </div>
            ) : (
              <IssueList
                issues={myQueue}
                emptyText="No issues assigned to you. Take a break or grab one from triage."
              />
            )}
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHead>
            <h2>Needs triage</h2>
            <Link to={ROUTES.ADMIN_ISSUES}>
              View all <ArrowRight size={13} />
            </Link>
          </PanelHead>
          <PanelBody>
            {loading ? (
              <div style={{ padding: '0.5rem' }}>
                <IssueListSkeleton count={3} />
              </div>
            ) : (
              <IssueList
                issues={needsTriage}
                emptyText="Nothing waiting. Inbox zero!"
              />
            )}
          </PanelBody>
        </Panel>
      </SectionGrid>
    </>
  )
}

/* ---------- Main Dashboard ---------- */

const Dashboard = () => {
  const { user, profile } = useUser()
  const { issues, loading } = useIssues()

  if (!user) return null

  const isStaff = profile?.role === ROLES.STAFF || profile?.role === ROLES.ADMIN

  return (
    <Wrapper>
      {isStaff ? (
        <AdminDashboard user={user} issues={issues} loading={loading} />
      ) : (
        <ClientDashboard user={user} issues={issues} loading={loading} />
      )}
    </Wrapper>
  )
}

export default Dashboard
