import { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Plus, MessageSquare, Clock } from 'lucide-react'
import { useIssues } from '../hooks/useIssues'
import { buildIssuePath } from '../constants/routes'
import Modal from '../components/Modal'
import IssueForm from '../components/IssueForm'

const Wrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`

const NewButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.2rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`

const ErrorBanner = styled.div`
  padding: 0.75rem 1rem;
  background: #fee2e2;
  color: #991b1b;
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: 1rem;
`

const Empty = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.colors.muted};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
`

const IssueLink = styled(Link)`
  display: block;
  padding: 1.1rem 1.4rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: 0.75rem;
  text-decoration: none;
  color: inherit;
  transition:
    border-color 0.2s ease,
    transform 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
  }

  h3 {
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 0.5rem 0;
    font-size: 1.05rem;
  }

  .meta {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.85rem;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .meta-item {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }
`

const Badge = styled.span`
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
`

const Support = () => {
  const { issues, loading, error, createIssue } = useIssues()
  const [modalOpen, setModalOpen] = useState(false)

  const handleCreate = async (form) => {
    await createIssue(form)
    setModalOpen(false)
    // The new issue will appear in the list automatically via the socket event
  }

  return (
    <Wrapper>
      <Header>
        <Title>Support</Title>
        <NewButton onClick={() => setModalOpen(true)}>
          <Plus size={18} /> New issue
        </NewButton>
      </Header>

      {error && <ErrorBanner>Error loading issues: {error}</ErrorBanner>}

      {loading ? (
        <p>Loading...</p>
      ) : issues.length === 0 ? (
        <Empty>
          <p style={{ marginBottom: '1rem' }}>You don't have any issues yet.</p>
          <NewButton onClick={() => setModalOpen(true)}>
            <Plus size={18} /> Create your first issue
          </NewButton>
        </Empty>
      ) : (
        issues.map((issue) => (
          <IssueLink key={issue._id} to={buildIssuePath(issue._id)}>
            <h3>{issue.title}</h3>
            <div className="meta">
              <Badge>{issue.status.replace('_', ' ')}</Badge>
              <Badge>{issue.priority}</Badge>
              <span className="meta-item">
                <Clock size={14} />
                {new Date(issue.createdAt).toLocaleDateString()}
              </span>
              <span className="meta-item">
                <MessageSquare size={14} />
                {issue.commentCount || 0}
              </span>
            </div>
          </IssueLink>
        ))
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
