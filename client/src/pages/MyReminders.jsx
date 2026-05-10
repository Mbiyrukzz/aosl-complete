import styled from 'styled-components'
import {
  Bell,
  Calendar,
  Clock,
  CheckCircle2,
  Mail,
  MessageSquare,
} from 'lucide-react'
import { useReminders } from '../hooks/useReminders'
import { FullScreenLoader } from '../components/Loader'

const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`

const PageHead = styled.div`
  margin-bottom: 2rem;

  h1 {
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 0.4rem 0;
    font-size: 1.75rem;
    letter-spacing: -0.025em;
  }

  p {
    color: ${({ theme }) => theme.colors.muted};
    margin: 0;
    font-size: 0.92rem;
  }
`

const TimelineSection = styled.div`
  margin-bottom: 2rem;
`

const TimelineHead = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.85rem;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 600;
`

const ReminderRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem 1.25rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: 0.5rem;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  ${({ $sent, theme }) =>
    $sent &&
    `
    opacity: 0.65;
    background: ${theme.colors.background};
  `}
`

const IconBox = styled.div`
  width: 38px;
  height: 38px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $tint }) => $tint};
  color: ${({ $color }) => $color};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

const ReminderInfo = styled.div`
  min-width: 0;

  .title {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    font-size: 0.95rem;
    margin-bottom: 0.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .message {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.85rem;
    line-height: 1.5;
    margin-bottom: 0.4rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .meta {
    display: flex;
    gap: 0.85rem;
    flex-wrap: wrap;
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.78rem;
  }

  .meta-item {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }
`

const TimingPill = styled.div`
  font-size: 0.82rem;
  font-weight: 600;
  color: ${({ $color }) => $color};
  text-align: right;
  flex-shrink: 0;
`

const Empty = styled.div`
  text-align: center;
  padding: 4rem 1rem;
  color: ${({ theme }) => theme.colors.muted};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};

  svg {
    color: ${({ theme }) => theme.colors.border};
    margin-bottom: 1rem;
  }

  h3 {
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 0.4rem 0;
    font-size: 1rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 0.88rem;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
`

const CATEGORY_CONFIG = {
  invoice: { color: '#f59e0b', tint: 'rgba(245,158,11,0.12)' },
  package_expiry: { color: '#3b82f6', tint: 'rgba(59,130,246,0.12)' },
  domain_renewal: { color: '#ef4444', tint: 'rgba(239,68,68,0.12)' },
  general: { color: '#6366f1', tint: 'rgba(99,102,241,0.12)' },
  support: { color: '#10b981', tint: 'rgba(16,185,129,0.12)' },
}

const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

const daysUntil = (date) => {
  const diff = new Date(date) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const formatCountdown = (date, status) => {
  if (status === 'sent') return 'Sent'
  const days = daysUntil(date)
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days < 0) return `${Math.abs(days)}d ago`
  if (days < 7) return `in ${days} days`
  if (days < 30) return `in ${Math.ceil(days / 7)} weeks`
  return `in ${Math.ceil(days / 30)} months`
}

const MyReminders = () => {
  const { reminders = [], loading } = useReminders()

  if (loading) {
    return (
      <Wrapper>
        <FullScreenLoader label="Loading your reminders..." />
      </Wrapper>
    )
  }

  const upcoming = reminders
    .filter((r) => r.status === 'scheduled')
    .sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor))

  const sent = reminders
    .filter((r) => r.status === 'sent')
    .sort((a, b) => new Date(b.scheduledFor) - new Date(a.scheduledFor))
    .slice(0, 20)

  return (
    <Wrapper>
      <PageHead>
        <h1>My reminders</h1>
        <p>Upcoming alerts about your packages, invoices, and renewals.</p>
      </PageHead>

      {reminders.length === 0 ? (
        <Empty>
          <Bell size={36} />
          <h3>No reminders yet</h3>
          <p>
            We'll let you know when packages are about to expire, invoices are
            due, or there's anything else you need to act on.
          </p>
        </Empty>
      ) : (
        <>
          {upcoming.length > 0 && (
            <TimelineSection>
              <TimelineHead>
                <Clock size={12} /> Upcoming
              </TimelineHead>
              {upcoming.map((r) => {
                const cfg =
                  CATEGORY_CONFIG[r.category] || CATEGORY_CONFIG.general
                const days = daysUntil(r.scheduledFor)
                const isSoon = days <= 1
                return (
                  <ReminderRow key={r._id}>
                    <IconBox $tint={cfg.tint} $color={cfg.color}>
                      <Bell size={16} />
                    </IconBox>
                    <ReminderInfo>
                      <div className="title">{r.title}</div>
                      <div className="message">{r.message}</div>
                      <div className="meta">
                        <span className="meta-item">
                          <Calendar size={11} />
                          {formatDate(r.scheduledFor)}
                        </span>
                        {r.channels?.email && (
                          <span className="meta-item">
                            <Mail size={11} /> Email
                          </span>
                        )}
                        {r.channels?.whatsapp && (
                          <span className="meta-item">
                            <MessageSquare size={11} /> WhatsApp
                          </span>
                        )}
                      </div>
                    </ReminderInfo>
                    <TimingPill $color={isSoon ? '#ef4444' : cfg.color}>
                      {formatCountdown(r.scheduledFor, r.status)}
                    </TimingPill>
                  </ReminderRow>
                )
              })}
            </TimelineSection>
          )}

          {sent.length > 0 && (
            <TimelineSection>
              <TimelineHead>
                <CheckCircle2 size={12} /> Recently sent
              </TimelineHead>
              {sent.map((r) => {
                const cfg =
                  CATEGORY_CONFIG[r.category] || CATEGORY_CONFIG.general
                return (
                  <ReminderRow key={r._id} $sent>
                    <IconBox $tint={cfg.tint} $color={cfg.color}>
                      <CheckCircle2 size={16} />
                    </IconBox>
                    <ReminderInfo>
                      <div className="title">{r.title}</div>
                      <div className="meta">
                        <span className="meta-item">
                          <Calendar size={11} />
                          {formatDate(r.scheduledFor)}
                        </span>
                      </div>
                    </ReminderInfo>
                    <TimingPill $color="#6b7280">Sent</TimingPill>
                  </ReminderRow>
                )
              })}
            </TimelineSection>
          )}
        </>
      )}
    </Wrapper>
  )
}

export default MyReminders
