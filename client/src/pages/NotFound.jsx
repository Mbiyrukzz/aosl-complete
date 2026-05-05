import { Link, useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { Home, ArrowLeft, Search, Mail } from 'lucide-react'
import { ROUTES } from '../constants/routes'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-family: 'Inter', system-ui, sans-serif;
  position: relative;
  overflow: hidden;

  /* Subtle dot grid background */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
      ${({ theme }) => theme.colors.border} 1px,
      transparent 1px
    );
    background-size: 32px 32px;
    opacity: 0.5;
    pointer-events: none;
  }
`

const Content = styled.div`
  position: relative;
  text-align: center;
  max-width: 560px;
  animation: ${fadeUp} 0.6s ease-out;
`

const BigCode = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(6rem, 18vw, 10rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.05em;
  margin-bottom: 1.5rem;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.text} 0%,
    ${({ theme }) => theme.colors.muted} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
  margin-bottom: 1.25rem;
`

const Headline = styled.h1`
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.15;
  margin: 0 0 1rem 0;

  span.accent {
    color: ${({ theme }) => theme.colors.primary};
    font-style: italic;
  }
`

const Lead = styled.p`
  font-size: 1.05rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0 0 2rem 0;
`

const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;
`

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.4rem;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  font-size: 0.95rem;
  transition:
    transform 0.15s ease,
    opacity 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    opacity: 0.92;
  }
`

const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.4rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  font-family: inherit;
  transition:
    border-color 0.15s ease,
    transform 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
  }
`

const Suggestions = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: 2rem;

  h3 {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: ${({ theme }) => theme.colors.muted};
    margin: 0 0 1rem 0;
  }
`

const SuggestionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;

  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }
`

const SuggestionLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  font-weight: 500;
  transition:
    border-color 0.15s ease,
    transform 0.15s ease;

  svg {
    color: ${({ theme }) => theme.colors.muted};
    flex-shrink: 0;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);

    svg {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <Page>
      <Content>
        <Eyebrow>// Lost in space</Eyebrow>
        <BigCode>404</BigCode>
        <Headline>
          We can't find <span className="accent">that page.</span>
        </Headline>
        <Lead>
          The page you were looking for might have been moved, renamed, or never
          existed. Let's get you back on track.
        </Lead>

        <Actions>
          <PrimaryButton to={ROUTES.HOME}>
            <Home size={16} /> Back to home
          </PrimaryButton>
          <SecondaryButton onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Go back
          </SecondaryButton>
        </Actions>

        <Suggestions>
          <h3>// Maybe you're looking for</h3>
          <SuggestionGrid>
            <SuggestionLink to={ROUTES.SERVICES}>
              <Search size={16} />
              Our services
            </SuggestionLink>
            <SuggestionLink to={ROUTES.CAREERS}>
              <Search size={16} />
              Open positions
            </SuggestionLink>
            <SuggestionLink to={ROUTES.CONTACT}>
              <Mail size={16} />
              Get in touch
            </SuggestionLink>
          </SuggestionGrid>
        </Suggestions>
      </Content>
    </Page>
  )
}

export default NotFound
