import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import {
  Search,
  CircleDot,
  Activity,
  CheckCircle2,
  CircleSlash,
  ArrowUpDown,
  Filter,
  User,
  Clock,
  MessageSquare,
  Shield,
  Gem,
  Crown,
  Award,
} from 'lucide-react'
import { useIssues } from '../hooks/useIssues'
import { useUser } from '../hooks/useUser'
import { buildIssuePath } from '../constants/routes'
import IssueListSkeleton from '../components/IssueListSkeleton'
import TierBadge from '../components/TierBadge'

/* ---------- Layout ---------- */

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`

const PageHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;
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
  display: flex;
  align-items: center;
  gap: 0.7rem;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
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
    width: 34px;
    height: 34px;
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ $tint }) => $tint};
    color: ${({ $color }) => $color};
    flex-shrink: 0;
  }

  .num {
    font-size: 1.25rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1;
  }

  .lbl {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 0.2rem;
  }
`

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
`

/* Tier filter chip row */
const TierFilters = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`

const FilterChip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.border};
  background: ${({ theme, $active }) =>
    $active ? 'rgba(99,102,241,0.1)' : theme.colors.surface};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.muted};
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`

const SearchWrap = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;

  svg {
    position: absolute;
    left: 0.7rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.muted};
    pointer-events: none;
  }
`

const SearchInput = styled.input`
  width: 100%;
  padding: 0.55rem 0.7rem 0.55rem 2.1rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.88rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const SelectWrap = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;

  svg {
    position: absolute;
    left: 0.65rem;
    color: ${({ theme }) => theme.colors.muted};
    pointer-events: none;
  }
`

const StyledSelect = styled.select`
  padding: 0.55rem 0.7rem 0.55rem 2rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.85rem;
  font-family: inherit;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.6rem center;
  padding-right: 1.8rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

/* ---------- Issue rows ---------- */

const Row = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto auto auto;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1.1rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: 0.5rem;
  position: relative;
  overflow: hidden;
  transition: border-color 0.18s ease;

  /* Tier-coloured left stripe for platinum and gold */
  ${({ $tier }) =>
    $tier === 'platinum' &&
    `&::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: #6366f1;
    }`}

  ${({ $tier }) =>
    $tier === 'gold' &&
    `&::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: #d97706;
    }`}

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: 760px) {
    grid-template-columns: auto 1fr;
    gap: 0.5rem;

    .desktop-only {
      display: none;
    }
  }
`

const StatusIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color};
  flex-shrink: 0;
`

const RowBody = styled(Link)`
  text-decoration: none;
  color: inherit;
  min-width: 0;
  display: block;

  h3 {
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 0.25rem 0;
    font-size: 0.95rem;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sub {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.78rem;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .id {
    font-family: ui-monospace, monospace;
    font-size: 0.72rem;
    opacity: 0.7;
  }

  .author {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }

  .company {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
  }
`

const PriorityTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: ${({ $tint }) => $tint};
  color: ${({ $color }) => $color};
`

/* SLA inline indicator */
const SLATag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  background: ${({ $breached }) =>
    $breached ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)'};
  color: ${({ $breached }) => ($breached ? '#ef4444' : '#d97706')};
`

const SLAIndicator = ({ deadline }) => {
  const diff = new Date(deadline) - new Date()
  const breached = diff < 0
  const hours = Math.abs(Math.floor(diff / (1000 * 60 * 60)))
  const mins = Math.abs(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)))
  const label = breached
    ? hours >= 1
      ? `${hours}h overdue`
      : `${mins}m overdue`
    : hours >= 1
      ? `${hours}h left`
      : `${mins}m left`

  return (
    <SLATag $breached={breached}>
      <Clock size={10} />
      {label}
    </SLATag>
  )
}

const AssigneeSelect = styled.select`
  padding: 0.4rem 1.6rem 0.4rem 0.7rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme, $unassigned }) =>
    $unassigned ? theme.colors.muted : theme.colors.text};
  font-size: 0.8rem;
  font-family: inherit;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  max-width: 160px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const StatusSelect = styled.select`
  padding: 0.4rem 1.6rem 0.4rem 0.7rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.8rem;
  font-family: inherit;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const RowMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.78rem;
`

const Empty = styled.div`
  text-align: center;
  padding: 4rem 1rem;
  color: ${({ theme }) => theme.colors.muted};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
`

const ErrorBanner = styled.div`
  padding: 0.75rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: 1rem;
  font-size: 0.9rem;
`

/* ---------- Constants ---------- */

