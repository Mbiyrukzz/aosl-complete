import { useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import { ArrowLeft, Check, X, Trash2, Power } from 'lucide-react'
import { useSites } from '../hooks/useSites'
import { ROUTES } from '../constants/routes'

const Wrapper = styled.div`
  max-width: 640px;
  margin: 0 auto;
  padding: 2rem;
`
const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: ${({ theme }) => theme.colors.muted};
  text-decoration: none;
  font-size: 0.88rem;
  margin-bottom: 1.25rem;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`
const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  padding: 1.5rem;
`
const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 1rem;
  label {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.muted};
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  input,
  select {
    padding: 0.55rem 0.7rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
  }
`
const ActionRow = styled.div`
  display: flex;
  gap: 0.6rem;
  justify-content: flex-end;
  margin-top: 1.25rem;
`
const Btn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  border: 1px solid
    ${({ $primary, $danger, theme }) =>
      $danger
        ? '#ef4444'
        : $primary
          ? theme.colors.primary
          : theme.colors.border};
  background: ${({ $primary, theme }) =>
    $primary ? theme.colors.primary : 'transparent'};
  color: ${({ $primary, $danger, theme }) =>
    $primary ? 'white' : $danger ? '#ef4444' : theme.colors.text};
`

const SiteDetailPage = () => {
  const { id } = useParams()
  const { sites, updateSite, deleteSite } = useSites()
  const site = sites.find((s) => s._id === id)

  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  if (!site) return <Navigate to={ROUTES.ADMIN_SITES} replace />

  const current = form || {
    name: site.name,
    type: site.type,
    validationUrl: site.validationUrl || '',
    confirmationUrl: site.confirmationUrl || '',
    active: site.active,
  }
  const dirty = !!form

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      await updateSite(site._id, current)
      setForm(null)
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (
      !confirm(
        `Delete site "${site.prefix}"? Live traffic for this prefix will start returning "unmatched".`,
      )
    )
      return
    await deleteSite(site._id)
  }

  return (
    <Wrapper>
      <BackLink to={ROUTES.ADMIN_SITES}>
        <ArrowLeft size={15} /> All sites
      </BackLink>
      <Card>
        <h2 style={{ marginTop: 0 }}>
          {site.prefix}{' '}
          <span style={{ opacity: 0.5, fontWeight: 400 }}>· {site.name}</span>
        </h2>

        <Field>
          <label>Name</label>
          <input
            value={current.name}
            onChange={(e) => setForm({ ...current, name: e.target.value })}
          />
        </Field>

        <Field>
          <label>Type</label>
          <select
            value={current.type}
            onChange={(e) => setForm({ ...current, type: e.target.value })}
          >
            <option value="remote">Remote (forward)</option>
            <option value="local">Local (handled here)</option>
          </select>
        </Field>

        {current.type !== 'local' && (
          <>
            <Field>
              <label>Validation URL</label>
              <input
                value={current.validationUrl}
                onChange={(e) =>
                  setForm({ ...current, validationUrl: e.target.value })
                }
              />
            </Field>
            <Field>
              <label>Confirmation URL</label>
              <input
                value={current.confirmationUrl}
                onChange={(e) =>
                  setForm({ ...current, confirmationUrl: e.target.value })
                }
              />
            </Field>
          </>
        )}

        {error && (
          <div style={{ color: '#ef4444', fontSize: '0.85rem' }}>{error}</div>
        )}

        <ActionRow>
          <Btn $danger onClick={handleDelete}>
            <Trash2 size={14} /> Delete
          </Btn>
          <Btn onClick={() => setForm({ ...current, active: !current.active })}>
            <Power size={14} /> {current.active ? 'Deactivate' : 'Activate'}
          </Btn>
          {dirty && (
            <>
              <Btn onClick={() => setForm(null)}>
                <X size={14} /> Cancel
              </Btn>
              <Btn $primary onClick={handleSave} disabled={saving}>
                <Check size={14} /> {saving ? 'Saving…' : 'Save changes'}
              </Btn>
            </>
          )}
        </ActionRow>
      </Card>
    </Wrapper>
  )
}

export default SiteDetailPage
