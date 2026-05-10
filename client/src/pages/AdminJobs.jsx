import { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { useAuthedRequest } from '../hooks/useAuthedRequest'
import Modal from '../components/Modal'
import { FullScreenLoader } from '../components/Loader'

const Wrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
`

const PageHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`

const Heading = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;

  .icon-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: rgba(99, 102, 241, 0.12);
    color: #6366f1;
    border-radius: ${({ theme }) => theme.radii.lg};
  }

  h1 {
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 0.2rem 0;
    font-size: 1.65rem;
    letter-spacing: -0.02em;
  }

  p {
    color: ${({ theme }) => theme.colors.muted};
    margin: 0;
    font-size: 0.88rem;
  }
`

const NewButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.2rem;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  font-size: 0.92rem;
  cursor: pointer;
  font-family: inherit;
  transition: transform 0.15s ease;

  &:hover {
    transform: translateY(-1px);
  }
`

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

const Stat = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1rem 1.2rem;

  .num {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1;
    letter-spacing: -0.02em;
  }

  .lbl {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-top: 0.4rem;
  }
`

const JobRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: 0.5rem;
  transition: border-color 0.18s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr auto;
    .desktop {
      display: none;
    }
  }
`

const JobInfo = styled.div`
  min-width: 0;

  h3 {
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 0.3rem 0;
    font-size: 1rem;
    font-weight: 600;
  }

  .meta {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.82rem;
    display: flex;
    gap: 0.85rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .meta-item {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }
`

const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;

  background: ${({ $status }) =>
    $status === 'open' ? 'rgba(16,185,129,0.12)' : 'rgba(107,114,128,0.15)'};
  color: ${({ $status }) => ($status === 'open' ? '#10b981' : '#6b7280')};
`

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.muted};
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    border-color: ${({ $danger }) => ($danger ? '#ef4444' : 'currentColor')};
    color: ${({ $danger, theme }) => ($danger ? '#ef4444' : theme.colors.text)};
  }
`

const Empty = styled.div`
  text-align: center;
  padding: 4rem 1rem;
  color: ${({ theme }) => theme.colors.muted};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
`

/* Job form inside modal */
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Row = styled.div`
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
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
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

const Select = styled.select`
  padding: 0.7rem 1rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 0.95rem;
  cursor: pointer;

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

const FormActions = styled.div`
  display: flex;
  gap: 0.6rem;
  justify-content: flex-end;
`

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.4rem;
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
  padding: 0.75rem 1.2rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