const STATUS_CONFIG = {
  open: {
    color: '#3b82f6',
    tint: 'rgba(59,130,246,0.12)',
    icon: CircleDot,
    label: 'Open',
  },
  in_progress: {
    color: '#d97706',
    tint: 'rgba(245,158,11,0.12)',
    icon: Activity,
    label: 'In progress',
  },
  resolved: {
    color: '#10b981',
    tint: 'rgba(16,185,129,0.12)',
    icon: CheckCircle2,
    label: 'Resolved',
  },
  closed: {
    color: '#6b7280',
    tint: 'rgba(107,114,128,0.15)',
    icon: CircleSlash,
    label: 'Closed',
  },
}

const PRIORITY_CONFIG = {
  low: { color: '#6b7280', tint: 'rgba(107,114,128,0.15)' },
  normal: { color: '#3b82f6', tint: 'rgba(59,130,246,0.12)' },
  high: { color: '#d97706', tint: 'rgba(245,158,11,0.15)' },
  urgent: { color: '#ef4444', tint: 'rgba(239,68,68,0.15)' },
}

const PRIORITY_ORDER = { urgent: 4, high: 3, normal: 2, low: 1 }

const formatDate = (date) => {
  const d = new Date(date)
  const diffDay = Math.floor((Date.now() - d) / 86400000)
  if (diffDay === 0) return 'today'
  if (diffDay === 1) return 'yesterday'
  if (diffDay < 7) return `${diffDay}d ago`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

/* ---------- Component ---------- */

const AdminIssues = () => {
  const { issues, staff, loading, error, updateStatus, assignIssue } =
    useIssues()
  const { user } = useUser()

  const [filter, setFilter] = useState('all')
  const [assigneeFilter, setAssigneeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sort, setSort] = useState('newest')
  const [query, setQuery] = useState('')
  const [tierFilter, setTierFilter] = useState('all')

  const counts = useMemo(() => {
    const c = {
      all: issues.length,
      open: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0,
    }
    issues.forEach((i) => {
      if (c[i.status] !== undefined) c[i.status] += 1
    })
    return c
  }, [issues])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = issues.filter((i) => {
      if (filter !== 'all' && i.status !== filter) return false
      if (priorityFilter !== 'all' && i.priority !== priorityFilter)
        return false
      if (assigneeFilter === 'me' && i.assignedTo !== user?.uid) return false
      if (assigneeFilter === 'unassigned' && i.assignedTo) return false
      if (tierFilter !== 'all' && i.companyTier !== tierFilter) return false
      if (q) {
        const inTitle = i.title.toLowerCase().includes(q)
        const inEmail = i.createdByEmail?.toLowerCase().includes(q)
        const inCompany = i.companyId?.name?.toLowerCase().includes(q)
        if (!inTitle && !inEmail && !inCompany) return false
      }
      return true
    })

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt)
        case 'priority':
          return (
            (PRIORITY_ORDER[b.priority] || 0) -
            (PRIORITY_ORDER[a.priority] || 0)
          )
        case 'most_commented':
          return (b.commentCount || 0) - (a.commentCount || 0)
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })
  }, [
    issues,
    filter,
    priorityFilter,
    assigneeFilter,
    tierFilter,
    query,
    sort,
    user,
  ])

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatus(id, newStatus)
    } catch (err) {
      alert('Failed to update status: ' + err.message)
    }
  }

  const handleAssignChange = async (id, assignedTo) => {
    try {
      await assignIssue(id, assignedTo || null)
    } catch (err) {
      alert('Failed to assign issue: ' + err.message)
    }
  }

  return (
    <Wrapper>
      <PageHead>
        <Heading>
          <span className="icon-wrap">
            <Shield size={22} />
          </span>
          <div>
            <h1>All Issues</h1>
            <p>Manage and respond to issues across all users.</p>
          </div>
        </Heading>
      </PageHead>

      <Stats>
        {[
          {
            key: 'all',
            label: 'Total',
            icon: Filter,
            color: '#6366f1',
            tint: 'rgba(99,102,241,0.12)',
          },
          {
            key: 'open',
            label: 'Open',
            icon: CircleDot,
            color: '#3b82f6',
            tint: 'rgba(59,130,246,0.12)',
          },
          {
            key: 'in_progress',
            label: 'In progress',
            icon: Activity,
            color: '#d97706',
            tint: 'rgba(245,158,11,0.12)',
          },
          {
            key: 'resolved',
            label: 'Resolved',
            icon: CheckCircle2,
            color: '#10b981',
            tint: 'rgba(16,185,129,0.12)',
          },
        ].map((s) => {
          const Glyph = s.icon
          return (
            <Stat
              key={s.key}
              $tint={s.tint}
              $color={s.color}
              $active={filter === s.key}
              onClick={() => setFilter(s.key)}
            >
              <span className="icon">
                <Glyph size={16} />
              </span>
              <div>
                <div className="num">{counts[s.key]}</div>
                <div className="lbl">{s.label}</div>
              </div>
            </Stat>
          )
        })}
      </Stats>

      {/* Tier filter chips */}
      <TierFilters>
        <FilterChip
          $active={tierFilter === 'all'}
          onClick={() => setTierFilter('all')}
        >
          All tiers
        </FilterChip>
        <FilterChip
          $active={tierFilter === 'platinum'}
          onClick={() => setTierFilter('platinum')}
        >
          <Gem size={11} /> Platinum
        </FilterChip>
        <FilterChip
          $active={tierFilter === 'gold'}
          onClick={() => setTierFilter('gold')}
        >
          <Crown size={11} /> Gold
        </FilterChip>
        <FilterChip
          $active={tierFilter === 'silver'}
          onClick={() => setTierFilter('silver')}
        >
          <Award size={11} /> Silver
        </FilterChip>
      </TierFilters>

      <Toolbar>
        <SearchWrap>
          <Search size={15} />
          <SearchInput
            placeholder="Search by title, email, or company..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </SearchWrap>

        <SelectWrap>
          <User size={14} />
          <StyledSelect
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
          >
            <option value="all">All assignees</option>
            <option value="me">Assigned to me</option>
            <option value="unassigned">Unassigned</option>
          </StyledSelect>
        </SelectWrap>

        <SelectWrap>
          <Filter size={14} />
          <StyledSelect
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </StyledSelect>
        </SelectWrap>

        <SelectWrap>
          <ArrowUpDown size={14} />
          <StyledSelect value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="priority">Priority (high → low)</option>
            <option value="most_commented">Most commented</option>
          </StyledSelect>
        </SelectWrap>
      </Toolbar>

      {error && <ErrorBanner>Error loading issues: {error}</ErrorBanner>}

      {loading ? (
        <IssueListSkeleton count={6} />
      ) : visible.length === 0 ? (
        <Empty>No issues match your filters.</Empty>
      ) : (
        visible.map((issue) => {
          const status = STATUS_CONFIG[issue.status] || STATUS_CONFIG.open
          const priority =
            PRIORITY_CONFIG[issue.priority] || PRIORITY_CONFIG.normal
          const StatusGlyph = status.icon
          const showSLA =
            issue.slaDeadline &&
            issue.status !== 'resolved' &&
            issue.status !== 'closed'

          return (
            <Row key={issue._id} $tier={issue.companyTier}>
              <StatusIcon $color={status.color}>
                <StatusGlyph size={18} />
              </StatusIcon>

              <RowBody to={buildIssuePath(issue._id)}>
                <h3>{issue.title}</h3>
                <div className="sub">
                  <span className="id">#{issue._id.slice(-6)}</span>
                  <PriorityTag $tint={priority.tint} $color={priority.color}>
                    {issue.priority}
                  </PriorityTag>
                  {issue.companyId?.name && (
                    <span className="company">{issue.companyId.name}</span>
                  )}
                  {issue.companyTier && (
                    <TierBadge tier={issue.companyTier} size="sm" />
                  )}
                  <span className="author">
                    <User size={11} />
                    {issue.createdByEmail}
                  </span>
                  <span className="desktop-only">
                    <Clock
                      size={11}
                      style={{ verticalAlign: 'middle', marginRight: 3 }}
                    />
                    {formatDate(issue.createdAt)}
                  </span>
                  {showSLA && <SLAIndicator deadline={issue.slaDeadline} />}
                </div>
              </RowBody>

              <RowMeta className="desktop-only">
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <MessageSquare size={13} /> {issue.commentCount || 0}
                </span>
              </RowMeta>

              <AssigneeSelect
                value={issue.assignedTo || ''}
                $unassigned={!issue.assignedTo}
                onChange={(e) => handleAssignChange(issue._id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="desktop-only"
              >
                <option value="">Unassigned</option>
                {staff.map((member) => (
                  <option key={member.uid} value={member.uid}>
                    {member.email.split('@')[0]}
                  </option>
                ))}
              </AssigneeSelect>

              <StatusSelect
                value={issue.status}
                onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="open">Open</option>
                <option value="in_progress">In progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </StatusSelect>
            </Row>
          )
        })
      )}
    </Wrapper>
  )
}

export default AdminIssues
