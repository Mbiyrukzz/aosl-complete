import { Link } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import {
  ArrowUpRight,
  ArrowRight,
  Home,
  Truck,
  Stethoscope,
  Wallet,
  GraduationCap,
  CheckCircle2,
} from 'lucide-react'
import { ROUTES } from '../constants/routes'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`

const Page = styled.div`
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-family: 'Inter', system-ui, sans-serif;
`

/* ---------- Hero ---------- */

const Hero = styled.section`
  padding: 8rem 2rem 5rem;
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
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

/* ---------- Product section ---------- */

const ProductsList = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 2rem 4rem;
`

const ProductSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  padding: 4rem 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  &:first-child {
    border-top: none;
  }

  /* Alternate layout — even-indexed get reversed */
  &.reversed .info-col {
    order: 2;
  }
  &.reversed .preview-col {
    order: 1;
  }

  @media (max-width: 880px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;

    &.reversed .info-col,
    &.reversed .preview-col {
      order: 0;
    }
  }
`

const ProductInfo = styled.div`
  .index {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.78rem;
    color: ${({ theme }) => theme.colors.muted};
    margin-bottom: 0.85rem;
    letter-spacing: 0.06em;
  }

  .title-row {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    margin-bottom: 1rem;
  }

  .icon-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: ${({ theme }) => theme.radii.lg};
    background: ${({ $tint }) => $tint};
    color: ${({ $color }) => $color};
    flex-shrink: 0;
  }

  h2 {
    font-size: clamp(1.75rem, 3.2vw, 2.4rem);
    font-weight: 800;
    letter-spacing: -0.025em;
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.1;
  }

  .tagline {
    font-size: 1.1rem;
    line-height: 1.45;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
    margin: 0 0 1rem 0;
  }

  .description {
    color: ${({ theme }) => theme.colors.muted};
    line-height: 1.7;
    font-size: 0.98rem;
    margin: 0 0 1.5rem 0;
  }
`

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.6rem 1rem;

  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }

  li {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.4;
  }

  svg {
    color: ${({ $color }) => $color};
    flex-shrink: 0;
    margin-top: 2px;
  }
`

const VisitButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.4rem;
  background: ${({ $color }) => $color};
  color: white;
  text-decoration: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  font-size: 0.95rem;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px ${({ $color }) => `${$color}40`};
  }
`

/* ---------- Browser frame for screenshots ---------- */

const BrowserFrame = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04);
  transform: rotate(0deg);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.12),
      0 4px 12px rgba(0, 0, 0, 0.06);
  }
`

const BrowserBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.9rem;
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const Dots = styled.div`
  display: flex;
  gap: 0.35rem;

  span {
    width: 11px;
    height: 11px;
    border-radius: 50%;
  }

  span:nth-child(1) {
    background: #ff5f57;
  }
  span:nth-child(2) {
    background: #ffbd2e;
  }
  span:nth-child(3) {
    background: #28ca42;
  }
`

const UrlBar = styled.div`
  flex: 1;
  padding: 0.35rem 0.85rem;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.muted};
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const PreviewArea = styled.div`
  position: relative;
  aspect-ratio: 16 / 10;
  background: ${({ $tint }) => $tint};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
    display: block;
  }
`

const PreviewFallback = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: ${({ $color }) => $color};
  z-index: 0;

  svg {
    opacity: 0.4;
  }

  .label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.78rem;
    opacity: 0.7;
    letter-spacing: 0.06em;
    text-transform: uppercase;
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
    max-width: 520px;
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

/* ---------- Product data ---------- */