`

const formatJobType = (t) =>
  ({
    full_time: 'Full-time',
    part_time: 'Part-time',
    contract: 'Contract',
    internship: 'Internship',
  })[t] || t

const blankForm = {
  title: '',
  department: 'engineering',
  location: 'Remote',
  type: 'full_time',
  salaryRange: '',
  description: '',
  requirements: '',
  status: 'open',
}

const AdminJobs = () => {
  const { isReady, get, post, patch, del } = useAuthedRequest()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(blankForm)
  const [saving, setSaving] = useState(false)

  const fetchJobs = async () => {
    if (!isReady) return
    setLoading(true)
    try {
      const data = await get('/api/admin/jobs')
      setJobs(data.jobs)
    } catch (err) {
      console.error('Failed to fetch jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [isReady])

  const counts = {
    total: jobs.length,
    open: jobs.filter((j) => j.status === 'open').length,
    closed: jobs.filter((j) => j.status === 'closed').length,
  }

  const openCreate = () => {
    setEditingId(null)
    setForm(blankForm)
    setModalOpen(true)
  }

  const openEdit = (job) => {
    setEditingId(job._id)
    setForm({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      salaryRange: job.salaryRange || '',
      description: job.description,
      requirements: job.requirements || '',
      status: job.status,
    })
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingId) {
        const { job } = await patch(`/api/admin/jobs/${editingId}`, form)
        setJobs((prev) => prev.map((j) => (j._id === job._id ? job : j)))
      } else {
        const { job } = await post('/api/admin/jobs', form)
        setJobs((prev) => [job, ...prev])
      }
      setModalOpen(false)
    } catch (err) {
      alert('Failed to save: ' + (err.response?.data?.error || err.message))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this job? This cannot be undone.')) return
    try {
      await del(`/api/admin/jobs/${id}`)
      setJobs((prev) => prev.filter((j) => j._id !== id))
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.error || err.message))
    }
  }

  const updateField = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value })

  return (
    <Wrapper>
      <PageHead>
        <Heading>
          <span className="icon-wrap">
            <Briefcase size={22} />
          </span>
          <div>
            <h1>Jobs</h1>
            <p>Post and manage open positions for the careers page.</p>
          </div>
        </Heading>
        <NewButton onClick={openCreate}>
          <Plus size={16} /> New job
        </NewButton>
      </PageHead>

      <Stats>
        <Stat>
          <div className="num">{counts.total}</div>
          <div className="lbl">Total</div>
        </Stat>
        <Stat>
          <div className="num">{counts.open}</div>
          <div className="lbl">Open</div>
        </Stat>
        <Stat>
          <div className="num">{counts.closed}</div>
          <div className="lbl">Closed</div>
        </Stat>
      </Stats>

      {loading ? (
        <FullScreenLoader label="Loading Advertised Jobs..." />
      ) : jobs.length === 0 ? (
        <Empty>
          <p style={{ marginBottom: '1.25rem' }}>
            No jobs yet. Post your first opening to start receiving
            applications.
          </p>
          <NewButton onClick={openCreate}>
            <Plus size={16} /> Create first job
          </NewButton>
        </Empty>
      ) : (
        jobs.map((job) => (
          <JobRow key={job._id}>
            <JobInfo>
              <h3>{job.title}</h3>
              <div className="meta">
                <StatusPill $status={job.status}>
                  {job.status === 'open' ? (
                    <CheckCircle2 size={11} />
                  ) : (
                    <XCircle size={11} />
                  )}
                  {job.status}
                </StatusPill>
                <span className="meta-item">
                  <Briefcase size={12} /> {formatJobType(job.type)}
                </span>
                <span className="meta-item">
                  <MapPin size={12} /> {job.location}
                </span>
                <span className="meta-item desktop">
                  <Clock size={12} />{' '}
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </JobInfo>
            <IconButton onClick={() => openEdit(job)} aria-label="Edit">
              <Edit2 size={16} />
            </IconButton>
            <IconButton
              onClick={() => handleDelete(job._id)}
              $danger
              aria-label="Delete"
            >
              <Trash2 size={16} />
            </IconButton>
          </JobRow>
        ))
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit job' : 'New job'}
      >
        <Form onSubmit={handleSave}>
          <Field>
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={updateField('title')}
              placeholder="Senior Full-stack Engineer"
              required
            />
          </Field>

          <Row>
            <Field>
              <Label>Department</Label>
              <Select
                value={form.department}
                onChange={updateField('department')}
              >
                <option value="engineering">Engineering</option>
                <option value="design">Design</option>
                <option value="product">Product</option>
                <option value="business">Business</option>
                <option value="other">Other</option>
              </Select>
            </Field>
            <Field>
              <Label>Type</Label>
              <Select value={form.type} onChange={updateField('type')}>
                <option value="full_time">Full-time</option>
                <option value="part_time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </Select>
            </Field>
          </Row>

          <Row>
            <Field>
              <Label>Location</Label>
              <Input
                value={form.location}
                onChange={updateField('location')}
                placeholder="Mombasa or Remote"
              />
            </Field>
            <Field>
              <Label>Salary range</Label>
              <Input
                value={form.salaryRange}
                onChange={updateField('salaryRange')}
                placeholder="Competitive, or $50k–$80k"
              />
            </Field>
          </Row>

          <Field>
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={updateField('description')}
              placeholder="What this role does, who it reports to, what success looks like..."
              required
            />
          </Field>

          <Field>
            <Label>Requirements</Label>
            <Textarea
              value={form.requirements}
              onChange={updateField('requirements')}
              placeholder="Years of experience, must-have skills, nice-to-haves..."
            />
          </Field>

          <Field>
            <Label>Status</Label>
            <Select value={form.status} onChange={updateField('status')}>
              <option value="open">Open — visible on careers page</option>
              <option value="closed">Closed — hidden from public</option>
            </Select>
          </Field>

          <FormActions>
            <SecondaryButton type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Save changes' : 'Create job'}
            </PrimaryButton>
          </FormActions>
        </Form>
      </Modal>
    </Wrapper>
  )
}

export default AdminJobs
