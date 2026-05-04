import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'
import { Bell, X } from 'lucide-react'
import { useNotifications } from '../hooks/useNotifications'
import { buildIssuePath } from '../constants/routes'

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`

const Stack = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 360px;
  width: calc(100vw - 2rem);
`

const Toast = styled(Link)`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  text-decoration: none;
  color: inherit;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.25);
  animation: ${slideIn} 0.25s ease-out;

  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
    flex-shrink: 0;
  }

  .body {
    flex: 1;
    min-width: 0;

    .title {
      font-size: 0.85rem;
      font-weight: 600;
      color: ${({ theme }) => theme.colors.text};
      margin-bottom: 0.15rem;
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
  }

  .close {
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.colors.muted};
    cursor: pointer;
    padding: 2px;
    display: inline-flex;
    align-items: center;

    &:hover {
      color: ${({ theme }) => theme.colors.text};
    }
  }
`

const Toasts = () => {
  const { toasts, dismissToast } = useNotifications()

  return (
    <Stack>
      {toasts.map((t) => (
        <Toast
          key={t.toastId}
          to={buildIssuePath(t.issueId)}
          onClick={() => dismissToast(t.toastId)}
        >
          <span className="icon">
            <Bell size={16} />
          </span>
          <div className="body">
            <div className="title">{t.issueTitle}</div>
            <div className="msg">{t.message}</div>
          </div>
          <button
            className="close"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              dismissToast(t.toastId)
            }}
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </Toast>
      ))}
    </Stack>
  )
}

export default Toasts