const products = [
  {
    slug: 'smartrealtors',
    name: 'SmartRealtors',
    icon: Home,
    color: '#3b82f6',
    tint: 'rgba(59,130,246,0.1)',
    tagline: 'Property management, fully automated.',
    description:
      'A complete property management system that runs the boring, repetitive parts for you — automated rent collection, instant reminders, professional invoices, vacancy tracking, and disbursement reports. Built for landlords, agencies, and property managers who want their evenings back.',
    features: [
      'Automated rent collection',
      'Smart rent reminders',
      'Invoice generation',
      'Vacant unit tracker',
      'Rent balance reports',
      'Disbursement summaries',
    ],
    url: 'https://properties.ashmif.com',
    domain: 'properties.ashmif.com',
  },
  {
    slug: 'smartfreight',
    name: 'SmartFreight',
    icon: Truck,
    color: '#f59e0b',
    tint: 'rgba(245,158,11,0.1)',
    tagline: 'Modern freight ops, simplified.',
    description:
      'A complete logistics management system built for consolidators. Track shipments, generate manifests, issue bills of lading, and streamline every workflow — all in one place. Purpose-built tools for freight consolidators, from intake to delivery.',
    features: [
      'Manifest management',
      'Real-time shipment tracking',
      'Digital bill of lading',
      'Delivery orders',
      'Smart invoicing',
      'Reports & analytics',
    ],
    url: 'https://consolidation.ashmif.com',
    domain: 'consolidation.ashmif.com',
  },
  {
    slug: 'medisynq',
    name: 'Medisynq',
    icon: Stethoscope,
    color: '#10b981',
    tint: 'rgba(16,185,129,0.1)',
    tagline: 'Hospital management, end to end.',
    description:
      'A hospital management platform that connects patient records, appointments, billing, pharmacy, and clinical workflows in one system. Designed for clinics and hospitals that want clean operations without the legacy software pain.',
    features: [
      'Patient records (EMR)',
      'Appointments & scheduling',
      'Billing & insurance',
      'Pharmacy & inventory',
      'Lab & diagnostics',
      'Staff management',
    ],
    url: 'https://medisynq.app',
    domain: 'medisynq.app',
  },
  {
    slug: 'finsynq',
    name: 'FinSynq',
    icon: Wallet,
    color: '#8b5cf6',
    tint: 'rgba(139,92,246,0.1)',
    tagline: 'Built for microfinances, savings groups, and SACCOs.',
    description:
      'A financial management platform tailored for microfinance institutions. Member onboarding, loan management, savings tracking, repayments, and compliance reporting — designed to scale from a single chama to a multi-branch SACCO.',
    features: [
      'Member onboarding',
      'Loan origination & tracking',
      'Savings & deposits',
      'Repayment schedules',
      'Compliance reports',
      'Multi-branch support',
    ],
    url: 'https://finsynq.ashmif.com',
    domain: 'finsynq.ashmif.com',
  },
  {
    slug: 'clasynx',
    name: 'Clasynx',
    icon: GraduationCap,
    color: '#ef4444',
    tint: 'rgba(239,68,68,0.1)',
    tagline: 'School management without the mess.',
    description:
      'A school management system that handles students, staff, classes, fees, and academics in one clean dashboard. Built for primary, secondary, and tertiary institutions ready to retire spreadsheets and disconnected tools.',
    features: [
      'Student records',
      'Fee management',
      'Timetables & classes',
      'Exams & grading',
      'Parent portal',
      'Staff payroll',
    ],
    url: 'https://clasynx.ashmif.com',
    domain: 'clasynx.ashmif.com',
  },
]

/* ---------- Component ---------- */

const Products = () => {
  return (
    <Page>
      <Hero>
        <Eyebrow>// Our products</Eyebrow>
        <Headline>
          Software we built,{' '}
          <span className="accent">running in the wild.</span>
        </Headline>
        <Lead>
          These aren't pitches — they're production systems serving real
          businesses across Kenya. Each one started as a custom build and grew
          into a product. Try them, or ask us to tailor one for you.
        </Lead>
      </Hero>

      <ProductsList>
        {products.map((product, idx) => {
          const Icon = product.icon
          const reversed = idx % 2 === 1

          return (
            <ProductSection
              key={product.slug}
              className={reversed ? 'reversed' : ''}
            >
              <ProductInfo
                className="info-col"
                $color={product.color}
                $tint={product.tint}
              >
                <div className="index">// 0{idx + 1} — Live product</div>

                <div className="title-row">
                  <span className="icon-wrap">
                    <Icon size={26} />
                  </span>
                  <h2>{product.name}</h2>
                </div>

                <p className="tagline">{product.tagline}</p>
                <p className="description">{product.description}</p>

                <FeatureList $color={product.color}>
                  {product.features.map((f) => (
                    <li key={f}>
                      <CheckCircle2 size={16} />
                      <span>{f}</span>
                    </li>
                  ))}
                </FeatureList>

                <VisitButton
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  $color={product.color}
                >
                  Visit {product.name}
                  <ArrowUpRight size={16} />
                </VisitButton>
              </ProductInfo>

              <div className="preview-col">
                <BrowserFrame>
                  <BrowserBar>
                    <Dots>
                      <span />
                      <span />
                      <span />
                    </Dots>
                    <UrlBar>{product.domain}</UrlBar>
                  </BrowserBar>
                  <PreviewArea $tint={product.tint}>
                    <PreviewFallback $color={product.color}>
                      <Icon size={56} />
                      <span className="label">Preview coming soon</span>
                    </PreviewFallback>
                    <img
                      src={`/products/${product.slug}.png`}
                      alt={`${product.name} screenshot`}
                      onError={(e) => {
                        // Hide broken image — fallback shows underneath
                        e.target.style.display = 'none'
                      }}
                      style={{ position: 'relative', zIndex: 1 }}
                    />
                  </PreviewArea>
                </BrowserFrame>
              </div>
            </ProductSection>
          )
        })}
      </ProductsList>

      <CTA>
        <CTACard>
          <h2>Need something custom?</h2>
          <p>
            Every product on this page started as a problem someone brought to
            us. If yours doesn't fit any of these — or you want one of these
            tailored to your operation — we'd love to talk.
          </p>
          <CTAButton to={ROUTES.CONTACT}>
            Tell us about it <ArrowRight size={16} />
          </CTAButton>
        </CTACard>
      </CTA>
    </Page>
  )
}

export default Products
