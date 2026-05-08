import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Mail, Phone, MapPin } from 'lucide-react'
import { ROUTES } from '../constants/routes'

const Wrap = styled.footer`
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`

const Main = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem 2.5rem;
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 3rem;

  @media (max-width: 880px) {
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
  }

  @media (max-width: 540px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 3rem 1.25rem 2rem;
  }
`

const Brand = styled.div`
  .logo-row {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    margin-bottom: 1rem;
  }

  .logo-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 10px;
    overflow: hidden;
    background: ${({ theme }) => theme.colors.background};
    border: 1px solid ${({ theme }) => theme.colors.border};

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  .name {
    font-weight: 700;
    font-size: 1.05rem;
    color: ${({ theme }) => theme.colors.text};
    letter-spacing: -0.015em;
  }

  .tagline {
    font-size: 0.92rem;
    line-height: 1.55;
    color: ${({ theme }) => theme.colors.muted};
    margin: 0 0 1.25rem 0;
    max-width: 320px;
  }

  .socials {
    display: flex;
    gap: 0.5rem;

    a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: ${({ theme }) => theme.colors.background};
      border: 1px solid ${({ theme }) => theme.colors.border};
      border-radius: 8px;
      color: ${({ theme }) => theme.colors.muted};
      transition:
        color 0.18s ease,
        border-color 0.18s ease;

      &:hover {
        color: ${({ theme }) => theme.colors.primary};
        border-color: ${({ theme }) => theme.colors.primary};
      }
    }
  }
`

const Col = styled.div`
  h4 {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${({ theme }) => theme.colors.muted};
    margin: 0 0 1.25rem 0;
    font-weight: 500;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }

  a,
  span.contact {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    color: ${({ theme }) => theme.colors.text};
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.18s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }

    svg {
      color: ${({ theme }) => theme.colors.muted};
    }
  }

  span.contact {
    color: ${({ theme }) => theme.colors.muted};
    cursor: default;

    &:hover {
      color: ${({ theme }) => theme.colors.muted};
    }
  }
`

const Bottom = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1.5rem 2rem;

  .inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    font-size: 0.82rem;
    color: ${({ theme }) => theme.colors.muted};
  }

  .legal {
    display: flex;
    gap: 1.25rem;

    a {
      color: ${({ theme }) => theme.colors.muted};
      text-decoration: none;

      &:hover {
        color: ${({ theme }) => theme.colors.primary};
      }
    }
  }

  .mono {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 0.78rem;
  }
`

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
)

const InstagramIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const Footer = () => {
  return (
    <Wrap>
      <Main>
        <Brand>
          <div className="logo-row">
            <span className="logo-mark">
              <img src="aos.png" alt="AOS" />
            </span>
            <span className="name">Ashmif Office Solutions</span>
          </div>
          <p className="tagline">
            We build software that ships. Web apps, mobile apps, and websites
            for businesses across Africa and beyond.
          </p>
          <div className="socials">
            <a href="https://twitter.com/aos_hq" aria-label="Twitter">
              <TwitterIcon />
            </a>
            <a
              href="https://github.com/ashmifofficesolutions"
              aria-label="GitHub"
            >
              <GithubIcon />
            </a>

            <a
              href="https://instagram.com/ashmifofficesolutions"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
          </div>
        </Brand>

        <Col>
          <h4>Company</h4>
          <ul>
            <li>
              <Link to={ROUTES.SERVICES}>Services</Link>
            </li>
            <li>
              <Link to={ROUTES.PRODUCTS}>Products</Link>
            </li>
            <li>
              <Link to={ROUTES.CAREERS}>Careers</Link>
            </li>
            <li>
              <Link to={ROUTES.CONTACT}>Contact</Link>
            </li>
          </ul>
        </Col>

        <Col>
          <h4>Services</h4>
          <ul>
            <li>
              <Link to={ROUTES.SERVICES}>Web applications</Link>
            </li>
            <li>
              <Link to={ROUTES.SERVICES}>Mobile apps</Link>
            </li>
            <li>
              <Link to={ROUTES.SERVICES}>Websites</Link>
            </li>
            <li>
              <Link to={ROUTES.SERVICES}>Backends & APIs</Link>
            </li>
          </ul>
        </Col>

        <Col>
          <h4>Get in touch</h4>
          <ul>
            <li>
              <a href="mailto:hello@ashmif.com">
                <Mail size={14} />
                hello@ashmif.com
              </a>
            </li>
            <li>
              <a href="tel:+254758839829">
                <Phone size={14} />
                +254 758 839 829
              </a>
            </li>
            <li>
              <span className="contact">
                <MapPin size={14} />
                Mombasa, Kenya
              </span>
            </li>
          </ul>
        </Col>
      </Main>

      <Bottom>
        <div className="inner">
          <span className="mono">
            © {new Date().getFullYear()} Ashmif Office Solutions
          </span>
          <div className="legal">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#cookies">Cookies</a>
          </div>
        </div>
      </Bottom>
    </Wrap>
  )
}

export default Footer
