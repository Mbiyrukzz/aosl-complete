import { useState } from 'react'
import { X, Send } from 'lucide-react'
import {
  Modal,
  ModalBox,
  ModalHead,
  ModalActions,
  CloseBtn,
  Field,
  Label,
  Input,
  PrimaryButton,
  SecondaryButton,
} from './AccountsShared'

export const SendModal = ({
  open,
  onClose,
  onSend,
  defaultEmail = '',
  refNumber = '',
  submitting = false,
}) => {
  const [email, setEmail] = useState(defaultEmail)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    onSend(email.trim())
  }

  if (!open) return null

  return (
    <Modal>
      <ModalBox as="form" onSubmit={handleSubmit}>
        <ModalHead>
          <h2>Send {refNumber}</h2>
          <CloseBtn type="button" onClick={onClose} aria-label="Close">
            <X size={16} />
          </CloseBtn>
        </ModalHead>

        <p
          style={{
            fontSize: '0.88rem',
            marginTop: 0,
            marginBottom: '1.25rem',
            opacity: 0.7,
          }}
        >
          The PDF will be generated in your browser and sent as an email
          attachment.
        </p>

        <Field>
          <Label>Recipient Email</Label>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="client@example.com"
            autoFocus
          />
        </Field>

        <ModalActions>
          <SecondaryButton type="button" onClick={onClose}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" disabled={submitting || !email.trim()}>
            <Send size={14} />
            {submitting ? 'Sending…' : 'Send Email'}
          </PrimaryButton>
        </ModalActions>
      </ModalBox>
    </Modal>
  )
}
