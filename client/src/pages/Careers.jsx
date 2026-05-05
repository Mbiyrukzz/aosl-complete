import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import {
  ArrowUpRight,
  MapPin,
  Briefcase,
  Coffee,
  Heart,
  Zap,
  Send,
} from 'lucide-react'
import Modal from '../components/Modal'
import ApplicationForm from '../components/ApplicationForm'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`

/* ---------- Layout ---------- */

const Page = styled.div`
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-family: 'Inter', system-ui, sans-serif;
`

const Hero = styled.section`
  position: relative;
  padding: 8rem 2rem 4rem;
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
  overflow: hidden;
`

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 0.85rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 1.5rem;
`

const Headline = styled.h1`
  font-size: clamp(2.5rem, 5.5vw, 4.25rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.035em;
  margin: 0 0 1rem 0;
  animation: ${fadeUp} 0.6s ease-out;

  span.accent {
    color: ${({ theme }) => theme.colors.primary};
    font-style: italic;
  }
`

const Lead = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0 auto;
  max-width: 600px;
  animation: ${fadeUp} 0.6s ease-out 0.1s backwards;
`

/* ---------- Values ---------- */

const ValuesSection = styled.section`
  max-width: 1100px;
  margin: 0 auto;
  padding: 3rem 2rem 5rem;
`

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;

  @media (max-width: 880px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

const ValueCard = styled.div`
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};

  .icon {
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 0.85rem;
  }

  h4 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 0.4rem 0;
    color: ${({ theme }) => theme.colors.text};
  }

  p {
    font-size: 0.88rem;
    line-height: 1.55;
    color: ${({ theme }) => theme.colors.muted};
    margin: 0;
  }
`

/* ---------- Jobs section ---------- */

const Jobs = styled.section`
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 2rem 6rem;
`

const SectionTitle = styled.div`
  margin-bottom: 2rem;

  .mono {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: ${({ theme }) => theme.colors.muted};
  }

  h2 {
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    margin: 0.5rem 0 0 0;
    color: ${({ theme }) => theme.colors.text};
  }
`

const JobCard = styled(Link)`
  display: block;
  padding: 1.75rem 2rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  margin-bottom: 0.85rem;
  text-decoration: none;
  color: inherit;
  transition:
    border-color 0.2s ease,
    transform 0.18s ease;
  position: relative;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateX(4px);

    .arrow {
      opacity: 1;
      transform: translate(2px, -2px);
    }
  }

  .top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }

  h3 {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: ${({ theme }) => theme.colors.text};
    letter-spacing: -0.015em;
  }

  .meta {
    display: flex;
    gap: 0.85rem;
    flex-wrap: wrap;
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.85rem;
  }

  .meta-item {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }

  .arrow {
    opacity: 0.5;
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.muted};
  }
`

/* ---------- Empty state ---------- */

const EmptyCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 3rem 2.5rem;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at top,
      ${({ theme }) => theme.colors.primary}11,
      transparent 60%
    );
    pointer-events: none;
  }

  .icon-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.background};
    border: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 1.25rem;
  }

  h3 {
    position: relative;
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.85rem 0;
    color: ${({ theme }) => theme.colors.text};
    letter-spacing: -0.02em;
  }

  p {
    position: relative;
    font-size: 1rem;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.muted};
    max-width: 440px;
    margin: 0 auto 1.75rem;
  }
`

const PrimaryButton = styled.button`
  position: relative;
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
    transform 0.15s ease,
    opacity 0.15s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    opacity: 0.92;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const GeneralCTAStrip = styled.div`
  margin-top: 2.5rem;
  padding: 1.5rem 1.75rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;

  .text {
    flex: 1;
    min-width: 200px;
  }

  h4 {
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.text};
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.88rem;
  }
`

/* ---------- Helpers ---------- */

const formatJobType = (type) =>
  ({
    full_time: 'Full-time',
    part_time: 'Part-time',
    contract: 'Contract',
    internship: 'Internship',
  })[type] || type

/* ---------- Component ---------- */

const Careers = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/jobs`)
      .then((res) => setJobs(res.data.jobs))
      .catch((err) => console.error('Failed to load jobs:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Page>
      <Hero>
        <Eyebrow>// Careers at AOS</Eyebrow>
        <Headline>
          Build software with <span className="accent">people who care.</span>
        </Headline>
        <Lead>
          We're a small team in Mombasa shipping real products for real
          businesses. If that sounds like your kind of place, we'd love to hear
          from you.
        </Lead>
      </Hero>

      <ValuesSection>
        <ValuesGrid>
          <ValueCard>
            <Briefcase className="icon" size={22} />
            <h4>Real ownership</h4>
            <p>
              You own what you ship. No layers of approval, no committee design.
            </p>
          </ValueCard>
          <ValueCard>
            <Zap className="icon" size={22} />
            <h4>Ship often</h4>
            <p>
              Weekly demos, fast feedback loops. Small things shipped beats big
              things planned.
            </p>
          </ValueCard>
          <ValueCard>
            <Heart className="icon" size={22} />
            <h4>People first</h4>
            <p>
              Flexible hours, remote-friendly, and time off that means time off.
            </p>
          </ValueCard>
          <ValueCard>
            <Coffee className="icon" size={22} />
            <h4>Keep learning</h4>
            <p>
              Budget for books, courses, conferences. Get paid to get better.
            </p>
          </ValueCard>
        </ValuesGrid>
      </ValuesSection>

      <Jobs>
        <SectionTitle>
          <span className="mono">// Open positions</span>
          <h2>
            {jobs.length > 0
              ? `${jobs.length} open role${jobs.length === 1 ? '' : 's'}`
              : 'Open positions'}
          </h2>
        </SectionTitle>

        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Loading...</p>
        ) : jobs.length === 0 ? (
          <EmptyCard>
            <span className="icon-wrap">
              <Briefcase size={26} />
            </span>
            <h3>No open roles right now</h3>
            <p>
              We're not actively hiring at the moment, but we're always
              interested in connecting with talented people. Send us your CV and
              we'll reach out when something opens up that fits.
            </p>
            <PrimaryButton onClick={() => setModalOpen(true)}>
              <Send size={16} /> Send your CV
            </PrimaryButton>
          </EmptyCard>
        ) : (
          <>
            {jobs.map((job) => (
              <JobCard key={job._id} to={`/careers/${job._id}`}>
                <div className="top">
                  <div>
                    <h3>{job.title}</h3>
                    <div className="meta">
                      <span className="meta-item">
                        <Briefcase size={13} />
                        {formatJobType(job.type)}
                      </span>
                      <span className="meta-item">
                        <MapPin size={13} />
                        {job.location}
                      </span>
                      {job.salaryRange && (
                        <span className="meta-item">{job.salaryRange}</span>
                      )}
                    </div>
                  </div>
                  <ArrowUpRight className="arrow" size={20} />
                </div>
              </JobCard>
            ))}

            <GeneralCTAStrip>
              <div className="text">
                <h4>Don't see a fit?</h4>
                <p>
                  We're always open to connecting with talented people. Send us
                  your CV.
                </p>
              </div>
              <PrimaryButton onClick={() => setModalOpen(true)}>
                <Send size={16} /> Send your CV
              </PrimaryButton>
            </GeneralCTAStrip>
          </>
        )}
      </Jobs>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Send us your CV"
      >
        <ApplicationForm onClose={() => setModalOpen(false)} />
      </Modal>
    </Page>
  )
}

/* ---------- Application form (reusable) ---------- */

export default Careers
