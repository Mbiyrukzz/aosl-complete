import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { FolderKanban, ArrowUpRight, Clock } from 'lucide-react'
import { useProjects } from '../hooks/useProjects'
import { buildMyProjectPath } from '../constants/routes'

const Wrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
`
const Heading = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;

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
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.5rem;
  }
`
const Card = styled(Link)`
  display: block;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.1rem 1.25rem;
  margin-bottom: 0.75rem;
  text-decoration: none;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  h3 {
    margin: 0 0 0.4rem 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: 1rem;
  }
`
const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.9rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.muted};
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
const StatusPill = styled.span`
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  background: rgba(99, 102, 241, 0.12);
  color: #6366f1;
`
const Empty = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.colors.muted};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
`

const STATUS_LABEL = {
  not_started: 'Not started',
  in_progress: 'In progress',
  review: 'In review',
  completed: 'Completed',
  on_hold: 'On hold',
  cancelled: 'Cancelled',
}

const MyProjects = () => {
  const { myProjects, myProjectsLoading } = useProjects()

  return (
    <Wrapper>
      <Heading>
        <span className="icon-wrap">
          <FolderKanban size={22} />
        </span>
        <h1>Your Projects</h1>
      </Heading>

      {myProjectsLoading ? (
        <Empty>Loading your projects…</Empty>
      ) : myProjects.length === 0 ? (
        <Empty>
          No projects yet. When we start work for you, it'll show up here.
        </Empty>
      ) : (
        myProjects.map((p) => (
          <Card key={p._id} to={buildMyProjectPath(p._id)}>
            <h3>{p.title}</h3>
            <Meta>
              <StatusPill>{STATUS_LABEL[p.status] || p.status}</StatusPill>
              {p.dueDate && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <Clock size={13} /> Due{' '}
                  {new Date(p.dueDate).toLocaleDateString('en-KE')}
                </span>
              )}
              <span
                style={{
                  marginLeft: 'auto',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                }}
              >
                View <ArrowUpRight size={12} />
              </span>
            </Meta>
            <ProgressBar $pct={p.progress || 0}>
              <div />
            </ProgressBar>
          </Card>
        ))
      )}
    </Wrapper>
  )
}

export default MyProjects