import { useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { Upload, X, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};

  .required {
    color: ${({ theme }) => theme.colors.primary};
  }
`

const Input = styled.input`
  padding: 0.7rem 1rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const Textarea = styled.textarea`
  padding: 0.7rem 1rem;
  min-height: 100px;
  resize: vertical;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 0.95rem;
  line-height: 1.5;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const FileDrop = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  text-align: center;
  transition: border-color 0.18s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  .icon {
    color: ${({ theme }) => theme.colors.muted};
  }

  .primary {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
    font-size: 0.92rem;
  }

  .meta {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.78rem;
  }

  input {
    display: none;
  }
`

const SelectedFile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 0.9rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};

  .name {
    flex: 1;
    font-size: 0.88rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .size {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.78rem;
    font-family: 'JetBrains Mono', monospace;
  }

  button {
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.colors.muted};
    cursor: pointer;
    padding: 0.2rem;
    display: inline-flex;

    &:hover {
      color: #ef4444;
    }
  }
`

const ProgressBar = styled.div`
  height: 4px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 2px;
  overflow: hidden;
  margin-top: 0.4rem;

  .fill {
    height: 100%;
    background: ${({ theme }) => theme.colors.primary};
    width: ${({ $progress }) => $progress}%;
    transition: width 0.18s ease;
  }
`

const Status = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  padding: 0.85rem 1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.9rem;
  line-height: 1.5;

  ${({ $kind }) =>
    $kind === 'success'
      ? `background: rgba(16, 185, 129, 0.1); color: #10b981;`
      : `background: rgba(239, 68, 68, 0.1); color: #ef4444;`}

  svg {
    flex-shrink: 0;
    margin-top: 1px;
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
  gap: 0.5rem;
  padding: 0.85rem 1.4rem;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  font-family: inherit;
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    opacity: 0.92;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const ApplicationForm = ({
  jobId = null,
  jobTitle = '',
  onClose,
  onSuccess,
}) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
  })
  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState(null)

  const updateField = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value })

  const handleFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 10 * 1024 * 1024) {
      setStatus({ kind: 'error', message: 'File is too large (max 10MB)' })
      return
    }
    setFile(f)
    setStatus(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setStatus({ kind: 'error', message: 'Please attach your CV' })
      return
    }

    setSubmitting(true)
    setProgress(0)
    setStatus(null)

    const data = new FormData()
    data.append('cv', file)
    data.append('name', form.name)
    data.append('email', form.email)
    data.append('phone', form.phone)
    data.append('coverLetter', form.coverLetter)
    if (jobId) data.append('jobId', jobId)

    try {
      await axios.post(`${API_BASE}/api/applications`, data, {
        onUploadProgress: (evt) => {
          if (evt.total) {
            setProgress(Math.round((evt.loaded * 100) / evt.total))
          }
        },
      })

      setStatus({
        kind: 'success',
        message: jobTitle
          ? `Application sent for ${jobTitle}. We'll review it and be in touch.`
          : `Got it! We received your CV and will reach out if something opens up.`,
      })

      if (onSuccess) onSuccess()

      setTimeout(() => {
        if (onClose) onClose()
      }, 2200)
    } catch (err) {
      setStatus({
        kind: 'error',
        message: err.response?.data?.error || 'Failed to submit. Try again.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      {jobTitle && (
        <p
          style={{
            margin: '-0.5rem 0 0',
            fontSize: '0.88rem',
            color: 'var(--muted, #6b7280)',
          }}
        >
          Applying for: <strong>{jobTitle}</strong>
        </p>
      )}

      <Field>
        <Label>
          Name<span className="required"> *</span>
        </Label>
        <Input
          type="text"
          value={form.name}
          onChange={updateField('name')}
          placeholder="Jane Doe"
          required
        />
      </Field>

      <Field>
        <Label>
          Email<span className="required"> *</span>
        </Label>
        <Input
          type="email"
          value={form.email}
          onChange={updateField('email')}
          placeholder="jane@example.com"
          required
        />
      </Field>

      <Field>
        <Label>Phone</Label>
        <Input
          type="tel"
          value={form.phone}
          onChange={updateField('phone')}
          placeholder="+254 700 000 000"
        />
      </Field>

      <Field>
        <Label>Cover letter (optional)</Label>
        <Textarea
          value={form.coverLetter}
          onChange={updateField('coverLetter')}
          placeholder="Anything else you'd like us to know — your interests, recent work, why us..."
        />
      </Field>

      <Field>
        <Label>
          CV<span className="required"> *</span>
        </Label>
        {file ? (
          <>
            <SelectedFile>
              <div className="name">{file.name}</div>
              <div className="size">{formatBytes(file.size)}</div>
              {!submitting && (
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  aria-label="Remove file"
                >
                  <X size={16} />
                </button>
              )}
            </SelectedFile>
            {submitting && progress > 0 && (
              <ProgressBar $progress={progress}>
                <div className="fill" />
              </ProgressBar>
            )}
          </>
        ) : (
          <FileDrop>
            <Upload className="icon" size={20} />
            <span className="primary">Click to upload your CV</span>
            <span className="meta">PDF, DOC, DOCX · max 10MB</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFile}
            />
          </FileDrop>
        )}
      </Field>

      {status && (
        <Status $kind={status.kind}>
          {status.kind === 'success' ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          {status.message}
        </Status>
      )}

      <Actions>
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            progress > 0 && progress < 100 ? (
              `Uploading ${progress}%...`
            ) : (
              'Sending...'
            )
          ) : (
            <>
              Submit application <ArrowRight size={16} />
            </>
          )}
        </Button>
      </Actions>
    </Form>
  )
}

export default ApplicationForm
