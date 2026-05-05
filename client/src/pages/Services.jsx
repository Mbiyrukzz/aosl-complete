import { Link } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  Smartphone,
  Globe,
  Server,
  Layers,
  Zap,
  Shield,
  GitBranch,
} from 'lucide-react'
import { ROUTES } from '../constants/routes'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`

const Page = styled.div`
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-family: 'Inter', system-ui, sans-serif;
`

/* ---------- Hero ---------- */

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
  margin: 0 0 1.25rem 0;
  animation: ${fadeUp} 0.6s ease-out;

  span.accent {
    color: ${({ theme }) => theme.colors.primary};
    font-style: italic;
  }
`

const Lead = styled.p`
  font-size: 1.15rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0 auto;
  max-width: 640px;
  animation: ${fadeUp} 0.6s ease-out 0.1s backwards;
`

/* ---------- Service cards ---------- */

const Services = styled.section`
  max-width: 1100px;
  margin: 0 auto;
  padding: 3rem 2rem;
`

const SectionHead = styled.div`
  margin-bottom: 2.5rem;

  .mono {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: ${({ theme }) => theme.colors.muted};
  }

  h2 {
    font-size: clamp(1.75rem, 3.5vw, 2.5rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 0.5rem 0 0 0;
    color: ${({ theme }) => theme.colors.text};
  }
`

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 880px) {
    grid-template-columns: 1fr;
  }
