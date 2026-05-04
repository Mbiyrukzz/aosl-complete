import { NavLink, Link } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { Sun, Moon, MessageCircle, Globe } from 'lucide-react'
import { ROUTES } from '../constants/routes'
import { useUser } from '../hooks/useUser'
import { useTheme } from '../hooks/useTheme'

const NavWrapper = styled.div`
  position: fixed;
  top: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  width: min(960px, calc(100% - 2rem));
`

const Pill = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 0.5rem 0.5rem 0.75rem;
  background: ${({ theme }) =>
    theme.mode === 'light' ? '#0a0a0a' : '#1a1f2e'};
  border: 1px solid
    ${({ theme }) => (theme.mode === 'light' ? '#0a0a0a' : '#2a3142')};
  border-radius: 999px;
  box-shadow:
    0 10px 40px -10px rgba(0, 0, 0, 0.35),
    0 0 0 1px rgba(255, 255, 255, 0.04) inset;
  backdrop-filter: blur(12px);
`

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #ffffff;
  color: #0a0a0a;
  text-decoration: none;
  flex-shrink: 0;
  transition: transform 0.25s ease;

  &:hover {
    transform: rotate(-15deg) scale(1.05);
  }
`

const Links = styled.ul`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  list-style: none;
  margin: 0;
  padding: 0;

  @media (max-width: 720px) {
    display: none;
  }
`

const linkStyles = css`
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 0.55rem 1rem;
  font-size: 0.92rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: rgba(255, 255, 255, 0.72);
  text-decoration: none;
  border-radius: 999px;
  transition:
    color 0.2s ease,
    background 0.2s ease;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.06);
  }

  &.active {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.1);
  }
`

const StyledNavLink = styled(NavLink)`
  ${linkStyles}
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: rgba(255, 255, 255, 0.72);
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
    transform: translateY(-1px);
  }
`

const CTA = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.1rem;
  background: #ffffff;
  color: #0a0a0a;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: 999px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px -6px rgba(255, 255, 255, 0.4);
  }
`

const Navbar = () => {
  const { user } = useUser()
  const { mode, toggleTheme } = useTheme()

  return (
    <NavWrapper>
      <Pill>
        <Logo to={ROUTES.HOME} aria-label="Home">
          <Globe size={20} strokeWidth={2.2} />
        </Logo>

        <Links>
          <li>
            <StyledNavLink to={ROUTES.HOME} end>
              Home
            </StyledNavLink>
          </li>
          <li>
            <StyledNavLink to={ROUTES.PRODUCTS}>Products</StyledNavLink>
          </li>
          <li>
            <StyledNavLink to={ROUTES.SERVICES}>Services</StyledNavLink>
          </li>
          <li>
            <StyledNavLink to={ROUTES.CAREERS}>Careers</StyledNavLink>
          </li>
          <li>
            <StyledNavLink to={ROUTES.CONTACT}>Contact</StyledNavLink>
          </li>
        </Links>

        <Actions>
          <IconButton as={NavLink} to={ROUTES.CHATBOT} aria-label="Chatbot">
            <MessageCircle size={18} />
          </IconButton>

          <IconButton onClick={toggleTheme} aria-label="Toggle theme">
            {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </IconButton>

          <CTA to={user ? ROUTES.DASHBOARD : ROUTES.LOGIN}>
            {user ? 'Dashboard' : 'Login'}
          </CTA>
        </Actions>
      </Pill>
    </NavWrapper>
  )
}

export default Navbar
