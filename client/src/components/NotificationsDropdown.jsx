import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Bell, CheckCheck } from 'lucide-react'
import { useNotifications } from '../hooks/useNotifications'
import { buildIssuePath } from '../constants/routes'

const Wrap = styled.div`
  position: relative;
`

const Trigger = styled.button`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  width: 100%;
  padding: 0.65rem 0.85rem;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  border-radius: 8px;
  font-size: 0.93rem;
  font-weight: 500;
  text-align: left;
  font-family: inherit;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: white;
  }

  .label {
    @media (max-width: 768px) {
      display: none;
    }
  }

  .badge {
    position: absolute;
    top: 5px;
    left: 26px;
    background: #ef4444;
    color: white;
    font-size: 0.65rem;
    font-weight: 700;
    padding: 1px 5px;
    border-radius: 999px;
    min-width: 16px;
    text-align: center;
    line-height: 1.4;
    border: 2px solid #0a0a0a;
  }
`

const Panel = styled.div`
  position: fixed;
  bottom: 4rem;
  left: 250px;
  width: 360px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
  z-index: 100;
  display: flex;
  flex-direction: column;
  max-height: 480px;

  @media (max-width: 768px) {
    left: 70px;
    width: calc(100vw - 90px);
  }
`

const PanelHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  h3 {
    margin: 0;
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.text};
  }

  button {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.8rem;
    cursor: pointer;
    padding: 0.3rem 0.5rem;
    border-radius: 6px;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
      background: ${({ theme }) => theme.colors.surface};
    }
  }
`

const List = styled.div`
  overflow-y: auto;
  padding: 0.4rem;
`

const Item = styled(Link)`
  display: block;
  padding: 0.75rem 0.85rem;
  border-radius: ${({ theme }) => theme.radii.md};
  text-decoration: none;
  color: inherit;
  transition: background 0.15s ease;
  position: relative;
  background: ${({ $unread, theme }) =>
    $unread ? theme.colors.surface : 'transparent'};

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
  }

  .title {
    font-size: 0.88rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0.2rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .msg {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.muted};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .time {
    font-size: 0.72rem;
    color: ${({ theme }) => theme.colors.muted};
    margin-top: 0.2rem;
  }

  &::before {
    content: '';
    position: absolute;
    left: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ $unread, theme }) =>
      $unread ? theme.colors.primary : 'transparent'};
  }
`

const Empty = styled.div`
  padding: 2.5rem 1rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.88rem;
`

const formatTime = (date) => {
  const diffMin = Math.floor((Date.now() - new Date(date)) / 60000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  return new Date(date).toLocaleDateString()
}

const NotificationsDropdown = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleItemClick = (notif) => {
    if (!notif.read) markAsRead(notif._id)
    setOpen(false)
  }

  return (
    <Wrap ref={wrapRef}>
      <Trigger onClick={() => setOpen((o) => !o)}>
        <Bell size={18} />
        <span className="label">Notifications</span>
        {unreadCount > 0 && (
          <span className="badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </Trigger>

      {open && (
        <Panel>
          <PanelHead>
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead}>
                <CheckCheck size={13} /> Mark all read
              </button>
            )}
          </PanelHead>
          <List>
            {notifications.length === 0 ? (
              <Empty>No notifications yet.</Empty>
            ) : (
              notifications.map((n) => (
                <Item
                  key={n._id}
                  to={buildIssuePath(n.issueId)}
                  $unread={!n.read}
                  onClick={() => handleItemClick(n)}
                >
                  <div className="title">{n.issueTitle}</div>
                  <div className="msg">{n.message}</div>
                  <div className="time">{formatTime(n.createdAt)}</div>
                </Item>
              ))
            )}
          </List>
        </Panel>
      )}
    </Wrap>
  )
}

export default NotificationsDropdown
