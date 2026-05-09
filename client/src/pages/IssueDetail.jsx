import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import styled, { css } from 'styled-components'
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
  Building2,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react'
import { useIssues } from '../hooks/useIssues'
import { useUser } from '../hooks/useUser'
import { ROUTES } from '../constants/routes'
import IssueDetailSkeleton from '../components/IssueDetailSkeleton'
import ShareModal from '../components/ShareModal'
import TierBadge from '../components/TierBadge'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

/* ─────────────────────────────────────────────
   Layout
───────────────────────────────────────────── */

const Wrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
`

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.75rem;
`

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: ${({ theme }) => theme.colors.muted};
  text-decoration: none;
  font-size: 0.88rem;
  transition: color 0.15s ease;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`

const TopBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const IssueId = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.78rem;
  font-family: ui-monospace, 'SF Mono', Monaco, monospace;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
`

const ShareButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.9rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 500;
  font-size: 0.83rem;
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.15s ease;
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

/* ─────────────────────────────────────────────
   Company / tier banner
───────────────────────────────────────────── */

const TIER_COLORS = {
  platinum: {
    color: '#6366f1',
    tint: 'rgba(99,102,241,0.08)',
    border: 'rgba(99,102,241,0.25)',
  },
  gold: {
    color: '#d97706',
    tint: 'rgba(217,119,6,0.08)',
    border: 'rgba(217,119,6,0.25)',
  },
  silver: {
    color: '#94a3b8',
    tint: 'rgba(148,163,184,0.08)',
    border: 'rgba(148,163,184,0.2)',
  },
}

const CompanyBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: 1.25rem;
  background: ${({ $tier }) => TIER_COLORS[$tier]?.tint || 'transparent'};
  border: 1px solid
    ${({ $tier, theme }) => TIER_COLORS[$tier]?.border || theme.colors.border};

  svg {
    color: ${({ theme }) => theme.colors.muted};
    flex-shrink: 0;
  }

  .company-name {
    font-weight: 700;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.text};
  }

  .divider {
    width: 1px;
    height: 14px;
    background: ${({ theme }) => theme.colors.border};
  }
`

/* ─────────────────────────────────────────────
   Escalation banner
───────────────────────────────────────────── */

const EscalatedBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem 1rem;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: 1.25rem;
  font-size: 0.83rem;
  font-weight: 600;
  color: #ef4444;
  svg {
    flex-shrink: 0;
  }
`

/* ─────────────────────────────────────────────
   Header
───────────────────────────────────────────── */

const Header = styled.header`
  margin-bottom: 2rem;
`

const HeaderMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 0.85rem;
  flex-wrap: wrap;
`

const StatusPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: ${({ $status }) =>
    ({
      open: 'rgba(59,130,246,0.12)',
      in_progress: 'rgba(245,158,11,0.12)',
      resolved: 'rgba(16,185,129,0.12)',
      closed: 'rgba(107,114,128,0.12)',
    })[$status] || 'rgba(59,130,246,0.12)'};
  color: ${({ $status }) =>
    ({
      open: '#3b82f6',
      in_progress: '#d97706',
      resolved: '#10b981',
      closed: '#6b7280',
    })[$status] || '#3b82f6'};
`

const SLATag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  background: ${({ $breached }) =>
    $breached ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)'};
  color: ${({ $breached }) => ($breached ? '#ef4444' : '#d97706')};
`

const SLAIndicator = ({ deadline }) => {
  const diff = new Date(deadline) - new Date()
  const breached = diff < 0
  const abs = Math.abs(diff)
  const hours = Math.floor(abs / (1000 * 60 * 60))
  const mins = Math.floor((abs % (1000 * 60 * 60)) / (1000 * 60))
  const label = breached
    ? hours >= 1
      ? `${hours}h overdue`
      : `${mins}m overdue`
    : hours >= 1
      ? `${hours}h left`
      : `${mins}m left`
  return (
    <SLATag $breached={breached}>
      <Clock size={11} />
      {label}
    </SLATag>
  )
}

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.85rem;
  line-height: 1.25;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.025em;
`

const Subline = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.82rem;
  flex-wrap: wrap;
`

const Dot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.5;
`

/* ─────────────────────────────────────────────
   Main grid
───────────────────────────────────────────── */

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 270px;
  gap: 1.75rem;
  @media (max-width: 880px) {
    grid-template-columns: 1fr;
  }
