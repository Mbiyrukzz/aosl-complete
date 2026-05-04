import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import styled from 'styled-components'
import { ArrowLeft, Send } from 'lucide-react'
import { useIssues } from '../hooks/useIssues'
import { useUser } from '../hooks/useUser'
import { ROUTES } from '../constants/routes'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const Attachments = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
`

const Thumb = styled.a`
  display: block;
  aspect-ratio: 1;
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.2s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`

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
  font-size: 0.9rem;
  margin-bottom: 1rem;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`

const Card = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.75rem;
  margin-bottom: 1.5rem;
`

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 0.75rem 0;
`

const Meta = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 1.5rem;
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

const Description = styled.p`
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
  white-space: pre-wrap;
`

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.15rem;
  margin: 0 0 1rem 0;
`

const Comment = styled.div`
  padding: 1rem 1.2rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: 0.75rem;

  .author {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }

  .time {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.75rem;
    margin-left: 0.5rem;
  }

  .text {
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.5;
    white-space: pre-wrap;
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const Textarea = styled.textarea`
  padding: 0.75rem 1rem;
  min-height: 90px;
  resize: vertical;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 0.95rem;
`

const Button = styled.button`
  align-self: flex-end;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.2rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
  }
`

const IssueDetail = () => {
  const { id } = useParams()
  const { issues, loading, addComment } = useIssues()
  const { user } = useUser()

  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const issue = issues.find((i) => i._id === id)

  // Issues are still loading from initial fetch
  if (loading && !issue)
    return (
      <Wrapper>
        <p>Loading...</p>
      </Wrapper>
    )

  // Loaded but not found — likely a deleted or non-existent issue
  if (!loading && !issue) return <Navigate to={ROUTES.SUPPORT} replace />

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    setSubmitting(true)
    try {
      await addComment(id, comment.trim())
      setComment('')
    } catch (err) {
      alert('Failed to post comment: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Wrapper>
      <BackLink to={ROUTES.SUPPORT}>
        <ArrowLeft size={16} /> Back to issues
      </BackLink>

      <Card>
        <Title>{issue.title}</Title>
        <Meta>
          <Badge>{issue.status.replace('_', ' ')}</Badge>
          <Badge>{issue.priority}</Badge>
          <span>Created by {issue.createdByEmail}</span>
          <span>{new Date(issue.createdAt).toLocaleString()}</span>
        </Meta>
        <Description>{issue.description}</Description>
      </Card>
      {issue.attachments?.length > 0 && (
        <Attachments>
          {issue.attachments.map((att) => (
            <Thumb
              key={att._id || att.filename}
              href={`${API_BASE}${att.url}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={`${API_BASE}${att.url}`} alt={att.originalName} />
            </Thumb>
          ))}
        </Attachments>
      )}

      <Card>
        <SectionTitle>Comments ({issue.comments?.length || 0})</SectionTitle>

        {(issue.comments || []).map((c) => (
          <Comment key={c._id || c.createdAt}>
            <div className="author">
              {c.authorEmail === user?.email ? 'You' : c.authorEmail}
              <span className="time">
                {new Date(c.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="text">{c.text}</div>
          </Comment>
        ))}

        <Form onSubmit={handleAddComment}>
          <Textarea
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button type="submit" disabled={submitting || !comment.trim()}>
            <Send size={16} /> {submitting ? 'Posting...' : 'Post comment'}
          </Button>
        </Form>
      </Card>
    </Wrapper>
  )
}

export default IssueDetail
