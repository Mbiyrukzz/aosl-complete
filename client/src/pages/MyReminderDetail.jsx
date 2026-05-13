import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import {
  Bell,
  ArrowLeft,
  Calendar,
  Clock,
  Mail,
  MessageSquare,
  Check,
  AlertCircle,
  XCircle,
  Repeat,
} from 'lucide-react'
import { useAuthedRequest } from '../hooks/useAuthedRequest'
import { FullScreenLoader } from '../components/Loader'

/* ─── Layout ─────────────────────────────────────────────────────────── */

const Wrapper = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem;
`

const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.88rem;
  font-family: inherit;
  cursor: pointer;
  padding: 0;
  margin-bottom: 1.5rem;
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`

const Hero = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.1rem;
  margin-bottom: 2rem;
`

const IconBox = styled.div`
  width: 52px;
  height: 52px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ $tint }) => $tint};
  color: ${({ $color }) => $color};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 4px;
`

const HeroText = styled.div`
  h1 {
    color: ${({ theme }) => theme.colors.text};
    font-size: 1.5rem;
    letter-spacing: -0.025em;
    margin: 0 0 0.4rem 0;
  }
`

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`

const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${({ $tint }) => $tint};
  color: ${({ $color }) => $color};
`

const CategoryPill = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  padding: 0.18rem 0.55rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  color: ${({ theme }) => theme.colors.text};
`

/* ─── Countdown banner ───────────────────────────────────────────────── */

const CountdownBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ $tint }) => $tint};
  border: 1px solid ${({ $color }) => $color}33;
  margin-bottom: 1.25rem;
`

const CountdownLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;

  .label {
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
  }

  .sub {
    font-size: 0.78rem;
    color: ${({ theme }) => theme.colors.muted};
    margin-top: 0.1rem;
  }
`

const CountdownValue = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${({ $color }) => $color};
  letter-spacing: -0.03em;
  flex-shrink: 0;
`

/* ─── Cards ──────────────────────────────────────────────────────────── */

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.5rem;
  margin-bottom: 1rem;
`

const CardLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`

const MessageBody = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.97rem;
  line-height: 1.75;
  margin: 0;
  white-space: pre-wrap;
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 1.25rem 0;
`

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`

const MetaItem = styled.div`
  .label {
    font-size: 0.74rem;
    color: ${({ theme }) => theme.colors.muted};
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .value {
    font-size: 0.92rem;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
  }

  .sub {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.muted};
    margin-top: 0.15rem;
  }
`

const ChannelList = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`

const ChannelBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.background : 'transparent'};
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.border};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.muted};
  opacity: ${({ $active }) => ($active ? 1 : 0.4)};