`

/* ─────────────────────────────────────────────
   Thread / timeline
───────────────────────────────────────────── */

const Thread = styled.div`
  position: relative;
  padding-left: 3rem;

  &::before {
    content: '';
    position: absolute;
    left: 1.25rem;
    top: 0.5rem;
    bottom: 0.5rem;
    width: 2px;
    background: ${({ theme }) => theme.colors.border};
  }
`

const Entry = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`

/* The avatar sits over the timeline line */
const AvatarSlot = styled.div`
  position: absolute;
  left: -3rem;
  top: 0.85rem;
`

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.colors.background};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  color: white;

  /* Role-based fallback colour */
  background: ${({ $role }) =>
    $role === 'staff' || $role === 'admin' ? '#6366f1' : '#0ea5e9'};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`

const RolePip = styled.span`
  display: inline-block;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-left: 0.4rem;
  ${({ $role }) =>
    $role === 'staff' || $role === 'admin'
      ? css`
          background: rgba(99, 102, 241, 0.15);
          color: #818cf8;
        `
      : css`
          background: rgba(14, 165, 233, 0.15);
          color: #38bdf8;
        `}
`

const EntryCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;

  /* Accent left stripe for staff replies */
  ${({ $isStaff }) =>
    $isStaff &&
    css`
      border-left: 3px solid #6366f1;
    `}
`

const EntryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.83rem;

  .author {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
  }

  .time {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.75rem;
    margin-left: auto;
  }
`

const EntryBody = styled.div`
  padding: 1rem 1.1rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.7;
  white-space: pre-wrap;
  font-size: 0.93rem;
`

/* ─────────────────────────────────────────────
   Composer
───────────────────────────────────────────── */

const ComposerRow = styled.div`
  display: flex;
  gap: 0.85rem;
  align-items: flex-start;
  margin-top: 0.25rem;
  /* Align with the card column */
  padding-left: 0rem;
`

const ComposerAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  color: white;
  background: ${({ $role }) =>
    $role === 'staff' || $role === 'admin' ? '#6366f1' : '#0ea5e9'};
  margin-top: 0.1rem;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`

const ComposerCard = styled.form`
  flex: 1;
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
  padding: 0.9rem 1rem;
  min-height: 88px;
  resize: vertical;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 0.92rem;
  line-height: 1.55;
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

const PostButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1.05rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  font-size: 0.83rem;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.18s ease;
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  &:not(:disabled):hover {
    opacity: 0.88;
  }
`

/* ─────────────────────────────────────────────
   Sidebar
───────────────────────────────────────────── */

const SidePanel = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const PanelSection = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
`

const PanelTitle = styled.div`
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 700;
  padding: 0.7rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
`

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 1rem;
  font-size: 0.83rem;
  color: ${({ theme }) => theme.colors.text};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  &:last-child {
    border-bottom: none;
  }

  svg {
    color: ${({ theme }) => theme.colors.muted};
    flex-shrink: 0;
  }
  .label {
    color: ${({ theme }) => theme.colors.muted};
    flex: 1;
  }
  .value {
    font-weight: 600;
    text-align: right;
  }
`

const PriorityBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: ${({ $priority }) =>
    ({
      low: 'rgba(107,114,128,0.15)',
      normal: 'rgba(59,130,246,0.15)',
      high: 'rgba(245,158,11,0.15)',
      urgent: 'rgba(239,68,68,0.15)',
    })[$priority] || 'rgba(107,114,128,0.15)'};
  color: ${({ $priority }) =>
    ({
      low: '#6b7280',
      normal: '#3b82f6',
      high: '#d97706',
      urgent: '#ef4444',
    })[$priority] || '#6b7280'};
`

const SLADeadlineValue = styled.span`
  font-weight: 600;
  font-size: 0.8rem;
  color: ${({ $breached }) => ($breached ? '#ef4444' : 'inherit')};
  text-align: right;
`

/* ─────────────────────────────────────────────
   Attachments
───────────────────────────────────────────── */

const Attachments = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  padding: 0.75rem;
`

