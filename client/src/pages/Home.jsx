import { Link } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  Smartphone,
  Globe,
  Server,
  Check,
  Zap,
  Coffee,
} from 'lucide-react'
import { ROUTES } from '../constants/routes'

/* ---------- Animations ---------- */

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`

const pulseDot = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  50% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
`

/* ---------- Layout primitives ---------- */

const Page = styled.div`
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-family: 'Inter', system-ui, sans-serif;
  overflow-x: hidden;
`

const Section = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ $tight }) => ($tight ? '4rem 2rem' : '7rem 2rem')};

  @media (max-width: 720px) {
    padding: ${({ $tight }) => ($tight ? '3rem 1.25rem' : '5rem 1.25rem')};
  }
`

const Mono = styled.span`
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.muted};
  text-transform: uppercase;
`

/* ---------- Hero ---------- */

const HeroBg = styled.div`
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
      ${({ theme }) => theme.colors.border} 1px,
      transparent 1px
    );
    background-size: 28px 28px;
    mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
    -webkit-mask-image: radial-gradient(
      ellipse at center,
      black 30%,
      transparent 70%
    );
    opacity: 0.5;
    pointer-events: none;
  }
`

const Hero = styled(Section)`
  padding-top: 9rem;
  padding-bottom: 5rem;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 4rem;
  align-items: center;
  position: relative;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    padding-top: 7rem;
  }
`

const HeroLeft = styled.div`
  animation: ${fadeUp} 0.6s ease-out;

  > * + * {
    margin-top: 1.5rem;
  }
`

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.85rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.muted};

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #10b981;
    animation: ${pulseDot} 2.5s ease-out infinite;
  }
`

const Headline = styled.h1`
  font-size: clamp(2.5rem, 5.8vw, 4.75rem);
  font-weight: 800;
  line-height: 1.04;
  letter-spacing: -0.035em;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};

  span.accent {
    color: ${({ theme }) => theme.colors.primary};
    font-style: italic;
    font-weight: 700;
    position: relative;
    white-space: nowrap;
  }
`

const Lead = styled.p`
  font-size: 1.15rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0;
  max-width: 560px;
`

const HeroActions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`

const PrimaryCTA = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.9rem 1.5rem;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition:
    transform 0.18s ease,
    opacity 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    opacity: 0.92;
  }
`

const SecondaryCTA = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.9rem 1.5rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 500;
  font-size: 0.95rem;
  text-decoration: none;
  transition: border-color 0.18s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

/* ---------- Code mockup ---------- */

const CodeFrame = styled.div`
  background: #0a0a0a;
  border: 1px solid #1f2937;
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.4);
  animation: ${fadeUp} 0.8s ease-out 0.15s backwards;
`

const CodeChrome = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.7rem 0.9rem;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  .dot {
    width: 11px;
    height: 11px;
    border-radius: 50%;
  }
  .red {
    background: #ef4444;
  }
  .yellow {
    background: #f59e0b;
  }
  .green {
    background: #10b981;
  }

  .filename {
    margin-left: 0.7rem;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
  }
`

const CodeBody = styled.pre`
  margin: 0;
  padding: 1.5rem 1.6rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.82rem;
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.85);
  overflow-x: auto;

  .keyword {
    color: #c084fc;
  }
  .string {
    color: #6ee7b7;
  }
  .fn {
    color: #93c5fd;
  }
  .comment {
    color: rgba(255, 255, 255, 0.35);
    font-style: italic;
  }
  .punct {
    color: rgba(255, 255, 255, 0.5);
  }
  .key {
    color: #fcd34d;
  }
`

/* ---------- Stats strip ---------- */

const Strip = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  padding: 2.5rem 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: 4rem;

  @media (max-width: 720px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
`

const StripStat = styled.div`
  .num {
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1;
  }
  .lbl {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: ${({ theme }) => theme.colors.muted};
    margin-top: 0.5rem;
  }
`

/* ---------- Section header ---------- */

