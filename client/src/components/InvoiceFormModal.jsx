import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import {
  Modal,
  ModalBox,
  ModalHead,
  ModalActions,
  CloseBtn,
  FormGrid,
  Field,
  Label,
  Input,
  Textarea,
  Select,
  PrimaryButton,
  SecondaryButton,
} from './AccountsShared'
import { LineItemsEditor, calcTotals } from './LineItemsEditor'

const DEFAULT_FORM = {
  companyId: '',
  clientName: '',
  clientEmail: '',
  clientAddress: '',
  attn: '',
  subject: '',
  currency: 'KES',
  vatRate: 16,
  issueDate: new Date().toISOString().slice(0, 10),
  dueDate: '',
  notes: '',
  lineItems: [],
}

export const InvoiceFormModal = ({
  open,
  onClose,
  onSubmit,
  initial = null,
  companies = [],
  submitting = false,
}) => {
  const [form, setForm] = useState(DEFAULT_FORM)

  useEffect(() => {
    if (initial) {
      setForm({
        companyId: initial.companyId?._id || initial.companyId || '',
        clientName: initial.clientName || '',
        clientEmail: initial.clientEmail || '',
        clientAddress: initial.clientAddress || '',
        attn: initial.attn || '',
        subject: initial.subject || '',
        currency: initial.currency || 'KES',
        vatRate: initial.vatRate ?? 16,
        issueDate: initial.issueDate
          ? new Date(initial.issueDate).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10),
        dueDate: initial.dueDate
          ? new Date(initial.dueDate).toISOString().slice(0, 10)
          : '',
        notes: initial.notes || '',
        lineItems: initial.lineItems || [],
      })
    } else {
      setForm(DEFAULT_FORM)
    }
  }, [initial, open])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleCompanyChange = (id) => {
    set('companyId', id)
    if (!id) return
    const company = companies.find((c) => c._id === id)
    if (company) {
      if (!form.clientName) set('clientName', company.name)
      if (!form.clientEmail)
        set('clientEmail', company.primaryContactEmail || '')
      if (!form.clientAddress) set('clientAddress', company.address || '')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { subtotal, vatAmount, total } = calcTotals(
      form.lineItems,
      form.vatRate,
    )
    onSubmit({ ...form, subtotal, vatAmount, total })
  }

  if (!open) return null

  return (
    <Modal>
      <ModalBox $wide as="form" onSubmit={handleSubmit}>
        <ModalHead>
          <h2>{initial ? 'Edit Invoice' : 'New Invoice'}</h2>
          <CloseBtn type="button" onClick={onClose} aria-label="Close">
            <X size={16} />
          </CloseBtn>
        </ModalHead>

        <FormGrid>
          <Field>
            <Label>Company (optional)</Label>
            <Select
              value={form.companyId}
              onChange={(e) => handleCompanyChange(e.target.value)}
            >
              <option value="">— One-off client —</option>
              {companies.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field>
            <Label>Currency</Label>
            <Select
              value={form.currency}
              onChange={(e) => set('currency', e.target.value)}
            >
              <option value="KES">KES</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </Select>
          </Field>

          <Field>
            <Label>Client Name</Label>
            <Input
              value={form.clientName}
              onChange={(e) => set('clientName', e.target.value)}
              placeholder="Acme Corp"
            />
          </Field>

          <Field>
            <Label>Client Email</Label>
            <Input
              type="email"
              value={form.clientEmail}
              onChange={(e) => set('clientEmail', e.target.value)}
              placeholder="billing@example.com"
            />
          </Field>

          <Field $span>
            <Label>Client Address</Label>
            <Input
              value={form.clientAddress}
              onChange={(e) => set('clientAddress', e.target.value)}
              placeholder="P.O. Box …"
            />
          </Field>

          <Field>
            <Label>Attn</Label>
            <Input
              value={form.attn}
              onChange={(e) => set('attn', e.target.value)}
              placeholder="Accounts Payable"
            />
          </Field>

          <Field>
            <Label>VAT Rate (%)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={form.vatRate}
              onChange={(e) => set('vatRate', parseFloat(e.target.value) || 0)}
            />
          </Field>

          <Field $span>
            <Label>Subject</Label>
            <Input
              value={form.subject}
              onChange={(e) => set('subject', e.target.value)}
              placeholder="Supply of office equipment…"
            />
          </Field>

          <Field>
            <Label>Issue Date</Label>
            <Input
              type="date"
              value={form.issueDate}
              onChange={(e) => set('issueDate', e.target.value)}
            />
          </Field>

          <Field>
            <Label>Due Date</Label>
            <Input
              type="date"
              value={form.dueDate}
              onChange={(e) => set('dueDate', e.target.value)}
            />
          </Field>

          <Field $span>
            <Label>Notes</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Bank details, payment instructions…"
            />
          </Field>
        </FormGrid>

        <div style={{ marginTop: '1.25rem' }}>
          <Label style={{ marginBottom: '0.5rem', display: 'block' }}>
            Line Items
          </Label>
          <LineItemsEditor
            items={form.lineItems}
            onChange={(items) => set('lineItems', items)}
            vatRate={form.vatRate}
            currency={form.currency}
          />
        </div>

        <ModalActions>
          <SecondaryButton type="button" onClick={onClose}>
            Cancel
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            disabled={submitting || !form.lineItems.length}
          >
            {submitting
              ? 'Saving…'
              : initial
                ? 'Save Changes'
                : 'Create Invoice'}
          </PrimaryButton>
        </ModalActions>
      </ModalBox>
    </Modal>
  )
}