const Thumb = styled.a`
  display: block;
  aspect-ratio: 1;
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
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

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */

const initials = (email) => (email ? email.slice(0, 2).toUpperCase() : '??')

const isStaffRole = (role) => role === 'staff' || role === 'admin'

const formatTime = (date) => {
  const d = new Date(date)
  const diffMs = Date.now() - d
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
  const map = {
    open: CircleDot,
    in_progress: Activity,
    resolved: CheckCircle2,
    closed: CircleSlash,
  }
  const Icon = map[status] || CircleDot
  return <Icon size={12} />
}

const resolveAssignee = (assignedTo, staffList) => {
  if (!assignedTo) return null
  if (!staffList?.length)
    return { label: 'A staff member', avatarUrl: null, role: 'staff' }
  const m = staffList.find((s) => s.uid === assignedTo)
  return m
    ? { label: m.email.split('@')[0], avatarUrl: m.avatarUrl, role: m.role }
    : { label: 'A staff member', avatarUrl: null, role: 'staff' }
}

/* ─────────────────────────────────────────────
   AvatarImg — shows photo or coloured initials
───────────────────────────────────────────── */

const AvatarImg = ({ email, avatarUrl, role, size = 36 }) => {
  const style = { width: size, height: size }
  return (
    <Avatar $role={role} style={style}>
      {avatarUrl ? (
        <img
          src={
            avatarUrl.startsWith('http') ? avatarUrl : `${API_BASE}${avatarUrl}`
          }
          alt={email}
        />
      ) : (
        initials(email)
      )}
    </Avatar>
  )
}

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */

const IssueDetail = () => {
  const { id } = useParams()
  const { staff, issues, loading, addComment } = useIssues()
  const { user, profile } = useUser()

  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)

  const issue = issues.find((i) => i._id === id)

  if (loading && !issue) return <IssueDetailSkeleton />
  if (!loading && !issue) return <Navigate to={ROUTES.SUPPORT} replace />

  const assignee = resolveAssignee(issue.assignedTo, staff)

  const slaBreached =
    issue.slaDeadline &&
    new Date(issue.slaDeadline) < new Date() &&
    issue.status !== 'resolved' &&
    issue.status !== 'closed'

  const showSLA =
    issue.slaDeadline &&
    issue.status !== 'resolved' &&
    issue.status !== 'closed'

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

  const currentUserRole = profile?.role || 'client'

  return (
    <Wrapper>
      {/* ── Top bar ── */}
      <TopBar>
        <BackLink to={ROUTES.SUPPORT}>
          <ArrowLeft size={15} /> All issues
        </BackLink>
        <TopBarRight>
          <ShareButton onClick={() => setShareOpen(true)}>
            <Share2 size={13} /> Share
          </ShareButton>
          <IssueId>#{issue._id.slice(-6)}</IssueId>
        </TopBarRight>
      </TopBar>

      {/* ── Header ── */}
      <Header>
        {/* Company + tier banner */}
        {issue.companyId && (
          <CompanyBanner $tier={issue.companyTier}>
            <Building2 size={15} />
            <span className="company-name">
              {issue.companyId.name || issue.companyId}
            </span>
            {issue.companyTier && (
              <>
                <span className="divider" />
                <TierBadge tier={issue.companyTier} size="sm" />
              </>
            )}
            {showSLA && (
              <>
                <span className="divider" />
                <SLAIndicator deadline={issue.slaDeadline} />
              </>
            )}
          </CompanyBanner>
        )}

        {/* Escalation warning */}
        {issue.escalated && (
          <EscalatedBanner>
            <ShieldAlert size={15} />
            This issue was automatically escalated — SLA deadline passed without
            resolution.
          </EscalatedBanner>
        )}

        {/* Status + priority pills */}
        <HeaderMeta>
          <StatusPill $status={issue.status}>
            {statusIcon(issue.status)}
            {issue.status.replace('_', ' ')}
          </StatusPill>
          <PriorityBadge $priority={issue.priority}>
            <Flag size={10} />
            {issue.priority}
          </PriorityBadge>
        </HeaderMeta>

        <Title>{issue.title}</Title>

        <Subline>
          <span>
            opened by <strong>{issue.createdByEmail}</strong>
          </span>
          <Dot />
          <span>{formatTime(issue.createdAt)}</span>
          <Dot />
          <span>
            {issue.comments?.length || 0} comment
            {issue.comments?.length !== 1 ? 's' : ''}
          </span>
        </Subline>
      </Header>

      <Grid>
        {/* ── Left: conversation ── */}
        <div>
          <Thread>
            {/* Original issue post */}
            <Entry>
              <AvatarSlot>
                <AvatarImg
                  email={issue.createdByEmail}
                  avatarUrl={null}
                  role="client"
                />
              </AvatarSlot>
              <EntryCard $isStaff={false}>
                <EntryHeader>
                  <span className="author">
                    {issue.createdByEmail === user?.email
                      ? 'You'
                      : issue.createdByEmail}
                  </span>
                  <RolePip $role="client">Client</RolePip>
                  <span className="time">
                    opened this issue · {formatTime(issue.createdAt)}
                  </span>
                </EntryHeader>
                <EntryBody>{issue.description}</EntryBody>
              </EntryCard>
            </Entry>

            {/* Comments */}
            {(issue.comments || []).map((c) => {
              // Determine if commenter is staff by checking against staff list
              const commentorStaff = staff?.find((s) => s.uid === c.authorUid)
              const role = commentorStaff ? commentorStaff.role : 'client'
              const isStaff = isStaffRole(role)

              return (
                <Entry key={c._id || c.createdAt}>
                  <AvatarSlot>
                    <AvatarImg
                      email={c.authorEmail}
                      avatarUrl={commentorStaff?.avatarUrl || null}
                      role={role}
                    />
                  </AvatarSlot>
                  <EntryCard $isStaff={isStaff}>
                    <EntryHeader>
                      <span className="author">
                        {c.authorEmail === user?.email ? 'You' : c.authorEmail}
                      </span>
                      <RolePip $role={role}>
                        {isStaff ? 'Staff' : 'Client'}
                      </RolePip>
                      <span className="time">{formatTime(c.createdAt)}</span>
                    </EntryHeader>
                    <EntryBody>{c.text}</EntryBody>
                  </EntryCard>
                </Entry>
              )
            })}
          </Thread>

          {/* Composer — sits below the thread, avatar + card side by side */}
          <ComposerRow>
            <ComposerAvatar $role={currentUserRole}>
              {profile?.avatarUrl ? (
                <img
                  src={
                    profile.avatarUrl.startsWith('http')
                      ? profile.avatarUrl
                      : `${API_BASE}${profile.avatarUrl}`
                  }
                  alt={user?.email}
                />
              ) : (
                initials(user?.email)
              )}
            </ComposerAvatar>
            <ComposerCard onSubmit={handleAddComment}>
              <Textarea
                placeholder="Leave a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <ComposerFooter>
                <PostButton
                  type="submit"
                  disabled={submitting || !comment.trim()}
                >
                  <Send size={13} />
                  {submitting ? 'Posting…' : 'Post comment'}
                </PostButton>
              </ComposerFooter>
            </ComposerCard>
          </ComposerRow>
        </div>

        {/* ── Right: sidebar ── */}
        <SidePanel>
          <PanelSection>
            <PanelTitle>Details</PanelTitle>

            <InfoRow>
              <Flag size={13} />
              <span className="label">Priority</span>
              <PriorityBadge $priority={issue.priority}>
                {issue.priority}
              </PriorityBadge>
            </InfoRow>

            <InfoRow>
              <User size={13} />
              <span className="label">Assignee</span>
              {assignee ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <AvatarImg
                    email={assignee.label}
                    avatarUrl={assignee.avatarUrl}
                    role={assignee.role}
                    size={22}
                  />
                  <span className="value">{assignee.label}</span>
                </div>
              ) : (
                <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
                  Unassigned
                </span>
              )}
            </InfoRow>

            <InfoRow>
              <Clock size={13} />
              <span className="label">Updated</span>
              <span className="value">{formatTime(issue.updatedAt)}</span>
            </InfoRow>

            {issue.slaDeadline && (
              <InfoRow>
                <AlertTriangle
                  size={13}
                  style={{ color: slaBreached ? '#ef4444' : undefined }}
                />
                <span className="label">SLA deadline</span>
                <SLADeadlineValue $breached={slaBreached}>
                  {new Date(issue.slaDeadline).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </SLADeadlineValue>
              </InfoRow>
            )}
          </PanelSection>

          {/* Attachments */}
          {issue.attachments?.length > 0 && (
            <PanelSection>
              <PanelTitle>
                <Paperclip
                  size={10}
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
