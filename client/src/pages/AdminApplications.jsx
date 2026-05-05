import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  Inbox,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Download,
  Trash2,
  Search,
  Filter,
  FileText,
  X,
} from 'lucide-react'
import { useAuthedRequest } from '../hooks/useAuthedRequest'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

/* ---------- Layout ---------- */

const Wrapper = styled.div`
  max-width: 1200px;
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

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  @media (max-width: 880px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const Stat = styled.button`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 0.85rem 1rem;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  transition:
    border-color 0.18s ease,
    transform 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
  }

  .num {
    font-size: 1.4rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1;
    letter-spacing: -0.02em;
  }

  .lbl {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-top: 0.4rem;
  }
`

const Toolbar = styled.div`
  display: flex;
  gap: 0.6rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`

const SearchWrap = styled.div`
  position: relative;
  flex: 1;
  min-width: 220px;

  svg {
    position: absolute;
    left: 0.7rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.muted};
    pointer-events: none;
  }
`

const SearchInput = styled.input`
  width: 100%;
  padding: 0.55rem 0.7rem 0.55rem 2.1rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.88rem;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const SelectWrap = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;

  svg {
    position: absolute;
    left: 0.65rem;
    color: ${({ theme }) => theme.colors.muted};
    pointer-events: none;
  }
`

const StyledSelect = styled.select`
  padding: 0.55rem 0.7rem 0.55rem 2rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.85rem;
  font-family: inherit;
  cursor: pointer;
  appearance: none;
  padding-right: 1.8rem;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.6rem center;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

/* ---------- Two-column inbox layout ---------- */

const InboxLayout = styled.div`
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 1rem;
  min-height: 60vh;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`

const ListPane = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 75vh;

  @media (max-width: 960px) {
    max-height: none;
    display: ${({ $hideOnMobile }) => ($hideOnMobile ? 'none' : 'flex')};
  }
`

const DetailPane = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.75rem;
  overflow-y: auto;
  max-height: 75vh;

  @media (max-width: 960px) {
    max-height: none;
    display: ${({ $hideOnMobile }) => ($hideOnMobile ? 'none' : 'block')};
  }
`

const ListScroll = styled.div`
  overflow-y: auto;
  flex: 1;
`

const ListItem = styled.button`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.background : 'transparent'};
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s ease;
  position: relative;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }

  ${({ $unread, theme }) =>
    $unread &&
    `
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: ${theme.colors.primary};
    }
  `}
`

const Avatar = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 0.78rem;
  font-weight: 700;
  flex-shrink: 0;
`

const ListItemBody = styled.div`
  flex: 1;
  min-width: 0;

  .top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
  }

  .name {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.92rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .time {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.72rem;
    flex-shrink: 0;
  }

  .role {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.82rem;
    margin-bottom: 0.4rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const StatusDot = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  margin-right: 0.4rem;
  vertical-align: middle;
`

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${({ $tint }) => $tint};
  color: ${({ $color }) => $color};
`

/* ---------- Detail panel ---------- */

const DetailHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const BigAvatar = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  flex-shrink: 0;
`

const DetailHeaderInfo = styled.div`
  flex: 1;
  min-width: 0;

  h2 {
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 0.3rem 0;
    font-size: 1.4rem;
    letter-spacing: -0.02em;
  }

  .role {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.92rem;
  }
`

const CloseDetail = styled.button`
  display: none;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.muted};
  cursor: pointer;

  @media (max-width: 960px) {
    display: inline-flex;
  }
`

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }
`

const InfoBox = styled.div`
  padding: 0.85rem 1rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};

  .lbl {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.3rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .val {
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.92rem;
    word-break: break-word;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`

const SectionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 0.85rem 0;
  color: ${({ theme }) => theme.colors.muted};
`

const CoverLetter = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 1rem 1.2rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.65;
  font-size: 0.93rem;
  white-space: pre-wrap;
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`

const StatusSelect = styled.select`
  padding: 0.6rem 2rem 0.6rem 0.85rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.88rem;
  font-family: inherit;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.65rem center;
`

const DownloadButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1rem;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  font-size: 0.88rem;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.9;
  }
`

const DangerButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1rem;
  background: transparent;
  color: #ef4444;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 500;
  font-size: 0.88rem;
  cursor: pointer;
  font-family: inherit;
  margin-left: auto;

  &:hover {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.08);
  }
`

const Empty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};

  svg {
    color: ${({ theme }) => theme.colors.border};
    margin-bottom: 1rem;
  }

  h3 {
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 0.4rem 0;
    font-size: 1.1rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 0.88rem;
    max-width: 320px;
  }
