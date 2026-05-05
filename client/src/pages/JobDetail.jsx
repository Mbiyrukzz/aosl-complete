import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, Link, Navigate } from 'react-router-dom'
import styled from 'styled-components'
import { ArrowLeft, MapPin, Briefcase, Send } from 'lucide-react'
import Modal from '../components/Modal'
import { ROUTES } from '../constants/routes'
import ApplicationForm from '../components/ApplicationForm'
// import the ApplicationForm — easiest is to extract it to its own file,
// or just re-implement here. For brevity I'll reuse the in-page version.

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 8rem 2rem 4rem;
  font-family: 'Inter', system-ui, sans-serif;

  @media (max-width: 720px) {
    padding: 6rem 1.25rem 3rem;
  }
`

const Back = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: ${({ theme }) => theme.colors.muted};
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`

const Title = styled.h1`
  font-size: clamp(2rem, 4.5vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin: 0 0 1rem 0;
  color: ${({ theme }) => theme.colors.text};
`

const Meta = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  font-size: 0.92rem;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 2rem;

  .item {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }
`

const ApplyButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.9rem 1.5rem;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  font-family: inherit;
  margin-bottom: 2.5rem;
  transition: transform 0.15s ease;

  &:hover {
    transform: translateY(-1px);
  }
`

const Body = styled.div`
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.7;
  font-size: 1rem;

  h2 {
    font-size: 1.4rem;
    font-weight: 700;
    margin: 2.5rem 0 0.85rem 0;
    color: ${({ theme }) => theme.colors.text};
    letter-spacing: -0.015em;
  }

  p {
    white-space: pre-wrap;
    margin: 0 0 1rem 0;
    color: ${({ theme }) => theme.colors.text};
  }
`

const formatJobType = (type) =>
  ({
    full_time: 'Full-time',
    part_time: 'Part-time',
    contract: 'Contract',
    internship: 'Internship',
  })[type] || type

const JobDetail = () => {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/jobs/${id}`)
      .then((res) => setJob(res.data.job))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <Wrapper>
        <p>Loading...</p>
      </Wrapper>
    )
  }

  if (notFound || !job) return <Navigate to={ROUTES.CAREERS} replace />

  return (
    <Wrapper>
      <Back to={ROUTES.CAREERS}>
        <ArrowLeft size={15} /> All openings
      </Back>

      <Title>{job.title}</Title>
      <Meta>
        <span className="item">
          <Briefcase size={14} />
          {formatJobType(job.type)}
        </span>
        <span className="item">
          <MapPin size={14} />
          {job.location}
        </span>
        {job.salaryRange && <span className="item">{job.salaryRange}</span>}
      </Meta>

      <ApplyButton onClick={() => setModalOpen(true)}>
        <Send size={16} /> Apply now
      </ApplyButton>

      <Body>
        <h2>About the role</h2>
        <p>{job.description}</p>

        {job.requirements && (
          <>
            <h2>Requirements</h2>
            <p>{job.requirements}</p>
          </>
        )}
      </Body>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Apply: ${job.title}`}
      >
        {/* Reuse application form from Careers page */}
        <ApplicationFormInline
          jobId={job._id}
          jobTitle={job.title}
          onClose={() => setModalOpen(false)}
        />
      </Modal>
    </Wrapper>
  )
}

const ApplicationFormInline = (props) => {
  return <ApplicationForm {...props}></ApplicationForm>
}

export default JobDetail
