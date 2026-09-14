import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import {
  ArrowLeft,
  FolderKanban,
  Building2,
  Edit2,
  Trash2,
  Clock,
  MessageSquarePlus,
} from 'lucide-react'
import Modal from '../components/Modal'
import AdminProjectForm from '../components/AdminProjectForm'
import { useProjects } from '../hooks/useProjects'
import { ROUTES, buildAdminCompanyPath } from '../constants/routes'
import { FullScreenLoader } from '../components/Loader'

const Wrapper = styled.div`
  max-width: 900px;
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
const PageHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`
const Heading = styled.div`
  h1 {
    margin: 0 0 0.3rem 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.5rem;
  }
  .company {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.86rem;
    text-decoration: none;
  }
  .company:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`
const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`
const Btn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  font-size: 0.86rem;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
`
const DangerBtn = styled(Btn)`
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.25);
`
const Panel = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.25rem;
  margin-bottom: 1rem;
`
const ProgressRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.75rem;
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
const StatusSelect = styled.select`
  padding: 0.5rem 0.8rem;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  cursor: pointer;
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
const AddUpdateForm = styled.form`
  display: flex;
  gap: 0.6rem;
  margin-top: 1rem;
`
const UpdateInput = styled.textarea`
  flex: 1;
  padding: 0.6rem 0.8rem;
  min-height: 44px;
  resize: vertical;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
`
const PostBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1rem;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  cursor: pointer;
  align-self: flex-start;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`
const Empty = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.88rem;
`

const AdminProjectDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProjectDetail, updateProject, addProjectUpdate, deleteProject } =
    useProjects()

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [updateText, setUpdateText] = useState('')
  const [posting, setPosting] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getProjectDetail(id)
      setProject(data)
    } finally {
      setLoading(false)
    }
  }, [id, getProjectDetail])

  useEffect(() => {
    refresh()
  }, [refresh])

  const handleStatusChange = async (e) => {
    const updated = await updateProject(id, { status: e.target.value })
    setProject(updated)
  }

  const handleEditSave = async (data) => {
    const updated = await updateProject(id, data)
    setProject(updated)
    setEditOpen(false)
  }

  const handleDelete = async () => {
    if (!confirm(`Delete project "${project.title}"? This cannot be undone.`))
      return
    await deleteProject(id)
    navigate(ROUTES.ADMIN_PROJECTS)
  }

  const handlePostUpdate = async (e) => {
    e.preventDefault()
    if (!updateText.trim()) return
    setPosting(true)
    try {
      const updated = await addProjectUpdate(id, { text: updateText.trim() })
      setProject(updated)
      setUpdateText('')
    } finally {
      setPosting(false)
    }
  }

  if (loading || !project) {
    return (
      <Wrapper>
        <BackLink to={ROUTES.ADMIN_PROJECTS}>
          <ArrowLeft size={14} /> Back to Projects
        </BackLink>
        <FullScreenLoader label="Loading project…" />
      </Wrapper>
    )
  }

  const companyId = project.companyId?._id || project.companyId

  return (
    <Wrapper>
      <BackLink to={ROUTES.ADMIN_PROJECTS}>
        <ArrowLeft size={14} /> Back to Projects
      </BackLink>

      <PageHead>
        <Heading>
          <h1>
            <FolderKanban
              size={20}
              style={{ verticalAlign: 'middle', marginRight: 8 }}
            />
            {project.title}
          </h1>
          {companyId && (
            <Link className="company" to={buildAdminCompanyPath(companyId)}>
              <Building2 size={13} /> {project.companyId?.name || 'View company'}
            </Link>
          )}
        </Heading>
        <Actions>
          <Btn onClick={() => setEditOpen(true)}>
            <Edit2 size={14} /> Edit
          </Btn>
          <DangerBtn onClick={handleDelete}>
            <Trash2 size={14} /> Delete
          </DangerBtn>
        </Actions>
      </PageHead>

      <Panel>
        {project.description && (
          <p style={{ margin: 0, lineHeight: 1.6 }}>{project.description}</p>
        )}

        <ProgressRow>
          <ProgressBar $pct={project.progress || 0}>
            <div />
          </ProgressBar>
          <strong>{project.progress || 0}%</strong>
        </ProgressRow>

        <div
          style={{
            marginTop: '1rem',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <label style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
            Status
          </label>
          <StatusSelect value={project.status} onChange={handleStatusChange}>
            <option value="not_started">Not started</option>
            <option value="in_progress">In progress</option>
            <option value="review">In review</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On hold</option>
            <option value="cancelled">Cancelled</option>
          </StatusSelect>

          {project.dueDate && (
            <span
              style={{
                fontSize: '0.82rem',
                color: 'var(--muted)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <Clock size={13} /> Due{' '}
              {new Date(project.dueDate).toLocaleDateString('en-KE')}
            </span>
          )}
        </div>

        {project.notes && (
          <div
            style={{
              marginTop: '1rem',
              fontSize: '0.85rem',
              color: 'var(--muted)',
              whiteSpace: 'pre-wrap',
            }}
          >
            <strong>Internal notes:</strong> {project.notes}
          </div>
        )}
      </Panel>

      <Panel>
        <h3 style={{ marginTop: 0 }}>
          <MessageSquarePlus
            size={16}
            style={{ verticalAlign: 'middle', marginRight: 6 }}
          />
          Updates
        </h3>

        {!project.updates?.length ? (
          <Empty>No updates posted yet.</Empty>
        ) : (
          [...project.updates].reverse().map((u, i) => (
            <UpdateItem key={u._id || i}>
              <div>{u.text}</div>
              <div className="meta">
                {u.authorName || 'Staff'} ·{' '}
                {new Date(u.createdAt).toLocaleString('en-KE')}
              </div>
            </UpdateItem>
          ))
        )}

        <AddUpdateForm onSubmit={handlePostUpdate}>
          <UpdateInput
            value={updateText}
            onChange={(e) => setUpdateText(e.target.value)}
            placeholder="Post a progress update for the client…"
          />
          <PostBtn type="submit" disabled={posting}>
            {posting ? 'Posting…' : 'Post'}
          </PostBtn>
        </AddUpdateForm>
      </Panel>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit project"
      >
        <AdminProjectForm
          initial={project}
          lockedCompanyId={companyId}
          onSubmit={handleEditSave}
          onCancel={() => setEditOpen(false)}
        />
      </Modal>
    </Wrapper>
  )
}

export default AdminProjectDetail