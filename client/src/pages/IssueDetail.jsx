import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import styled from 'styled-components'
import {
  ArrowLeft,
  Send,
  Paperclip,
  User,
  Clock,
  Flag,
  CircleDot,
  CheckCircle2,
  CircleSlash,
  Activity,
  Share2,
} from 'lucide-react'
import { useIssues } from '../hooks/useIssues'
import { useUser } from '../hooks/useUser'
import { ROUTES } from '../constants/routes'
import IssueDetailSkeleton from '../components/IssueDetailSkeleton'
import ShareModal from '../components/ShareModal'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

/* ---------- Layout ---------- */

const Wrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
`

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: ${({ theme }) => theme.colors.muted};
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`

const IssueId = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.8rem;
  font-family: ui-monospace, 'SF Mono', Monaco, monospace;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 2rem;

  @media (max-width: 880px) {
    grid-template-columns: 1fr;
  }
`

const ShareButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.9rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 500;
  font-size: 0.85rem;
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.18s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

/* ---------- Header ---------- */

const Header = styled.header`
  margin-bottom: 2rem;
`

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  font-size: 2rem;
  line-height: 1.2;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
`

const Subline = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.85rem;
`

const Dot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.6;
`

/* ---------- Status Pill ---------- */

const StatusPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;

  background: ${({ $status }) => {
    const map = {
      open: 'rgba(59, 130, 246, 0.12)',
      in_progress: 'rgba(245, 158, 11, 0.12)',
      resolved: 'rgba(16, 185, 129, 0.12)',
      closed: 'rgba(107, 114, 128, 0.12)',
    }
    return map[$status] || map.open
  }};
  color: ${({ $status }) => {
    const map = {
      open: '#3b82f6',
      in_progress: '#d97706',
      resolved: '#10b981',
      closed: '#6b7280',
    }
    return map[$status] || map.open
  }};
`

/* ---------- Conversation timeline ---------- */

const Thread = styled.div`
  position: relative;
  padding-left: 2.5rem;

  &::before {
    content: '';
    position: absolute;
    left: 1rem;
    top: 0.5rem;
    bottom: 0.5rem;
    width: 2px;
    background: ${({ theme }) => theme.colors.border};
  }
`

const Entry = styled.div`
  position: relative;
  margin-bottom: 1.5rem;

  &::before {
    content: '';
    position: absolute;
    left: -1.85rem;
    top: 0.85rem;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.background};
    border: 2px solid
      ${({ theme, $accent }) =>
        $accent ? theme.colors.primary : theme.colors.border};
  }
`

const EntryCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
`

const EntryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1.1rem;
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.85rem;

  .author {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
  }

  .time {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.78rem;
    margin-left: auto;
  }
`

const Avatar = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
`

const EntryBody = styled.div`
  padding: 1.1rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.65;
  white-space: pre-wrap;
  font-size: 0.95rem;
`

/* ---------- Comment composer ---------- */

const Composer = styled.form`
  position: relative;
  margin-top: 0.5rem;
`

const ComposerCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const Textarea = styled.textarea`
  width: 100%;
  padding: 1rem 1.1rem;
  min-height: 90px;
  resize: vertical;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 0.95rem;
  line-height: 1.5;

  &:focus {
    outline: none;
  }
`

const ComposerFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0.5rem 0.6rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    opacity: 0.9;
  }
`

/* ---------- Sidebar ---------- */

const SidePanel = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

const PanelSection = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.1rem;
`

const PanelTitle = styled.h3`
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0 0 0.85rem 0;
  font-weight: 700;
`

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.4rem 0;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text};

  svg {
    color: ${({ theme }) => theme.colors.muted};
    flex-shrink: 0;
  }

  .label {
    color: ${({ theme }) => theme.colors.muted};
    margin-right: auto;
  }

  .value {
    font-weight: 500;
  }
`

const PriorityBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;

  background: ${({ $priority }) =>
    ({
      low: 'rgba(107, 114, 128, 0.15)',
      normal: 'rgba(59, 130, 246, 0.15)',
      high: 'rgba(245, 158, 11, 0.15)',
      urgent: 'rgba(239, 68, 68, 0.15)',
    })[$priority] || 'rgba(107, 114, 128, 0.15)'};
  color: ${({ $priority }) =>
    ({
      low: '#6b7280',
      normal: '#3b82f6',
      high: '#d97706',
      urgent: '#ef4444',
    })[$priority] || '#6b7280'};
`

/* ---------- Attachments ---------- */

const Attachments = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`

const Thumb = styled.a`
  display: block;
  aspect-ratio: 1;
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  position: relative;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
  }