const SectionHeader = styled.div`
  margin-bottom: 3rem;
  max-width: 720px;

  h2 {
    font-size: clamp(1.85rem, 3.5vw, 2.85rem);
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -0.025em;
    margin: 0.5rem 0 1rem 0;
    color: ${({ theme }) => theme.colors.text};
  }

  p {
    font-size: 1.05rem;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.muted};
    margin: 0;
  }
`

/* ---------- Services ---------- */

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

const ServiceCard = styled.div`
  position: relative;
  padding: 1.85rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  transition:
    border-color 0.2s ease,
    transform 0.2s ease;
  overflow: hidden;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }

  &::after {
    content: '';
    position: absolute;
    top: -40px;
    right: -40px;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: ${({ $tint }) => $tint};
    opacity: 0.3;
    pointer-events: none;
  }

  .icon {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ $tint }) => $tint};
    color: ${({ $color }) => $color};
    margin-bottom: 1.25rem;
    z-index: 1;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 0.6rem 0;
    color: ${({ theme }) => theme.colors.text};
    letter-spacing: -0.015em;
    position: relative;
  }

  p {
    font-size: 0.94rem;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.muted};
    margin: 0 0 1.4rem 0;
    position: relative;
  }

  .stack {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
    position: relative;
  }

  .tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    padding: 0.25rem 0.6rem;
    background: ${({ theme }) => theme.colors.background};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 6px;
    color: ${({ theme }) => theme.colors.muted};
  }
`

/* ---------- Featured Stack Showcase (Laravel + Java spotlight) ---------- */

const ShowcaseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

const TechCard = styled.div`
  position: relative;
  padding: 2rem;
  background: ${({ $bg }) => $bg};
  color: white;
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  transition: transform 0.25s ease;

  &:hover {
    transform: translateY(-3px);
  }

  &::before {
    content: '';
    position: absolute;
    top: -60px;
    right: -60px;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -80px;
    left: -40px;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    pointer-events: none;
  }

  .top-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.4rem;
    position: relative;
  }

  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    background: rgba(255, 255, 255, 0.18);
    backdrop-filter: blur(10px);
    border-radius: ${({ theme }) => theme.radii.md};
    color: white;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.3rem 0.7rem;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 999px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    color: white;
  }

  h3 {
    position: relative;
    font-size: 2.25rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    margin: 0 0 0.5rem 0;
    line-height: 1;
  }

  .subtitle {
    position: relative;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.75;
    margin: 0 0 1.4rem 0;
  }

  p {
    position: relative;
    font-size: 0.94rem;
    line-height: 1.6;
    opacity: 0.92;
    margin: 0 0 1.5rem 0;
  }

  .features {
    position: relative;
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }

  .features li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.88rem;
    opacity: 0.95;
  }

  .features svg {
    flex-shrink: 0;
    opacity: 0.85;
  }
`

/* ---------- Process ---------- */

