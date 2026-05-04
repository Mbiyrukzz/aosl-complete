import { useState } from 'react'
import styled from 'styled-components'
import { Send, AlertCircle, CheckCircle2 } from 'lucide-react'
import Modal from './Modal'
import { useAuthedRequest } from '../hooks/useAuthedRequest'
import { useIssues } from '../hooks/useIssues'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: -0.5rem;
`

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const Hint = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.4;
`

const StaffList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  max-height: 180px;
  overflow-y: auto;
  padding: 0.3rem;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.md};
`

const StaffOption = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.7rem;
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  text-align: left;
  font-size: 0.9rem;
  font-family: inherit;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`

const Actions = styled.div`
  display: flex;
  gap: 0.6rem;
  justify-content: flex-end;
`

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 1.2rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
  }
`

const SecondaryButton = styled.button`
  padding: 0.65rem 1.2rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  font-family: inherit;
`

const Status = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.85rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.85rem;

  ${({ $kind }) =>
    $kind === 'error'
      ? `background: rgba(239,68,68,0.1); color: #ef4444;`
      : `background: rgba(16,185,129,0.1); color: #10b981;`}
`

const ShareModal = ({ issueId, open, onClose }) => {
  const { post } = useAuthedRequest()
  const { staff } = useIssues()
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState(null) // { kind, message }

  const handleShare = async (recipient) => {
    setStatus(null)
    setSubmitting(true)
    try {
      const body =
        typeof recipient === 'string'
          ? { recipientEmail: recipient }
          : { recipientUid: recipient.uid }

      const res = await post(`/api/issues/${issueId}/share`, body)
      setStatus({
        kind: 'success',
        message: `Shared with ${res.recipient.email}`,
      })
      setEmail('')
      // Close after a moment
      setTimeout(() => {
        onClose()
        setStatus(null)
      }, 1500)
    } catch (err) {
      setStatus({
        kind: 'error',
        message: err.response?.data?.error || err.message,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const onEmailSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    handleShare(email.trim())
  }

  return (
    <Modal open={open} onClose={onClose} title="Share issue">
      <Form onSubmit={onEmailSubmit}>
        <Label>Share with email</Label>
        <Input
          type="email"
          placeholder="user@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />
        <Hint>
          The recipient will receive a notification linking to this issue. They
          must already have an account and be staff or the issue's owner.
        </Hint>

        {status && (
          <Status $kind={status.kind}>
            {status.kind === 'error' ? (
              <AlertCircle size={15} />
            ) : (
              <CheckCircle2 size={15} />
            )}
            {status.message}
          </Status>
        )}

        {staff.length > 0 && (
          <>
            <Label>Or pick a teammate</Label>
            <StaffList>
              {staff.map((s) => (
                <StaffOption
                  key={s.uid}
                  type="button"
                  onClick={() => handleShare(s)}
                  disabled={submitting}
                >
                  <Send size={13} />
                  {s.email}
                </StaffOption>
              ))}
            </StaffList>
          </>
        )}

        <Actions>
          <SecondaryButton type="button" onClick={onClose}>
            Close
          </SecondaryButton>
          <Button type="submit" disabled={submitting || !email.trim()}>
            <Send size={14} /> Share
          </Button>
        </Actions>
      </Form>
    </Modal>
  )
}

export default ShareModal