`

/* ---------- Helpers ---------- */

const initials = (email) => (email ? email.slice(0, 2).toUpperCase() : '??')

const formatTime = (date) => {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now - d
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  if (diffDay < 7) return `${diffDay}d ago`
  return d.toLocaleDateString()
}

const statusIcon = (status) => {
  switch (status) {
    case 'open':
      return <CircleDot size={13} />
    case 'in_progress':
      return <Activity size={13} />
    case 'resolved':
      return <CheckCircle2 size={13} />
    case 'closed':
      return <CircleSlash size={13} />
    default:
      return <CircleDot size={13} />
  }
}

const resolveAssignee = (assignedTo, staffList) => {
  if (!assignedTo) return 'Unassigned'
  // Clients don't fetch the staff list — show a friendly fallback
  if (!staffList || staffList.length === 0) return 'A staff member'
  const member = staffList.find((s) => s.uid === assignedTo)
  return member ? member.email.split('@')[0] : 'A staff member'
}

/* ---------- Component ---------- */

const IssueDetail = () => {
  const { id } = useParams()
  const { staff, issues, loading, addComment } = useIssues()
  const { user } = useUser()

  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)

  const issue = issues.find((i) => i._id === id)

  // Guard FIRST — don't access issue.* before we know it exists
  if (loading && !issue) return <IssueDetailSkeleton />
  if (!loading && !issue) return <Navigate to={ROUTES.SUPPORT} replace />

  const assigneeLabel = resolveAssignee(issue.assignedTo, staff)

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
      <TopBar>
        <BackLink to={ROUTES.SUPPORT}>
          <ArrowLeft size={16} /> All issues
        </BackLink>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShareButton onClick={() => setShareOpen(true)}>
            <Share2 size={14} /> Share
          </ShareButton>
          <IssueId>#{issue._id.slice(-6)}</IssueId>
        </div>
      </TopBar>

      <Header>
        <div style={{ marginBottom: '0.75rem' }}>
          <StatusPill $status={issue.status}>
            {statusIcon(issue.status)}
            {issue.status.replace('_', ' ')}
          </StatusPill>
        </div>
        <Title>{issue.title}</Title>
        <Subline>
          <span>opened by {issue.createdByEmail}</span>
          <Dot />
          <span>{formatTime(issue.createdAt)}</span>
          <Dot />
          <span>{issue.comments?.length || 0} comments</span>
        </Subline>
      </Header>

      <Grid>
        {/* Left column — conversation */}
        <div>
          <Thread>
            {/* Original issue */}
            <Entry $accent>
              <EntryCard>
                <EntryHeader>
                  <Avatar>{initials(issue.createdByEmail)}</Avatar>
                  <span className="author">
                    {issue.createdByEmail === user?.email
                      ? 'You'
                      : issue.createdByEmail}
                  </span>
                  <span className="time">
                    opened this issue · {formatTime(issue.createdAt)}
                  </span>
                </EntryHeader>
                <EntryBody>{issue.description}</EntryBody>
              </EntryCard>
            </Entry>

            {/* Comments */}
            {(issue.comments || []).map((c) => (
              <Entry key={c._id || c.createdAt}>
                <EntryCard>
                  <EntryHeader>
                    <Avatar>{initials(c.authorEmail)}</Avatar>
                    <span className="author">
                      {c.authorEmail === user?.email ? 'You' : c.authorEmail}
                    </span>
                    <span className="time">{formatTime(c.createdAt)}</span>
                  </EntryHeader>
                  <EntryBody>{c.text}</EntryBody>
                </EntryCard>
              </Entry>
            ))}

            {/* Composer */}
            <Entry>
              <Composer onSubmit={handleAddComment}>
                <ComposerCard>
                  <Textarea
                    placeholder="Leave a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <ComposerFooter>
                    <Button
                      type="submit"
                      disabled={submitting || !comment.trim()}
                    >
                      <Send size={14} />
                      {submitting ? 'Posting...' : 'Post comment'}
                    </Button>
                  </ComposerFooter>
                </ComposerCard>
              </Composer>
            </Entry>
          </Thread>
        </div>

        {/* Right column — metadata */}
        <SidePanel>
          <PanelSection>
            <PanelTitle>Details</PanelTitle>
            <InfoRow>
              <Flag size={14} />
              <span className="label">Priority</span>
              <PriorityBadge $priority={issue.priority}>
                {issue.priority}
              </PriorityBadge>
            </InfoRow>
            <InfoRow>
              <User size={14} />
              <span className="label">Assignee</span>
              <span className="value">{assigneeLabel}</span>
            </InfoRow>
            <InfoRow>
              <Clock size={14} />
              <span className="label">Updated</span>
              <span className="value">{formatTime(issue.updatedAt)}</span>
            </InfoRow>
          </PanelSection>

          {issue.attachments?.length > 0 && (
            <PanelSection>
              <PanelTitle>
                <Paperclip
                  size={11}
                  style={{ display: 'inline', marginRight: 4 }}
                />
                Attachments ({issue.attachments.length})
              </PanelTitle>
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
            </PanelSection>
          )}
        </SidePanel>
      </Grid>
      <ShareModal
        issueId={issue._id}
        open={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </Wrapper>
  )
}

export default IssueDetail
