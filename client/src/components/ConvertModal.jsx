import { useState } from 'react'
import { X, ArrowRight } from 'lucide-react'
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

export const ConvertModal = ({
  open,
  onClose,
  onConvert,
  quotation,
  submitting = false,
}) => {
  const [dueDate, setDueDate] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onConvert(dueDate || null)
  }

  if (!open || !quotation) return null

  return (
    <Modal>
      <ModalBox as="form" onSubmit={handleSubmit}>
        <ModalHead>
          <h2>Convert to Invoice</h2>
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
          Converting <strong>{quotation.refNumber}</strong> will create a new
          invoice and mark this quotation as converted.
        </p>

        <Field>
          <Label>Due Date (optional)</Label>
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </Field>

        <ModalActions>
          <SecondaryButton type="button" onClick={onClose}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" disabled={submitting}>
            <ArrowRight size={14} />
            {submitting ? 'Converting…' : 'Create Invoice'}
          </PrimaryButton>
        </ModalActions>
      </ModalBox>
    </Modal>
  )
}
