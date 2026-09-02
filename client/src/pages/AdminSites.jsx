import { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Plus, Trash2, X, Check, Building2, Power } from 'lucide-react'
import { useSites } from '../hooks/useSites'
import { buildAdminSitePath } from '../constants/routes'

const Wrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
`
const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`
const NewButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.1rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  cursor: pointer;
`
const Table = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
`
const Row = styled.div`
  display: grid;
  grid-template-columns: 90px 1fr 90px 90px auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  &:last-child {
    border-bottom: none;
  }
`
const RowLink = styled(Link)`
  display: contents;
  color: inherit;
  text-decoration: none;
`
const Prefix = styled.span`
  font-family: ui-monospace, monospace;
  font-weight: 700;
`
const StatusDot = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ $active }) => ($active ? '#10b981' : '#6b7280')};
  font-size: 0.78rem;
  font-weight: 600;
`
const Actions = styled.div`
  display: flex;
  gap: 0.4rem;
  justify-self: end;
`
const IconBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.muted};
  &:hover {
    background: rgba(99, 102, 241, 0.1);
    color: ${({ theme }) => theme.colors.primary};
  }
`
const FormCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.25rem;
  margin-bottom: 1.25rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`
const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  grid-column: ${({ $full }) => ($full ? '1 / -1' : 'auto')};
  label {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.muted};
  }
  input,
  select {
    padding: 0.5rem 0.6rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
  }
`
const FormActions = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`

// example URLs assume ashmif.com hosts SR/PR/HQ/MLD on subdomains —
// adjust the placeholder text below to whatever your real domains are
const emptyForm = {
  prefix: '',
  name: '',
  type: 'remote',
  validationUrl: '',
  confirmationUrl: '',
}

const AdminSites = () => {
  const { sites, createSite, updateSite, deleteSite } = useSites()
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleCreate = async () => {
    if (!form.prefix.trim() || !form.name.trim()) return
    if (
      form.type !== 'local' &&
      (!form.validationUrl.trim() || !form.confirmationUrl.trim())
    ) {
      setError(
        'Validation and confirmation URLs are required for remote sites.',
      )
      return
    }
    setSaving(true)
    setError(null)
    try {
      await createSite(form)
      setForm(emptyForm)
      setCreating(false)
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = (site, e) => {
    e.preventDefault()
    e.stopPropagation()
    updateSite(site._id, { active: !site.active })
  }

  const handleDelete = async (site, e) => {
    e.preventDefault()
    e.stopPropagation()
    if (
      !confirm(
        `Remove site "${site.prefix}"? Live traffic for this prefix will start returning "unmatched".`,
      )
    )
      return
    await deleteSite(site._id)
  }

  return (
    <Wrapper>
      <Head>
        <h1>
          <Building2
            size={18}
            style={{ verticalAlign: 'middle', marginRight: 8 }}
          />
          Sites
        </h1>
        <NewButton onClick={() => setCreating((v) => !v)}>
          {creating ? <X size={16} /> : <Plus size={16} />}
          {creating ? 'Cancel' : 'New site'}
        </NewButton>
      </Head>

      {creating && (
        <FormCard>
          <Field>
            <label>Prefix</label>
            <input
              value={form.prefix}
              onChange={(e) =>
                setForm((f) => ({ ...f, prefix: e.target.value.toUpperCase() }))
              }
              placeholder="HQ"
            />
          </Field>
          <Field>
            <label>Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Headquarters"
            />
          </Field>
          <Field>
            <label>Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            >
              <option value="remote">Remote (forward)</option>
              <option value="local">Local (handled here)</option>
            </select>
          </Field>
          {form.type !== 'local' && (
            <>
              <Field $full>
                <label>Validation URL</label>
                <input
                  value={form.validationUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, validationUrl: e.target.value }))
                  }
                  placeholder="https://hq.ashmif.com/payments/mobile/c2b/validation"
                />
              </Field>
              <Field $full>
                <label>Confirmation URL</label>
                <input
                  value={form.confirmationUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, confirmationUrl: e.target.value }))
                  }
                  placeholder="https://hq.ashmif.com/payments/mobile/c2b/confirmation"
                />
              </Field>
            </>
          )}
          {error && (
            <div
              style={{
                color: '#ef4444',
                gridColumn: '1 / -1',
                fontSize: '0.85rem',
              }}
            >
              {error}
            </div>
          )}
          <FormActions>
            <NewButton onClick={handleCreate} disabled={saving}>
              <Check size={15} /> {saving ? 'Saving…' : 'Create site'}
            </NewButton>
          </FormActions>
        </FormCard>
      )}

      <Table>
        {sites.map((site) => (
          <RowLink key={site._id} to={buildAdminSitePath(site._id)}>
            <Row>
              <Prefix>{site.prefix}</Prefix>
              <span>{site.name}</span>
              <span style={{ fontSize: '0.78rem', opacity: 0.7 }}>
                {site.type}
              </span>
              <StatusDot
                $active={site.active}
                onClick={(e) => toggleActive(site, e)}
              >
                <Power size={12} /> {site.active ? 'Active' : 'Off'}
              </StatusDot>
              <Actions>
                <IconBtn title="Delete" onClick={(e) => handleDelete(site, e)}>
                  <Trash2 size={14} />
                </IconBtn>
              </Actions>
            </Row>
          </RowLink>
        ))}
        {sites.length === 0 && (
          <Row style={{ gridTemplateColumns: '1fr', color: 'var(--muted)' }}>
            No sites yet.
          </Row>
        )}
      </Table>
    </Wrapper>
  )
}

export default AdminSites