`

/* ---------- Constants ---------- */

const STATUS_CONFIG = {
  new: { color: '#3b82f6', tint: 'rgba(59,130,246,0.12)', label: 'New' },
  reviewing: {
    color: '#d97706',
    tint: 'rgba(245,158,11,0.12)',
    label: 'Reviewing',
  },
  shortlisted: {
    color: '#6366f1',
    tint: 'rgba(99,102,241,0.12)',
    label: 'Shortlisted',
  },
  rejected: {
    color: '#ef4444',
    tint: 'rgba(239,68,68,0.12)',
    label: 'Rejected',
  },
  hired: { color: '#10b981', tint: 'rgba(16,185,129,0.12)', label: 'Hired' },
}

const initials = (name = '') => {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const formatTime = (date) => {
  const d = new Date(date)
  const diffDay = Math.floor((Date.now() - d) / 86400000)
  if (diffDay === 0) return 'Today'
  if (diffDay === 1) return 'Yesterday'
  if (diffDay < 7) return `${diffDay}d ago`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

const formatFullDate = (date) =>
  new Date(date).toLocaleString(undefined, {
    dateStyle: 'long',
    timeStyle: 'short',
  })

/* ---------- Component ---------- */

const AdminApplications = () => {
  const { isReady, get, patch, del } = useAuthedRequest()

  const [applications, setApplications] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [jobFilter, setJobFilter] = useState('all')
  const [search, setSearch] = useState('')

  const fetchApplications = async () => {
    if (!isReady) return
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.set('status', statusFilter)
      if (jobFilter !== 'all') params.set('jobId', jobFilter)
      if (search.trim()) params.set('search', search.trim())

      const qs = params.toString() ? `?${params.toString()}` : ''
      const data = await get(`/api/admin/applications${qs}`)
      setApplications(data.applications)
      setJobs(data.jobs || [])
    } catch (err) {
      console.error('Failed to fetch applications:', err)
    } finally {
      setLoading(false)
    }
  }

  // Refetch when filters change (debounce search)
  useEffect(() => {
    if (!isReady) return
    const timer = setTimeout(fetchApplications, 250)
    return () => clearTimeout(timer)
  }, [isReady, statusFilter, jobFilter, search])

  const counts = useMemo(() => {
    const c = {
      all: applications.length,
      new: 0,
      reviewing: 0,
      shortlisted: 0,
      hired: 0,
    }
    applications.forEach((a) => {
      if (c[a.status] !== undefined) c[a.status] += 1
    })
    return c
  }, [applications])

  const selected = applications.find((a) => a._id === selectedId)

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { application } = await patch(
        `/api/admin/applications/${id}/status`,
        {
          status: newStatus,
        },
      )
      setApplications((prev) =>
        prev.map((a) =>
          a._id === application._id ? { ...a, ...application } : a,
        ),
      )
    } catch (err) {
      alert(
        'Failed to update status: ' +
          (err.response?.data?.error || err.message),
      )
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this application? The CV file will also be deleted.'))
      return
    try {
      await del(`/api/admin/applications/${id}`)
      setApplications((prev) => prev.filter((a) => a._id !== id))
      if (selectedId === id) setSelectedId(null)
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.error || err.message))
    }
  }

  return (
    <Wrapper>
      <PageHead>
        <Heading>
          <span className="icon-wrap">
            <Inbox size={22} />
          </span>
          <div>
            <h1>Applications</h1>
            <p>Review CVs and applications submitted via the careers page.</p>
          </div>
        </Heading>
      </PageHead>

      <Stats>
        {[
          { key: 'all', label: 'Total' },
          { key: 'new', label: 'New' },
          { key: 'reviewing', label: 'Reviewing' },
          { key: 'shortlisted', label: 'Shortlisted' },
          { key: 'hired', label: 'Hired' },
        ].map((s) => (
          <Stat
            key={s.key}
            $active={statusFilter === s.key}
            onClick={() => setStatusFilter(s.key)}
          >
            <div className="num">{counts[s.key] ?? 0}</div>
            <div className="lbl">{s.label}</div>
          </Stat>
        ))}
      </Stats>

      <Toolbar>
        <SearchWrap>
          <Search size={15} />
          <SearchInput
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchWrap>

        <SelectWrap>
          <Filter size={14} />
          <StyledSelect
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
          >
            <option value="all">All positions</option>
            <option value="general">General CV submissions</option>
            {jobs.map((job) => (
              <option key={job._id} value={job._id}>
                {job.title}
              </option>
            ))}
          </StyledSelect>
        </SelectWrap>
      </Toolbar>

      <InboxLayout>
        <ListPane $hideOnMobile={!!selected}>
          {loading ? (
            <Empty>
              <p>Loading...</p>
            </Empty>
          ) : applications.length === 0 ? (
            <Empty>
              <Inbox size={36} />
              <h3>No applications yet</h3>
              <p>
                When people apply via your careers page, their CVs will land
                here.
              </p>
            </Empty>
          ) : (
            <ListScroll>
              {applications.map((app) => {
                const status = STATUS_CONFIG[app.status] || STATUS_CONFIG.new
                return (
                  <ListItem
                    key={app._id}
                    $active={selectedId === app._id}
                    $unread={app.status === 'new'}
                    onClick={() => setSelectedId(app._id)}
                  >
                    <Avatar>{initials(app.name)}</Avatar>
                    <ListItemBody>
                      <div className="top">
                        <span className="name">{app.name}</span>
                        <span className="time">
                          {formatTime(app.createdAt)}
                        </span>
                      </div>
                      <div className="role">
                        {app.jobTitle || 'General CV submission'}
                      </div>
                      <div>
                        <StatusBadge $tint={status.tint} $color={status.color}>
                          <StatusDot $color={status.color} />
                          {status.label}
                        </StatusBadge>
                      </div>
                    </ListItemBody>
                  </ListItem>
                )
              })}
            </ListScroll>
          )}
        </ListPane>

        <DetailPane $hideOnMobile={!selected}>
          {!selected ? (
            <Empty>
              <FileText size={36} />
              <h3>Select an application</h3>
              <p>Pick someone from the list to see their full submission.</p>
            </Empty>
          ) : (
            <>
              <DetailHeader>
                <BigAvatar>{initials(selected.name)}</BigAvatar>
                <DetailHeaderInfo>
                  <h2>{selected.name}</h2>
                  <div className="role">
                    {selected.jobTitle
                      ? `Applied for ${selected.jobTitle}`
                      : 'General CV submission'}
                  </div>
                </DetailHeaderInfo>
                <CloseDetail
                  onClick={() => setSelectedId(null)}
                  aria-label="Close"
                >
                  <X size={16} />
                </CloseDetail>
              </DetailHeader>

              <InfoGrid>
                <InfoBox>
                  <div className="lbl">
                    <Mail size={11} /> Email
                  </div>
                  <div className="val">
                    <a href={`mailto:${selected.email}`}>{selected.email}</a>
                  </div>
                </InfoBox>
                {selected.phone && (
                  <InfoBox>
                    <div className="lbl">
                      <Phone size={11} /> Phone
                    </div>
                    <div className="val">
                      <a href={`tel:${selected.phone}`}>{selected.phone}</a>
                    </div>
                  </InfoBox>
                )}
                {selected.jobTitle && (
                  <InfoBox>
                    <div className="lbl">
                      <Briefcase size={11} /> Position
                    </div>
                    <div className="val">{selected.jobTitle}</div>
                  </InfoBox>
                )}
                <InfoBox>
                  <div className="lbl">
                    <Calendar size={11} /> Submitted
                  </div>
                  <div className="val">
                    {formatFullDate(selected.createdAt)}
                  </div>
                </InfoBox>
              </InfoGrid>

              {selected.coverLetter && (
                <>
                  <SectionTitle>Cover letter</SectionTitle>
                  <CoverLetter>{selected.coverLetter}</CoverLetter>
                </>
              )}

              <SectionTitle>Resume</SectionTitle>
              <InfoBox>
                <div className="lbl">
                  <FileText size={11} /> {selected.cvOriginalName}
                </div>
              </InfoBox>

              <Actions>
                <StatusSelect
                  value={selected.status}
                  onChange={(e) =>
                    handleStatusChange(selected._id, e.target.value)
                  }
                >
                  <option value="new">New</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                  <option value="hired">Hired</option>
                </StatusSelect>

                <DownloadButton
                  href={`${API_BASE}${selected.cvUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={selected.cvOriginalName}
                >
                  <Download size={14} /> Download CV
                </DownloadButton>

                <DangerButton onClick={() => handleDelete(selected._id)}>
                  <Trash2 size={14} /> Delete
                </DangerButton>
              </Actions>
            </>
          )}
        </DetailPane>
      </InboxLayout>
    </Wrapper>
  )
}

export default AdminApplications