`

/* ─── Constants ──────────────────────────────────────────────────────── */

const STATUS_CONFIG = {
  scheduled: {
    color: '#3b82f6',
    tint: 'rgba(59,130,246,0.12)',
    label: 'Scheduled',
    icon: Clock,
  },
  sent: {
    color: '#10b981',
    tint: 'rgba(16,185,129,0.12)',
    label: 'Sent',
    icon: Check,
  },
  failed: {
    color: '#ef4444',
    tint: 'rgba(239,68,68,0.12)',
    label: 'Failed',
    icon: AlertCircle,
  },
  cancelled: {
    color: '#6b7280',
    tint: 'rgba(107,114,128,0.15)',
    label: 'Cancelled',
    icon: XCircle,
  },
}

const CATEGORY_CONFIG = {
  invoice: { color: '#f59e0b', tint: 'rgba(245,158,11,0.12)' },
  package_expiry: { color: '#3b82f6', tint: 'rgba(59,130,246,0.12)' },
  domain_renewal: { color: '#ef4444', tint: 'rgba(239,68,68,0.12)' },
  general: { color: '#6366f1', tint: 'rgba(99,102,241,0.12)' },
  support: { color: '#10b981', tint: 'rgba(16,185,129,0.12)' },
}

const formatDateTime = (date) =>
  new Date(date).toLocaleString(undefined, {
    dateStyle: 'long',
    timeStyle: 'short',
  })

const daysUntil = (date) =>
  Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24))

const formatCountdown = (date, status) => {
  if (status === 'sent') return 'Sent'
  if (status === 'cancelled') return 'Cancelled'
  const days = daysUntil(date)
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days < 0) return `${Math.abs(days)}d ago`
  if (days < 7) return `In ${days} days`
  if (days < 30) return `In ${Math.ceil(days / 7)} wks`
  return `In ${Math.ceil(days / 30)} mo`
}

/* ─── Component ──────────────────────────────────────────────────────── */

const MyReminderDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isReady, get } = useAuthedRequest()

  const [reminder, setReminder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isReady) return
    const fetch = async () => {
      setLoading(true)
      try {
        // Fetches from the my-reminders list and finds by id client-side,
        // or if you add a dedicated endpoint: /api/me/reminders/:id
        const data = await get('/api/me/reminders')
        const found = data.reminders.find((r) => r._id === id)
        setReminder(found || null)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id, isReady, get])

  if (loading)
    return (
      <Wrapper>
        <FullScreenLoader label="Loading reminder..." />
      </Wrapper>
    )

  if (!reminder)
    return (
      <Wrapper>
        <BackLink onClick={() => navigate(-1)}>
          <ArrowLeft size={14} /> Back
        </BackLink>
        <p style={{ color: 'var(--colors-muted)' }}>Reminder not found.</p>
      </Wrapper>
    )

  const status = STATUS_CONFIG[reminder.status] || STATUS_CONFIG.scheduled
  const StatusIcon = status.icon
  const categoryCfg =
    CATEGORY_CONFIG[reminder.category] || CATEGORY_CONFIG.general

  const days = daysUntil(reminder.scheduledFor)
  const isSoon = reminder.status === 'scheduled' && days <= 2
  const countdownColor = isSoon ? '#ef4444' : status.color
  const countdownTint = isSoon ? 'rgba(239,68,68,0.08)' : status.tint

  return (
    <Wrapper>
      <BackLink onClick={() => navigate(-1)}>
        <ArrowLeft size={14} /> Back to reminders
      </BackLink>

      <Hero>
        <IconBox $tint={categoryCfg.tint} $color={categoryCfg.color}>
          <Bell size={22} />
        </IconBox>
        <HeroText>
          <h1>{reminder.title}</h1>
          <BadgeRow>
            <StatusPill $tint={status.tint} $color={status.color}>
              <StatusIcon size={11} /> {status.label}
            </StatusPill>
            <CategoryPill>{reminder.category.replace('_', ' ')}</CategoryPill>
          </BadgeRow>
        </HeroText>
      </Hero>

      {/* Countdown banner — shown for scheduled/failed */}
      {(reminder.status === 'scheduled' || reminder.status === 'failed') && (
        <CountdownBanner $tint={countdownTint} $color={countdownColor}>
          <CountdownLeft $color={countdownColor}>
            <Clock size={18} style={{ color: countdownColor }} />
            <div>
              <div className="label">
                {isSoon ? 'Action required soon' : 'Upcoming reminder'}
              </div>
              <div className="sub">{formatDateTime(reminder.scheduledFor)}</div>
            </div>
          </CountdownLeft>
          <CountdownValue $color={countdownColor}>
            {formatCountdown(reminder.scheduledFor, reminder.status)}
          </CountdownValue>
        </CountdownBanner>
      )}

      {/* Message */}
      <Card>
        <CardLabel>
          <MessageSquare size={12} /> Message
        </CardLabel>
        <MessageBody>{reminder.message}</MessageBody>

        <Divider />

        <CardLabel>
          <Bell size={12} /> You'll be notified via
        </CardLabel>
        <ChannelList>
          <ChannelBadge $active={reminder.channels?.email}>
            <Mail size={13} /> Email
          </ChannelBadge>
          <ChannelBadge $active={reminder.channels?.whatsapp}>
            <MessageSquare size={13} /> WhatsApp
          </ChannelBadge>
          <ChannelBadge $active={reminder.channels?.inApp}>
            <Bell size={13} /> In-app
          </ChannelBadge>
        </ChannelList>
      </Card>

      {/* Details */}
      <Card>
        <CardLabel>
          <Calendar size={12} /> Schedule details
        </CardLabel>
        <MetaGrid>
          <MetaItem>
            <div className="label">
              <Calendar size={11} /> Date &amp; time
            </div>
            <div className="value">{formatDateTime(reminder.scheduledFor)}</div>
          </MetaItem>

          {reminder.recurrence && reminder.recurrence !== 'none' && (
            <MetaItem>
              <div className="label">
                <Repeat size={11} /> Recurrence
              </div>
              <div className="value">
                {reminder.recurrence.charAt(0).toUpperCase() +
                  reminder.recurrence.slice(1)}
              </div>
              {reminder.recurrenceEndDate && (
                <div className="sub">
                  Ends {formatDateTime(reminder.recurrenceEndDate)}
                </div>
              )}
            </MetaItem>
          )}
        </MetaGrid>
      </Card>
    </Wrapper>
  )
}

export default MyReminderDetail
