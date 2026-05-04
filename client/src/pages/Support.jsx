import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import {
  Plus,
  MessageSquare,
  Search,
  CircleDot,
  Activity,
  CheckCircle2,
  CircleSlash,
  Inbox,
  ArrowUpDown,
} from 'lucide-react'
import { useIssues } from '../hooks/useIssues'
import { buildIssuePath } from '../constants/routes'
import Modal from '../components/Modal'
import IssueForm from '../components/IssueForm'
import IssueListSkeleton from '../components/IssueListSkeleton'

/* ---------- Layout ---------- */

const Wrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`

const PageHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
`

const Heading = styled.div`
  h1 {
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 0.3rem 0;
    font-size: 1.85rem;
    letter-spacing: -0.02em;
  }
  p {
    color: ${({ theme }) => theme.colors.muted};
    margin: 0;
    font-size: 0.92rem;
  }
`

const NewButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 1.15rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition:
    opacity 0.2s ease,
    transform 0.15s ease;
  flex-shrink: 0;

  &:hover {
    opacity: 0.92;
    transform: translateY(-1px);
  }
`

/* ---------- Stats strip ---------- */

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

const Stat = styled.button`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.85rem;
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
    width: 38px;
    height: 38px;
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ $tint }) => $tint || 'rgba(107,114,128,0.15)'};
    color: ${({ $color }) => $color || '#6b7280'};
    flex-shrink: 0;
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
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-top: 0.2rem;
  }
`

const SortWrap = styled.div`
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

const SortSelect = styled.select`
  padding: 0.55rem 0.7rem 0.55rem 2rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.85rem;
  font-family: inherit;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.6rem center;
  padding-right: 1.8rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

/* ---------- Toolbar (filters + search) ---------- */

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`

const Tabs = styled.div`
  display: inline-flex;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 3px;
  overflow-x: auto;
`

const Tab = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.85rem;
  border: none;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.background : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.text : theme.colors.muted};
  font-size: 0.82rem;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }

  .count {
    padding: 1px 6px;
    border-radius: 999px;
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.border};
    color: ${({ $active, theme }) => ($active ? 'white' : theme.colors.muted)};
    font-size: 0.7rem;
    font-weight: 700;
    line-height: 1.4;
    min-width: 18px;
    text-align: center;
  }
`

const SearchWrap = styled.div`
  position: relative;
  flex: 1;
  min-width: 180px;

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
  transition: border-color 0.15s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
  }
`

/* ---------- Issue rows ---------- */

const ErrorBanner = styled.div`
  padding: 0.75rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: 1rem;
  font-size: 0.9rem;
`

const Empty = styled.div`
  text-align: center;
  padding: 4rem 1rem;
  color: ${({ theme }) => theme.colors.muted};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};

  .empty-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.background};
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.muted};
  }

  p {
    margin: 0 0 1.25rem 0;
    font-size: 0.95rem;
  }
`

const IssueRow = styled(Link)`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: 0.5rem;
  text-decoration: none;
  color: inherit;
  position: relative;
  transition:
    border-color 0.18s ease,
    transform 0.15s ease,
    background 0.18s ease;

  /* Status accent bar on the left edge */
  &::before {
    content: '';
    position: absolute;
    left: -1px;
    top: 12px;
    bottom: 12px;
    width: 3px;
    border-radius: 2px;
    background: ${({ $accent }) => $accent || 'transparent'};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateX(2px);
  }
`

const StatusIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color};
  flex-shrink: 0;
`

const IssueBody = styled.div`
  min-width: 0; /* allow truncation */

  .top {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
  }

  h3 {
    color: ${({ theme }) => theme.colors.text};
    margin: 0;
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
    gap: 0.6rem;
    align-items: center;
  }

  .id {
    font-family: ui-monospace, monospace;
    font-size: 0.72rem;
    color: ${({ theme }) => theme.colors.muted};
    opacity: 0.7;
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
  flex-shrink: 0;
`

const RowMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.8rem;
  flex-shrink: 0;

  .meta-item {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }

  @media (max-width: 600px) {
    display: none;
  }
