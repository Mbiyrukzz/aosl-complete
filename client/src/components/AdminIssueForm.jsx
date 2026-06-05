import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { User, Upload, X } from 'lucide-react'

import { useClients } from '../hooks/useClients'

/* ── Styled components (reuse your existing IssueForm styles) ── */
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
  padding: 0.7rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  font-family: inherit;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`
const Textarea = styled.textarea`
  padding: 0.7rem 1rem;
  min-height: 120px;
  resize: vertical;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 0.95rem;
`
const Select = styled.select`
  padding: 0.7rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  font-family: inherit;
  cursor: pointer;
`
const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
`
const Button = styled.button`
  padding: 0.7rem 1.4rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`
const SecondaryButton = styled.button`
  padding: 0.7rem 1.4rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
`
const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 0.9rem;
  margin: 0;
`

const ClientBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.85rem;
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.85rem;
  font-weight: 600;
  color: #6366f1;
`

const FileDrop = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem;
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.9rem;
  text-align: center;
  transition: border-color 0.2s ease;
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
  input {
    display: none;
  }
`

const Previews = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.5rem;
`
const Preview = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  button {
    position: absolute;
    top: 4px;
    right: 4px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

/* ── Component ── */
const AdminIssueForm = ({ onSubmit, onCancel, preselectedClient = null }) => {
  const {
    clients,
    loading: clientsLoading,
    error: clientsError,
    refetch,
  } = useClients()

  // Initialise directly from the prop — no effect needed to sync it
  const [selectedClient, setSelectedClient] = useState(preselectedClient)
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'normal',
  })
  const [files, setFiles] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Only use the effect to trigger a client list fetch when needed
  useEffect(() => {
    if (!preselectedClient && !clients.length) {
      refetch?.()
    }
  }, [clients.length, preselectedClient, refetch])

  const handleFileChange = (e) => {
    const picked = Array.from(e.target.files)
    setFiles((prev) => [...prev, ...picked].slice(0, 5))
  }

  const removeFile = (i) =>
    setFiles((prev) => prev.filter((_, idx) => idx !== i))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedClient) {
      setError('Please select a client.')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      const payload = new FormData()
      payload.append('title', form.title)
      payload.append('description', form.description)
      payload.append('priority', form.priority)
      // Tell the backend who this issue belongs to
      payload.append('targetClientUid', selectedClient.uid)
      payload.append('targetClientEmail', selectedClient.email)
      if (selectedClient.companyId)
        payload.append('companyId', selectedClient.companyId)
      if (selectedClient.companyTier)
        payload.append('companyTier', selectedClient.companyTier)
      files.forEach((f) => payload.append('attachments', f))
      await onSubmit(payload)
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Label>Client</Label>
      {preselectedClient ? (
        <ClientBadge>
          <User size={14} />
          {preselectedClient.email}
          {preselectedClient.companyName &&
            ` — ${preselectedClient.companyName}`}
        </ClientBadge>
      ) : (
        <Select
          value={selectedClient?.uid || ''}
          onChange={(e) =>
            setSelectedClient(
              clients.find((c) => c.uid === e.target.value) || null,
            )
          }
          disabled={clientsLoading}
          required
        >
          <option value="">
            {clientsLoading ? 'Loading clients…' : '— Select a client —'}
          </option>
          {clients.map((c) => (
            <option key={c.uid} value={c.uid}>
              {c.email}
              {c.companyName ? ` (${c.companyName})` : ''}
            </option>
          ))}
        </Select>
      )}

      <Label>Title</Label>
      <Input
        placeholder="Briefly describe the issue"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
        minLength={3}
        maxLength={200}
        autoFocus
      />

      <Label>Description</Label>
      <Textarea
        placeholder="Provide as much detail as possible..."
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        required
        maxLength={5000}
      />

      <Label>Priority</Label>
      <Select
        value={form.priority}
        onChange={(e) => setForm({ ...form, priority: e.target.value })}
      >
        <option value="low">Low</option>
        <option value="normal">Normal</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
      </Select>

      <Label>Attachments (optional, up to 5)</Label>
      <FileDrop>
        <Upload size={20} />
        <span>
          {files.length === 0
            ? 'Click to add screenshots'
            : `${files.length} file${files.length > 1 ? 's' : ''} selected`}
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
      </FileDrop>
      {files.length > 0 && (
        <Previews>
          {files.map((file, i) => (
            <Preview key={i}>
              <img src={URL.createObjectURL(file)} alt={file.name} />
              <button type="button" onClick={() => removeFile(i)}>
                <X size={14} />
              </button>
            </Preview>
          ))}
        </Previews>
      )}

      {(error || clientsError) && (
        <ErrorMessage>{error || clientsError}</ErrorMessage>
      )}

      <Actions>
        <SecondaryButton type="button" onClick={onCancel}>
          Cancel
        </SecondaryButton>
        <Button type="submit" disabled={submitting || !selectedClient}>
          {submitting ? 'Creating…' : 'Create issue for client'}
        </Button>
      </Actions>
    </Form>
  )
}

export default AdminIssueForm