`

const ServiceCard = styled.div`
  position: relative;
  padding: 2rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  transition:
    border-color 0.2s ease,
    transform 0.18s ease;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }

  .icon-wrap {
    width: 52px;
    height: 52px;
    border-radius: ${({ theme }) => theme.radii.lg};
    background: ${({ $tint }) => $tint};
    color: ${({ $color }) => $color};
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  h3 {
    font-size: 1.4rem;
    font-weight: 700;
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    letter-spacing: -0.02em;
  }

  .desc {
    color: ${({ theme }) => theme.colors.muted};
    line-height: 1.6;
    font-size: 0.96rem;
    margin: 0;
  }

  .stack {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: auto;
  }
`

const Pill = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  padding: 0.3rem 0.65rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  color: ${({ theme }) => theme.colors.text};
`

/* ---------- Process ---------- */

const Process = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 4rem 2rem;
  margin-top: 3rem;
`

const ProcessInner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`

const ProcessSteps = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-top: 2.5rem;

  @media (max-width: 880px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

const Step = styled.div`
  position: relative;

  .num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.78rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 0.6rem;
  }

  h4 {
    font-size: 1.05rem;
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

/* ---------- Why us ---------- */

const Why = styled.section`
  max-width: 1100px;
  margin: 0 auto;
  padding: 4rem 2rem;
`

const WhyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 880px) {
    grid-template-columns: 1fr;
  }
`

const Why_Item = styled.div`
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};

  .icon {
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 0.85rem;
  }

  h4 {
    font-size: 1.05rem;
    font-weight: 600;
    margin: 0 0 0.4rem 0;
    color: ${({ theme }) => theme.colors.text};
  }

  p {
    font-size: 0.9rem;
    line-height: 1.55;
    color: ${({ theme }) => theme.colors.muted};
    margin: 0;
  }
`

/* ---------- CTA ---------- */

const CTA = styled.section`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 2rem 6rem;
`

const CTACard = styled.div`
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
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
      circle at top right,
      ${({ theme }) => theme.colors.primary}33,
      transparent 60%
    );
    pointer-events: none;
  }

  h2 {
    position: relative;
    font-size: clamp(1.75rem, 3.5vw, 2.25rem);
    font-weight: 700;
    margin: 0 0 0.85rem 0;
    letter-spacing: -0.025em;
  }

  p {
    position: relative;
    font-size: 1rem;
    line-height: 1.6;
    opacity: 0.75;
    margin: 0 auto 2rem;
    max-width: 480px;
  }
`

const CTAButton = styled(Link)`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.9rem 1.6rem;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  font-size: 0.95rem;
  transition: transform 0.15s ease;

  &:hover {
    transform: translateY(-2px);
  }
`

/* ---------- Component ---------- */

const services = [
  {
    icon: Code2,
    color: '#6366f1',
    tint: 'rgba(99,102,241,0.12)',
    title: 'Web applications',
    desc: 'Custom dashboards, internal tools, SaaS products. Built with React or Next.js on the front, Laravel, Node, or Java on the back. Fast, accessible, and built to last.',
    stack: ['React', 'Next.js', 'Laravel', 'Node.js'],
  },
  {
    icon: Smartphone,
    color: '#10b981',
    tint: 'rgba(16,185,129,0.12)',
    title: 'Mobile apps',
    desc: 'Native and cross-platform apps that feel right on every device. From MVPs to production releases on the App Store and Google Play.',
    stack: ['React Native', 'Flutter', 'Kotlin', 'Swift'],
  },
  {
    icon: Globe,
    color: '#f59e0b',
    tint: 'rgba(245,158,11,0.12)',
    title: 'Websites',
    desc: 'Marketing sites, landing pages, and content platforms that load fast and look sharp. SEO-ready, CMS-backed, and easy for your team to update.',
    stack: ['Next.js', 'Astro', 'Sanity', 'WordPress'],
  },
  {
    icon: Server,
    color: '#ef4444',
    tint: 'rgba(239,68,68,0.12)',
    title: 'Backend & APIs',
    desc: 'REST and GraphQL APIs, integrations, payment systems, auth, and data pipelines. Scalable architecture that handles real traffic without breaking.',
    stack: ['Node.js', 'Java', 'Python', 'PostgreSQL'],
  },
]

const processSteps = [
  {
    num: '01',
    title: 'Discovery',
    desc: 'We listen before we propose. Goals, users, constraints, timeline — laid out clearly.',
  },
  {
    num: '02',
    title: 'Design',
    desc: 'Wireframes, prototypes, and a tight scope. Surprises are minimized before code starts.',
  },
  {
    num: '03',
    title: 'Build',
    desc: 'Weekly demos, fast iteration, real code in your hands early. No big-bang reveals.',
  },
  {
    num: '04',
    title: 'Ship & support',
    desc: 'Deploy, monitor, iterate. Ongoing support so the thing keeps running after launch.',
  },
]

const Services_Page = () => {
  return (
    <Page>
      <Hero>
        <Eyebrow>// What we do</Eyebrow>
        <Headline>
          Software that <span className="accent">actually ships.</span>
        </Headline>
        <Lead>
          We build web apps, mobile apps, websites, and backends for businesses
          across Kenya and beyond. Tight scope, fast iteration, real ownership —
          no fluff.
        </Lead>
      </Hero>

      <Services>
        <SectionHead>
          <span className="mono">// Services</span>
          <h2>What we build</h2>
        </SectionHead>

        <ServiceGrid>
          {services.map((s) => {
            const Icon = s.icon
            return (
              <ServiceCard key={s.title} $tint={s.tint} $color={s.color}>
                <span className="icon-wrap">
                  <Icon size={24} />
                </span>
                <h3>{s.title}</h3>
                <p className="desc">{s.desc}</p>
                <div className="stack">
                  {s.stack.map((tech) => (
                    <Pill key={tech}>{tech}</Pill>
                  ))}
                </div>
              </ServiceCard>
            )
          })}
        </ServiceGrid>
      </Services>

      <Process>
        <ProcessInner>
          <SectionHead>
            <span className="mono">// Process</span>
            <h2>How we work</h2>
          </SectionHead>

          <ProcessSteps>
            {processSteps.map((step) => (
              <Step key={step.num}>
                <div className="num">{step.num}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </Step>
            ))}
          </ProcessSteps>
        </ProcessInner>
      </Process>

      <Why>
        <SectionHead>
          <span className="mono">// Why us</span>
          <h2>What you can expect</h2>
        </SectionHead>

        <WhyGrid>
          <Why_Item>
            <Layers className="icon" size={22} />
            <h4>Real ownership</h4>
            <p>
              You own your code, your data, your infrastructure. We hand it all
              over, fully documented.
            </p>
          </Why_Item>
          <Why_Item>
            <Zap className="icon" size={22} />
            <h4>Fast turnarounds</h4>
            <p>
              Weekly demos, working code early. We don't disappear for months
              and reappear with surprises.
            </p>
          </Why_Item>
          <Why_Item>
            <Shield className="icon" size={22} />
            <h4>Built to last</h4>
            <p>
              Tested, documented, scalable code that won't fall apart when you
              grow or change direction.
            </p>
          </Why_Item>
          <Why_Item>
            <GitBranch className="icon" size={22} />
            <h4>Modern stack</h4>
            <p>
              React, Laravel, Node, Java, Python — the tools your future hires
              will already know.
            </p>
          </Why_Item>
          <Why_Item>
            <Code2 className="icon" size={22} />
            <h4>Clean code</h4>
            <p>
              Reviewed, typed, and readable. Anyone can pick it up later —
              including teams that aren't us.
            </p>
          </Why_Item>
          <Why_Item>
            <Server className="icon" size={22} />
            <h4>Ongoing support</h4>
            <p>
              We don't ghost you after launch. Maintenance, hosting, and feature
              work on flexible terms.
            </p>
          </Why_Item>
        </WhyGrid>
      </Why>

      <CTA>
        <CTACard>
          <h2>Got a project in mind?</h2>
          <p>
            Tell us what you're building. We'll come back within 24 hours with
            thoughts, questions, and a rough plan.
          </p>
          <CTAButton to={ROUTES.CONTACT}>
            Start a conversation <ArrowUpRight size={16} />
          </CTAButton>
        </CTACard>
      </CTA>
    </Page>
  )
}

export default Services_Page
