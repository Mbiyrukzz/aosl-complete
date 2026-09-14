import { useState } from 'react'
import styled from 'styled-components'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`
const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }
`
const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`
const Label = styled.label`
  font-size: 0.82rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`
const Input = styled.input`
  padding: 0.7rem 0.95rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 0.92rem;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`
const SelectInput = styled.select`
  padding: 0.7rem 0.95rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 0.92rem;
  cursor: pointer;
`
const Textarea = styled.textarea`
  padding: 0.7rem 0.95rem;
  min-height: 90px;
  resize: vertical;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 0.92rem;
  line-height: 1.5;
`
const FormActions = styled.div`
  display: flex;
  gap: 0.6rem;
  justify-content: flex-end;
`
const PrimaryButton = styled.button`
  padding: 0.7rem 1.2rem;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  font-size: 0.92rem;
  cursor: pointer;
  font-family: inherit;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`
const SecondaryButton = styled.button`
  padding: 0.7rem 1.2rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
`
const ErrorBox = styled.div`
  padding: 0.7rem 0.9rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 8px;
  color: #ef4444;
  font-size: 0.86rem;
`

const blankForm = {
  companyId: '',
  title: '',
  description: '',
  priority: 'normal',
  dueDate: '',
  notes: '',
}

/**
 * @param {Array} companies - list of { _id, name } for the company picker.
 *   Omit / ignore when lockedCompanyId is set.
 * @param {String} lockedCompanyId - pre-select and hide the company picker
 *   (used when creating a project from a company's own detail page).
 * @param {Object} initial - existing project, for edit mode.
 * @param {Function} onSubmit - async (formData) => void
 * @param {Function} onCancel
 */
const AdminProjectForm = ({
  companies = [],
  lockedCompanyId = null,
  initial = null,
  onSubmit,
  onCancel,
}) => {
  const [form, setForm] = useState(() => ({
    ...blankForm,
    ...(lockedCompanyId ? { companyId: lockedCompanyId } : {}),
    ...(initial
      ? {
          companyId: initial.companyId?._id || initial.companyId || '',
          title: initial.title || '',
          description: initial.description || '',
          priority: initial.priority || 'normal',
          dueDate: initial.dueDate ? initial.dueDate.slice(0, 10) : '',
          notes: initial.notes || '',
        }
      : {}),
  }))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const updateField = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await onSubmit({ ...form, dueDate: form.dueDate || null })
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save project')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      {error && <ErrorBox>{error}</ErrorBox>}

      {!lockedCompanyId && (
        <Field>
          <Label>Company</Label>
          <SelectInput
            value={form.companyId}
            onChange={updateField('companyId')}
            required
          >
            <option value="">Select a company…</option>
            {companies.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </SelectInput>
        </Field>
      )}

      <Field>
        <Label>Project title</Label>
        <Input
          value={form.title}
          onChange={updateField('title')}
          placeholder="e.g. Warehouse inventory system"
          required
          maxLength={200}
        />
      </Field>

      <Field>
        <Label>Description</Label>
        <Textarea
          value={form.description}
          onChange={updateField('description')}
          placeholder="What's being built, scope, deliverables…"
          maxLength={4000}
        />
      </Field>

      <FormRow>
        <Field>
          <Label>Priority</Label>
          <SelectInput value={form.priority} onChange={updateField('priority')}>
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </SelectInput>
        </Field>
        <Field>
          <Label>Due date (optional)</Label>
          <Input
            type="date"
            value={form.dueDate}
            onChange={updateField('dueDate')}
          />
        </Field>
      </FormRow>

      <Field>
        <Label>Internal notes (staff only — not visible to the client)</Label>
        <Textarea
          value={form.notes}
          onChange={updateField('notes')}
          placeholder="Anything the team should know…"
          maxLength={2000}
        />
      </Field>

      <FormActions>
        <SecondaryButton type="button" onClick={onCancel}>
          Cancel
        </SecondaryButton>
        <PrimaryButton type="submit" disabled={saving}>
          {saving ? 'Saving…' : initial ? 'Save changes' : 'Start project'}
        </PrimaryButton>
      </FormActions>
    </Form>
  )
}

export default AdminProjectForm