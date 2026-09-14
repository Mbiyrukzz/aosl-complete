import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import styled from 'styled-components'
import { ArrowLeft, FolderKanban, Clock } from 'lucide-react'
import { useProjects } from '../hooks/useProjects'
import { ROUTES } from '../constants/routes'
import { FullScreenLoader } from '../components/Loader'

const Wrapper = styled.div`
  max-width: 800px;
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
  margin-bottom: 1.5rem;
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`
const Panel = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.4rem;
  margin-bottom: 1rem;
`
const ProgressRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
`
const ProgressBar = styled.div`
  flex: 1;
  height: 8px;
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
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  background: rgba(99, 102, 241, 0.12);
  color: #6366f1;
`
const UpdateItem = styled.div`
  padding: 0.9rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  &:last-child {
    border-bottom: none;
  }
  .meta {
    font-size: 0.76rem;
    color: ${({ theme }) => theme.colors.muted};
    margin-top: 0.25rem;
  }
`
const Empty = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.88rem;
`

const STATUS_LABEL = {
  not_started: 'Not started',
  in_progress: 'In progress',
  review: 'In review',
  completed: 'Completed',
  on_hold: 'On hold',
  cancelled: 'Cancelled',
}

const MyProjectDetail = () => {
  const { id } = useParams()
  const { getMyProjectDetail } = useProjects()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    getMyProjectDetail(id)
      .then((data) => active && setProject(data))
      .catch(
        (err) => active && setError(err.response?.data?.error || err.message),
      )
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [id, getMyProjectDetail])

  if (loading) {
    return (
      <Wrapper>
        <BackLink to={ROUTES.MY_PROJECTS}>
          <ArrowLeft size={14} /> Back to Projects
        </BackLink>
        <FullScreenLoader label="Loading project…" />
      </Wrapper>
    )
  }

  if (error || !project) {
    return (
      <Wrapper>
        <BackLink to={ROUTES.MY_PROJECTS}>
          <ArrowLeft size={14} /> Back to Projects
        </BackLink>
        <Empty>{error || 'Project not found.'}</Empty>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <BackLink to={ROUTES.MY_PROJECTS}>
        <ArrowLeft size={14} /> Back to Projects
      </BackLink>

      <Panel>
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem' }}>
          <FolderKanban
            size={18}
            style={{ verticalAlign: 'middle', marginRight: 8 }}
          />
          {project.title}
        </h1>
        <StatusPill>{STATUS_LABEL[project.status] || project.status}</StatusPill>

        {project.description && (
          <p style={{ marginTop: '1rem', lineHeight: 1.6 }}>
            {project.description}
          </p>
        )}

        <ProgressRow>
          <ProgressBar $pct={project.progress || 0}>
            <div />
          </ProgressBar>
          <strong>{project.progress || 0}%</strong>
        </ProgressRow>

        {project.dueDate && (
          <div
            style={{
              marginTop: '0.75rem',
              fontSize: '0.85rem',
              color: 'var(--muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Clock size={14} /> Due{' '}
            {new Date(project.dueDate).toLocaleDateString('en-KE')}
          </div>
        )}
      </Panel>

      <Panel>
        <h3 style={{ marginTop: 0 }}>Progress updates</h3>
        {!project.updates?.length ? (
          <Empty>No updates yet — check back soon.</Empty>
        ) : (
          [...project.updates].reverse().map((u, i) => (
            <UpdateItem key={u._id || i}>
              <div>{u.text}</div>
              <div className="meta">
                {new Date(u.createdAt).toLocaleString('en-KE')}
              </div>
            </UpdateItem>
          ))
        )}
      </Panel>
    </Wrapper>
  )
}

export default MyProjectDetail