`

/* ---------- Helpers ---------- */

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

const formatDate = (date) => {
  const d = new Date(date)
  const now = new Date()
  const diffDay = Math.floor((now - d) / 86400000)
  if (diffDay === 0) return 'today'
  if (diffDay === 1) return 'yesterday'
  if (diffDay < 7) return `${diffDay}d ago`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'resolved', label: 'Resolved' },
]

/* ---------- Component ---------- */

const Support = () => {
  const { issues, loading, error, createIssue } = useIssues()
  const [modalOpen, setModalOpen] = useState(false)
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('newest')
  const [query, setQuery] = useState('')

  const SORT_OPTIONS = [
    { key: 'newest', label: 'Newest first' },
    { key: 'oldest', label: 'Oldest first' },
    { key: 'priority', label: 'Priority (high → low)' },
    { key: 'most_commented', label: 'Most commented' },
  ]

  const PRIORITY_ORDER = { urgent: 4, high: 3, normal: 2, low: 1 }

  // Counts per status (for the tab badges)
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
      if (q && !i.title.toLowerCase().includes(q)) return false
      return true
    })

    const sorted = [...filtered].sort((a, b) => {
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

    return sorted
  }, [issues, filter, query, sort])

  const handleCreate = async (form) => {
    await createIssue(form)
    setModalOpen(false)
  }

  return (
    <Wrapper>
      <PageHead>
        <Heading>
          <h1>Issues</h1>
          <p>Track, manage, and respond to support requests.</p>
        </Heading>
        <NewButton onClick={() => setModalOpen(true)}>
          <Plus size={16} /> New issue
        </NewButton>
      </PageHead>

      {/* Stats strip */}
      <Stats>
        <Stat
          $tint="rgba(59,130,246,0.12)"
          $color="#3b82f6"
          $active={filter === 'open'}
          onClick={() => setFilter('open')}
        >
          <span className="icon">
            <CircleDot size={18} />
          </span>
          <div>
            <div className="num">{counts.open}</div>
            <div className="lbl">Open</div>
          </div>
        </Stat>
        <Stat
          $tint="rgba(245,158,11,0.12)"
          $color="#d97706"
          $active={filter === 'in_progress'}
          onClick={() => setFilter('in_progress')}
        >
          <span className="icon">
            <Activity size={18} />
          </span>
          <div>
            <div className="num">{counts.in_progress}</div>
            <div className="lbl">In progress</div>
          </div>
        </Stat>
        <Stat
          $tint="rgba(16,185,129,0.12)"
          $color="#10b981"
          $active={filter === 'resolved'}
          onClick={() => setFilter('resolved')}
        >
          <span className="icon">
            <CheckCircle2 size={18} />
          </span>
          <div>
            <div className="num">{counts.resolved}</div>
            <div className="lbl">Resolved</div>
          </div>
        </Stat>
      </Stats>

      {/* Toolbar */}
      <Toolbar>
        <Tabs>
          {FILTERS.map((f) => (
            <Tab
              key={f.key}
              $active={filter === f.key}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              <span className="count">{counts[f.key]}</span>
            </Tab>
          ))}
        </Tabs>
        <SearchWrap>
          <Search size={15} />
          <SearchInput
            placeholder="Search issues..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </SearchWrap>
        <SortWrap>
          <ArrowUpDown size={14} />
          <SortSelect value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </SortSelect>
        </SortWrap>
      </Toolbar>

      {error && <ErrorBanner>Error loading issues: {error}</ErrorBanner>}

      {loading ? (
        <IssueListSkeleton count={5} />
      ) : visible.length === 0 ? (
        <Empty>
          <div className="empty-icon">
            <Inbox size={26} />
          </div>
          <p>
            {issues.length === 0
              ? "You don't have any issues yet."
              : 'No issues match your filters.'}
          </p>
          {issues.length === 0 && (
            <NewButton onClick={() => setModalOpen(true)}>
              <Plus size={16} /> Create your first issue
            </NewButton>
          )}
        </Empty>
      ) : (
        visible.map((issue) => {
          const status = STATUS_CONFIG[issue.status] || STATUS_CONFIG.open
          const priority =
            PRIORITY_CONFIG[issue.priority] || PRIORITY_CONFIG.normal
          const StatusGlyph = status.icon

          return (
            <IssueRow
              key={issue._id}
              to={buildIssuePath(issue._id)}
              $accent={status.color}
            >
              <StatusIcon $color={status.color}>
                <StatusGlyph size={18} />
              </StatusIcon>

              <IssueBody>
                <div className="top">
                  <h3>{issue.title}</h3>
                </div>
                <div className="sub">
                  <span className="id">#{issue._id.slice(-6)}</span>
                  <PriorityTag $tint={priority.tint} $color={priority.color}>
                    {issue.priority}
                  </PriorityTag>
                  <span>opened {formatDate(issue.createdAt)}</span>
                </div>
              </IssueBody>

              <RowMeta>
                <span className="meta-item">
                  <MessageSquare size={14} />
                  {issue.commentCount || 0}
                </span>
              </RowMeta>
            </IssueRow>
          )
        })
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create new issue"
      >
        <IssueForm
          onSubmit={handleCreate}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </Wrapper>
  )
}

export default Support