const ProcessGrid = styled.div`
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

const ProcessStep = styled.div`
  position: relative;
  padding: 1.6rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};

  .num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.78rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 0.85rem;
  }

  h4 {
    font-size: 1.08rem;
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

const WhyGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;

  @media (max-width: 880px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
`

const WhyHeading = styled.h2`
  font-size: clamp(1.85rem, 3.5vw, 2.85rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.025em;
  margin: 0.5rem 0 1.25rem 0;
  color: ${({ theme }) => theme.colors.text};
`

const WhyList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;

  li {
    display: flex;
    gap: 0.85rem;

    .check {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
      border-radius: 50%;
      margin-top: 2px;
    }

    h5 {
      font-size: 1rem;
      font-weight: 600;
      margin: 0 0 0.3rem 0;
      color: ${({ theme }) => theme.colors.text};
    }

    p {
      font-size: 0.92rem;
      line-height: 1.55;
      color: ${({ theme }) => theme.colors.muted};
      margin: 0;
    }
  }
`

/* ---------- Stack pills (rest of toolbox) ---------- */

const StackSection = styled(Section)`
  text-align: center;

  h3 {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: ${({ theme }) => theme.colors.muted};
    margin: 0 0 2rem 0;
    font-weight: 500;
  }
`

const StackRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.6rem;
`

const StackPill = styled.span`
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.18s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

/* ---------- CTA Banner ---------- */

const Banner = styled.div`
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 3.5rem 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: -100%;
    right: -10%;
    width: 60%;
    height: 300%;
    background: linear-gradient(
      45deg,
      transparent 49%,
      rgba(255, 255, 255, 0.05) 49.5%,
      rgba(255, 255, 255, 0.05) 50.5%,
      transparent 51%
    );
    pointer-events: none;
  }

  h3 {
    font-size: clamp(1.5rem, 3vw, 2.25rem);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
    margin: 0;
    max-width: 540px;
    position: relative;
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.9rem 1.6rem;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    border-radius: ${({ theme }) => theme.radii.md};
    font-weight: 600;
    text-decoration: none;
    transition: transform 0.18s ease;
    position: relative;

    &:hover {
      transform: translateY(-1px);
    }
  }
`

/* ---------- Component ---------- */

const Home = () => {
  return (
    <Page>
      <HeroBg>
        <Hero>
          <HeroLeft>
            <Eyebrow>
              <span className="dot" />
              Available for new projects
            </Eyebrow>

            <Headline>
              We build software{' '}
              <span className="accent">that actually ships.</span>
            </Headline>

            <Lead>
              Ashmif Office Solutions is a Mombasa-based studio building web
              apps, mobile apps, and websites for businesses that need things
              done right — and done fast.
            </Lead>

            <HeroActions>
              <PrimaryCTA to={ROUTES.CONTACT}>
                Start a project <ArrowRight size={16} />
              </PrimaryCTA>
              <SecondaryCTA to={ROUTES.SERVICES}>See our services</SecondaryCTA>
            </HeroActions>
          </HeroLeft>

          <CodeFrame>
            <CodeChrome>
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
              <span className="filename">ashmif.com</span>
            </CodeChrome>
            <CodeBody>
              <span className="comment">{'// What we build'}</span>
              {'\n'}
              <span className="keyword">const</span>{' '}
              <span className="fn">ashmif</span>{' '}
              <span className="punct">{'= {'}</span>
              {'\n  '}
              <span className="key">webApps</span>
              <span className="punct">:</span>{' '}
              <span className="string">{`'React, Next.js, Laravel'`}</span>
              <span className="punct">,</span>
              {'\n  '}
              <span className="key">mobile</span>
              <span className="punct">:</span>{' '}
              <span className="string">{`'React Native, Flutter, Java'`}</span>
              <span className="punct">,</span>
              {'\n  '}
              <span className="key">websites</span>
              <span className="punct">:</span>{' '}
              <span className="string">{`'fast, accessible, beautiful'`}</span>
              <span className="punct">,</span>
              {'\n  '}
              <span className="key">backends</span>
              <span className="punct">:</span>{' '}
              <span className="string">{`'Node, Java, Laravel, Python'`}</span>
              <span className="punct">,</span>
              {'\n  '}
              <span className="key">approach</span>
              <span className="punct">:</span> <span className="fn">ship</span>
              <span className="punct">(</span>
              <span className="string">{`'small, fast, often'`}</span>
              <span className="punct">),</span>
              {'\n'}
              <span className="punct">{'}'}</span>
            </CodeBody>
          </CodeFrame>
        </Hero>
      </HeroBg>

      <Section $tight style={{ paddingTop: 0, paddingBottom: 0 }}>
        <Strip>
          <StripStat>
            <div className="num">25+</div>
            <div className="lbl">Projects shipped</div>
          </StripStat>
          <StripStat>
            <div className="num">12</div>
            <div className="lbl">Active clients</div>
          </StripStat>
          <StripStat>
            <div className="num">4yrs</div>
            <div className="lbl">Building software</div>
          </StripStat>
          <StripStat>
            <div className="num">100%</div>
            <div className="lbl">On-time delivery</div>
          </StripStat>
        </Strip>
      </Section>

      <Section>
        <SectionHeader>
          <Mono>// What we do</Mono>
          <h2>Four things, done well.</h2>
          <p>
            We don't pretend to do everything. We focus on what we're great at,
            and partner up for the rest.
          </p>
        </SectionHeader>

        <ServiceGrid>
          <ServiceCard $tint="rgba(59,130,246,0.15)" $color="#3b82f6">
            <span className="icon">
              <Globe size={22} />
            </span>
            <h3>Web applications</h3>
            <p>
              Real-time dashboards, internal tools, SaaS products — software
              that runs your business and won't fall over at 3am.
            </p>
            <div className="stack">
              <span className="tag">React</span>
              <span className="tag">Next.js</span>
              <span className="tag">Laravel</span>
              <span className="tag">Node.js</span>
            </div>
          </ServiceCard>

          <ServiceCard $tint="rgba(16,185,129,0.15)" $color="#10b981">
            <span className="icon">
              <Smartphone size={22} />
            </span>
            <h3>Mobile apps</h3>
            <p>
              iOS and Android apps that feel native, ship to both stores, and
              don't make your users want to scream.
            </p>
            <div className="stack">
              <span className="tag">React Native</span>
              <span className="tag">Flutter</span>
              <span className="tag">Java (Android)</span>
              <span className="tag">Firebase</span>
            </div>
          </ServiceCard>

          <ServiceCard $tint="rgba(245,158,11,0.15)" $color="#d97706">
            <span className="icon">
              <Code2 size={22} />
            </span>
            <h3>Websites</h3>
            <p>
              Marketing sites, portfolios, e-commerce. Fast, beautiful, and
              built so non-developers can update them without fear.
            </p>
            <div className="stack">
              <span className="tag">Next.js</span>
              <span className="tag">Astro</span>
              <span className="tag">Laravel</span>
              <span className="tag">Tailwind</span>
            </div>
          </ServiceCard>

          <ServiceCard $tint="rgba(168,85,247,0.15)" $color="#a855f7">
            <span className="icon">
              <Server size={22} />
            </span>
            <h3>Backends & APIs</h3>
            <p>
              Robust APIs, data pipelines, and infrastructure built to scale
              with your business — across multiple languages and stacks.
            </p>
            <div className="stack">
              <span className="tag">Node.js</span>
              <span className="tag">Java</span>
              <span className="tag">Laravel</span>
              <span className="tag">Python</span>
            </div>
          </ServiceCard>
        </ServiceGrid>
      </Section>

      <Section>
        <SectionHeader>
          <Mono>// Our flagship stacks</Mono>
          <h2>Battle-tested. Enterprise-grade.</h2>
          <p>
            Two stacks we know inside-out — chosen by Fortune 500s, government
            systems, and high-traffic platforms. We build with what survives
            production, not what's trending on Hacker News.
          </p>
        </SectionHeader>

        <ShowcaseGrid>
          <TechCard $bg="linear-gradient(135deg, #FF2D20 0%, #C70000 100%)">
            <div className="top-row">
              <span className="icon">
                <Zap size={26} />
              </span>
              <span className="badge">PHP framework</span>
            </div>
            <h3>Laravel</h3>
            <div className="subtitle">// elegant. expressive. ready.</div>
            <p>
              For web apps that need to ship fast, scale predictably, and
              integrate cleanly. We build admin panels, marketplaces, SaaS
              backends, and APIs that handle real load.
            </p>
            <ul className="features">
              <li>
                <Check size={15} /> Eloquent ORM + complex business logic
              </li>
              <li>
                <Check size={15} /> Multi-tenant SaaS architectures
              </li>
              <li>
                <Check size={15} /> Payment integrations (M-Pesa, Stripe)
              </li>
              <li>
                <Check size={15} /> Real-time with Laravel Echo + websockets
              </li>
            </ul>
          </TechCard>

          <TechCard $bg="linear-gradient(135deg, #007396 0%, #00405a 100%)">
            <div className="top-row">
              <span className="icon">
                <Coffee size={26} />
              </span>
              <span className="badge">Enterprise · Android</span>
            </div>
            <h3>Java</h3>
            <div className="subtitle">// stable. mature. everywhere.</div>
            <p>
              For systems that need to run for years without flinching. We build
              Spring Boot APIs, Android apps, and integration layers for
              enterprises and financial systems.
            </p>
            <ul className="features">
              <li>
                <Check size={15} /> Spring Boot REST APIs at scale
              </li>
              <li>
                <Check size={15} /> Native Android apps in Java/Kotlin
              </li>
              <li>
                <Check size={15} /> Bank-grade security & transaction systems
              </li>
              <li>
                <Check size={15} /> Legacy system integrations
              </li>
            </ul>
          </TechCard>
        </ShowcaseGrid>
      </Section>

      <StackSection>
        <h3>// And the rest of our toolbox</h3>
        <StackRow>
          {[
            'React',
            'Next.js',
            'Node.js',
            'TypeScript',
            'Python',
            'React Native',
            'Flutter',
            'PostgreSQL',
            'MongoDB',
            'MySQL',
            'Firebase',
            'AWS',
            'Docker',
          ].map((tech) => (
            <StackPill key={tech}>{tech}</StackPill>
          ))}
        </StackRow>
      </StackSection>

      <Section>
        <SectionHeader>
          <Mono>// How we work</Mono>
          <h2>A process built for shipping.</h2>
          <p>
            Great software comes from short loops, honest conversations, and
            small, frequent releases — not clever architecture or fancy tooling.
          </p>
        </SectionHeader>

        <ProcessGrid>
          <ProcessStep>
            <div className="num">01</div>
            <h4>Listen</h4>
            <p>
              We start with a conversation. What's the actual problem? Who's
              going to use this? What does success look like?
            </p>
          </ProcessStep>
          <ProcessStep>
            <div className="num">02</div>
            <h4>Plan</h4>
            <p>
              We propose the smallest thing that proves it works — not the
              biggest thing we can imagine.
            </p>
          </ProcessStep>
          <ProcessStep>
            <div className="num">03</div>
            <h4>Build</h4>
            <p>
              Weekly demos. Real-time access to progress. No black-box months
              where nothing happens.
            </p>
          </ProcessStep>
          <ProcessStep>
            <div className="num">04</div>
            <h4>Ship & support</h4>
            <p>
              Launch is the start, not the end. We stick around to fix what real
              users actually run into.
            </p>
          </ProcessStep>
        </ProcessGrid>
      </Section>

      <Section>
        <WhyGrid>
          <div>
            <Mono>// Why us</Mono>
            <WhyHeading>The work speaks. So do our clients.</WhyHeading>
            <Lead>
              We're small enough to care about every detail, and experienced
              enough to ship things that don't break.
            </Lead>
          </div>

          <WhyList>
            <li>
              <span className="check">
                <Check size={14} />
              </span>
              <div>
                <h5>You talk to the people who build it</h5>
                <p>
                  No account managers, no handoffs. The person you talk to is
                  the person writing the code.
                </p>
              </div>
            </li>
            <li>
              <span className="check">
                <Check size={14} />
              </span>
              <div>
                <h5>Fixed scope, predictable timeline</h5>
                <p>
                  We tell you what we'll build, when, and for how much. No
                  surprise invoices.
                </p>
              </div>
            </li>
            <li>
              <span className="check">
                <Check size={14} />
              </span>
              <div>
                <h5>Modern stack, no lock-in</h5>
                <p>
                  You own the code, the deployment, and the data. We build with
                  tools you can hire for anywhere.
                </p>
              </div>
            </li>
            <li>
              <span className="check">
                <Check size={14} />
              </span>
              <div>
                <h5>We answer when it matters</h5>
                <p>
                  Built-in support during launch weeks. We pick up the phone
                  when something breaks.
                </p>
              </div>
            </li>
          </WhyList>
        </WhyGrid>
      </Section>

      <Section>
        <Banner>
          <h3>
            Got something to build?
            <br />
            Let's talk about it.
          </h3>
          <Link to={ROUTES.CONTACT}>
            Start a project <ArrowUpRight size={18} />
          </Link>
        </Banner>
      </Section>
    </Page>
  )
}

export default Home
