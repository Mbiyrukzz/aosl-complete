import { NavLink, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { signOut } from 'firebase/auth'
import {
  LayoutDashboard,
  LifeBuoy,
  Settings,
  LogOut,
  Shield,
  Sun,
  Moon,
} from 'lucide-react'
import { auth } from '../services/firebase'
import { useUser } from '../hooks/useUser'
import { useTheme } from '../hooks/useTheme'
import { ROUTES, ROLES } from '../constants/routes'
import NotificationsDropdown from './NotificationsDropdown'

// Optional: if you have a logo file, uncomment the import
// import logo from '../assets/logo.svg'

const Aside = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 240px;
  background: ${({ theme }) =>
    theme.mode === 'light' ? '#0a0a0a' : '#0f172a'};
  color: rgba(255, 255, 255, 0.85);
  display: flex;
  flex-direction: column;
  padding: 1.25rem 0.75rem;
  z-index: 50;
  border-right: 1px solid rgba(255, 255, 255, 0.06);

  @media (max-width: 768px) {
    width: 64px;
    padding: 1rem 0.5rem;
  }
`

const Brand = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  margin-bottom: 1.5rem;
  text-decoration: none;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;

  .label {
    @media (max-width: 768px) {
      display: none;
    }
  }
`

const LogoBox = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: white;
  color: #0a0a0a;
  border-radius: 10px;
  flex-shrink: 0;
  font-weight: 800;
  font-size: 1rem;
  letter-spacing: -0.02em;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: inherit;
  }
`

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
`

const Item = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.65rem 0.85rem;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.93rem;
  font-weight: 500;
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: white;
  }

  &.active {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .label {
    @media (max-width: 768px) {
      display: none;
    }
  }
`

const Section = styled.div`
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.4);
  padding: 0 0.85rem;
  margin: 1rem 0 0.4rem;

  @media (max-width: 768px) {
    display: none;
  }
`

const Footer = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 0.75rem;
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`

const UserChip = styled.div`
  padding: 0.6rem 0.85rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    display: none;
  }
`

const FooterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  width: 100%;
  padding: 0.65rem 0.85rem;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  border-radius: 8px;
  font-size: 0.93rem;
  font-weight: 500;
  text-align: left;
  font-family: inherit;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: white;
  }

  .label {
    @media (max-width: 768px) {
      display: none;
    }
  }
`

const Sidebar = () => {
  const { user, profile } = useUser()
  const { mode, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const isStaff = profile?.role === ROLES.STAFF || profile?.role === ROLES.ADMIN

  const handleLogout = async () => {
    await signOut(auth)
    navigate(ROUTES.HOME)
  }

  return (
    <Aside>
      <Brand to={ROUTES.HOME}>
        <LogoBox>
          <img src="aos.png" alt="Logo" />
        </LogoBox>
        <span className="label">AOSL</span>
      </Brand>

      <Nav>
        <Item to={ROUTES.DASHBOARD} end>
          <LayoutDashboard size={18} />
          <span className="label">Dashboard</span>
        </Item>
        <Item to={ROUTES.SUPPORT}>
          <LifeBuoy size={18} />
          <span className="label">Issues</span>
        </Item>

        {isStaff && (
          <>
            <Section>Admin</Section>
            <Item to={ROUTES.ADMIN_ISSUES}>
              <Shield size={18} />
              <span className="label">All Issues</span>
            </Item>
          </>
        )}

        <Section>Account</Section>
        <Item to="/settings">
          <Settings size={18} />
          <span className="label">Settings</span>
        </Item>
      </Nav>

      <Footer>
        <UserChip>{user?.email}</UserChip>

        <NotificationsDropdown />

        <FooterButton onClick={toggleTheme} aria-label="Toggle theme">
          {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          <span className="label">
            {mode === 'light' ? 'Dark mode' : 'Light mode'}
          </span>
        </FooterButton>

        <FooterButton onClick={handleLogout}>
          <LogOut size={18} />
          <span className="label">Logout</span>
        </FooterButton>
      </Footer>
    </Aside>
  )
}

export default Sidebar
