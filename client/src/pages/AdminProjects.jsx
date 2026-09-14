import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import {
  FolderKanban,
  Plus,
  Building2,
  Clock,
  ArrowUpRight,
  CircleDot,
  Activity,
  CheckCircle2,
  Pause,
  CircleSlash,
} from 'lucide-react'
import Modal from '../components/Modal'
import AdminProjectForm from '../components/AdminProjectForm'
import { useProjects } from '../hooks/useProjects'
import { useCompanies } from '../hooks/useCompanies'
import { buildAdminProjectPath } from '../constants/routes'

const Wrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
`
const PageHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
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
    font-size: 1.6rem;
  }
  p {
    color: ${({ theme }) => theme.colors.muted};
    margin: 0;
    font-size: 0.86rem;
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
`
const FilterRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`
const FilterChip = styled.button`
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.border};
  background: ${({ theme, $active }) =>
    $active ? 'rgba(99,102,241,0.1)' : theme.colors.surface};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.muted};
  cursor: pointer;
`
const Card = styled(Link)`
  display: block;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.1rem 1.25rem;
  margin-bottom: 0.75rem;
  text-decoration: none;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`
const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;

  h3 {
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: 1rem;
  }
`
const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.muted};

  span {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }
`
const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  background: ${({ $tint }) => $tint};
  color: ${({ $color }) => $color};
`
const ProgressBar = styled.div`
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
const Empty = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.colors.muted};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
`

const STATUS_CONFIG = {
  not_started: {
    color: '#6b7280',
    tint: 'rgba(107,114,128,0.15)',
    icon: CircleDot,
    label: 'Not started',
  },
  in_progress: {
    color: '#d97706',
    tint: 'rgba(245,158,11,0.12)',
    icon: Activity,
    label: 'In progress',
  },
  review: {
    color: '#3b82f6',
    tint: 'rgba(59,130,246,0.12)',
    icon: Clock,
    label: 'In review',
  },
  completed: {
    color: '#10b981',
    tint: 'rgba(16,185,129,0.12)',
    icon: CheckCircle2,
    label: 'Completed',
  },
  on_hold: {
    color: '#f59e0b',
    tint: 'rgba(245,158,11,0.12)',
    icon: Pause,
    label: 'On hold',
  },
  cancelled: {
    color: '#6b7280',
    tint: 'rgba(107,114,128,0.15)',
    icon: CircleSlash,
    label: 'Cancelled',
  },
}

const AdminProjects = () => {
  const { projects, loading, createProject } = useProjects()
  const { companies } = useCompanies()
  const [createOpen, setCreateOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')

  const visible = useMemo(() => {
    if (statusFilter === 'all') return projects
    return projects.filter((p) => p.status === statusFilter)
  }, [projects, statusFilter])

  const handleCreate = async (data) => {
    await createProject(data)
    setCreateOpen(false)
  }

  return (
    <Wrapper>
      <PageHead>
        <Heading>
          <span className="icon-wrap">
            <FolderKanban size={22} />
          </span>
          <div>
            <h1>Projects</h1>
            <p>Track client work from kickoff to delivery.</p>
          </div>
        </Heading>
        <NewButton onClick={() => setCreateOpen(true)}>
          <Plus size={16} /> Start project
        </NewButton>
      </PageHead>

      <FilterRow>
        <FilterChip
          $active={statusFilter === 'all'}
          onClick={() => setStatusFilter('all')}
        >
          All
        </FilterChip>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <FilterChip
            key={key}
            $active={statusFilter === key}
            onClick={() => setStatusFilter(key)}
          >
            {cfg.label}
          </FilterChip>
        ))}
      </FilterRow>

      {loading ? (
        <Empty>Loading projects…</Empty>
      ) : visible.length === 0 ? (
        <Empty>No projects match this filter.</Empty>
      ) : (
        visible.map((p) => {
          const cfg = STATUS_CONFIG[p.status] || STATUS_CONFIG.not_started
          const Icon = cfg.icon
          return (
            <Card key={p._id} to={buildAdminProjectPath(p._id)}>
              <CardTop>
                <h3>{p.title}</h3>
                <StatusPill $tint={cfg.tint} $color={cfg.color}>
                  <Icon size={11} /> {cfg.label}
                </StatusPill>
              </CardTop>
              <Meta>
                <span>
                  <Building2 size={13} />{' '}
                  {p.companyId?.name || 'Unknown company'}
                </span>
                {p.dueDate && (
                  <span>
                    <Clock size={13} /> Due{' '}
                    {new Date(p.dueDate).toLocaleDateString('en-KE')}
                  </span>
                )}
                <span style={{ marginLeft: 'auto' }}>
                  View <ArrowUpRight size={12} />
                </span>
              </Meta>
              <ProgressBar $pct={p.progress || 0}>
                <div />
              </ProgressBar>
            </Card>
          )
        })
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Start a new project"
      >
        <AdminProjectForm
          companies={companies}
          onSubmit={handleCreate}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>
    </Wrapper>
  )
}

export default AdminProjects