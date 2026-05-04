import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import styled, { keyframes } from 'styled-components'
import { X } from 'lucide-react'

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: ${fadeIn} 0.18s ease-out;
`

const Panel = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  width: 100%;
  max-width: ${({ $maxWidth }) => $maxWidth || '560px'};
  max-height: 90vh;
  overflow-y: auto;
  animation: ${slideUp} 0.22s ease-out;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
`

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const Title = styled.h2`
  margin: 0;
  font-size: 1.15rem;
  color: ${({ theme }) => theme.colors.text};
`

const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: ${({ theme }) => theme.colors.muted};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
  }
`

const Body = styled.div`
  padding: 1.5rem;
`

const Modal = ({ open, onClose, title, children, maxWidth }) => {
  // Close on ESC
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <Backdrop onClick={onClose}>
      <Panel
        $maxWidth={maxWidth}
        onClick={(e) => e.stopPropagation()} // clicks inside don't close
      >
        <Header>
          <Title>{title}</Title>
          <CloseButton onClick={onClose} aria-label="Close">
            <X size={20} />
          </CloseButton>
        </Header>
        <Body>{children}</Body>
      </Panel>
    </Backdrop>,
    document.body,
  )
}

export default Modal
