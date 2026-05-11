import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { signOut } from 'firebase/auth'
import {
  LayoutDashboard,
  LifeBuoy,
  Bell,
  LogOut,
  Shield,
  Sun,
  Moon,
  Briefcase,
  Building2,
  Inbox,
  Users,
  Package,
  FileText,
  FileQuestion,
  Settings as SettingsIcon,
  ChevronDown,
} from 'lucide-react'
import { auth } from '../services/firebase'
import { useUser } from '../hooks/useUser'
import { useTheme } from '../hooks/useTheme'
import { ROUTES, ROLES } from '../constants/routes'
import NotificationsDropdown from './NotificationsDropdown'

/* ─── Layout ─────────────────────────────────────────────────────────────── */

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
  overflow-y: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

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
  flex-shrink: 0;

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

/* ─── Flat nav item (Dashboard, Issues) ──────────────────────────────────── */

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

/* ─── Collapsible group ───────────────────────────────────────────────────── */

const GroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`

const GroupTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  width: 100%;
  padding: 0.65rem 0.85rem;
  background: transparent;
  border: none;
  color: ${({ $active }) => ($active ? 'white' : 'rgba(255,255,255,0.7)')};
  cursor: pointer;
  border-radius: 8px;
  font-size: 0.93rem;
  font-weight: 500;
  text-align: left;
  font-family: inherit;
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: white;
  }
  ${({ $active }) => $active && `background: rgba(255,255,255,0.04);`}

  .label {
    flex: 1;
    @media (max-width: 768px) {
      display: none;
    }
  }

  /* hide chevron on mobile */
  .chevron {
    transition: transform 0.2s ease;
    transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0deg)')};
    @media (max-width: 768px) {
      display: none;
    }
  }
`

const GroupChildren = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow: hidden;
  max-height: ${({ $open }) => ($open ? '600px' : '0')};
  transition: max-height 0.25s ease;

  /* on mobile, always show children (tooltip-style not needed since icons visible) */
  @media (max-width: 768px) {
    max-height: unset;
    overflow: visible;
  }
`

const SubItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.58rem 0.85rem 0.58rem 2.6rem;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 450;
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

  /* on mobile collapse to icon-only */
  .label {
    @media (max-width: 768px) {
      display: none;
    }
  }

  @media (max-width: 768px) {
    padding: 0.58rem 0.85rem;
    justify-content: center;
  }
`

/* ─── Footer ──────────────────────────────────────────────────────────────── */

const Footer = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 0.75rem;
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex-shrink: 0;
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

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

/**
 * A collapsible nav group.
 * Auto-opens if the current route matches any child route.
 */
function NavGroup({ icon: Icon, label, routes: childRoutes, children }) {
  const location = useLocation()
  const hasActiveChild = childRoutes.some((r) =>
    location.pathname.startsWith(r),
  )
  const [open, setOpen] = useState(hasActiveChild)

  // Re-evaluate when route changes
  useEffect(() => {
    if (hasActiveChild) setOpen(true)
  }, [location.pathname]) // eslint-disable-line

  return (
    <GroupWrapper>
      <GroupTrigger
        onClick={() => setOpen((v) => !v)}
        $open={open}
        $active={hasActiveChild}
        aria-expanded={open}
      >
        <Icon size={18} />
        <span className="label">{label}</span>
        <ChevronDown size={14} className="chevron" />
      </GroupTrigger>

      <GroupChildren $open={open}>{children}</GroupChildren>
    </GroupWrapper>
  )
}

/* ─── Sidebar ─────────────────────────────────────────────────────────────── */

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
      {/* Brand */}
      <Brand to={ROUTES.HOME}>
        <LogoBox>
          <img src="aos.png" alt="Logo" />
        </LogoBox>
        <span className="label">AOSL</span>
      </Brand>

      <Nav>
        {/* Always-visible top-level items */}
        <Item to={ROUTES.DASHBOARD} end>
          <LayoutDashboard size={18} />
          <span className="label">Dashboard</span>
        </Item>

        <Item to={ROUTES.SUPPORT}>
          <LifeBuoy size={18} />
          <span className="label">Issues</span>
        </Item>

        {/* ── Client-only items ──────────────────────────────────────────── */}
        {!isStaff && (
          <>
            <Item to={ROUTES.MY_PACKAGES}>
              <Package size={18} />
              <span className="label">My Packages</span>
            </Item>
            <Item to={ROUTES.MY_REMINDERS}>
              <Bell size={18} />
              <span className="label">My Reminders</span>
            </Item>
          </>
        )}

        {/* ── Staff / Admin grouped items ────────────────────────────────── */}
        {isStaff && (
          <>
            {/* People: Clients + Applications */}
            <NavGroup
              icon={Users}
              label="People"
              routes={[ROUTES.ADMIN_CLIENTS, ROUTES.ADMIN_APPLICATIONS]}
            >
              <SubItem to={ROUTES.ADMIN_CLIENTS}>
                <Users size={15} />
                <span className="label">Clients</span>
              </SubItem>
              <SubItem to={ROUTES.ADMIN_APPLICATIONS}>
                <Inbox size={15} />
                <span className="label">Applications</span>
              </SubItem>
            </NavGroup>

            {/* Finance: Quotations + Invoices */}
            <NavGroup
              icon={FileText}
              label="Finance"
              routes={[ROUTES.ADMIN_QUOTATIONS, ROUTES.ADMIN_INVOICES]}
            >
              <SubItem to={ROUTES.ADMIN_QUOTATIONS}>
                <FileQuestion size={15} />
                <span className="label">Quotations</span>
              </SubItem>
              <SubItem to={ROUTES.ADMIN_INVOICES}>
                <FileText size={15} />
                <span className="label">Invoices</span>
              </SubItem>
            </NavGroup>

            {/* Operations: Jobs + Companies + Packages */}
            <NavGroup
              icon={Briefcase}
              label="Operations"
              routes={[
                ROUTES.ADMIN_JOBS,
                ROUTES.ADMIN_COMPANIES,
                ROUTES.ADMIN_PACKAGES,
              ]}
            >
              <SubItem to={ROUTES.ADMIN_JOBS}>
                <Briefcase size={15} />
                <span className="label">Jobs</span>
              </SubItem>
              <SubItem to={ROUTES.ADMIN_COMPANIES}>
                <Building2 size={15} />
                <span className="label">Companies</span>
              </SubItem>
              <SubItem to={ROUTES.ADMIN_PACKAGES}>
                <Package size={15} />
                <span className="label">Packages</span>
              </SubItem>
            </NavGroup>

            {/* Workspace: All Issues + Reminders */}
            <NavGroup
              icon={Shield}
              label="Workspace"
              routes={[ROUTES.ADMIN_ISSUES, ROUTES.ADMIN_REMINDERS]}
            >
              <SubItem to={ROUTES.ADMIN_ISSUES}>
                <Shield size={15} />
                <span className="label">All Issues</span>
              </SubItem>
              <SubItem to={ROUTES.ADMIN_REMINDERS}>
                <Bell size={15} />
                <span className="label">Reminders</span>
              </SubItem>
            </NavGroup>
          </>
        )}
      </Nav>

      {/* Footer */}
      <Footer>
        <UserChip>{user?.email}</UserChip>

        <NotificationsDropdown />

        <FooterButton onClick={toggleTheme} aria-label="Toggle theme">
          {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          <span className="label">
            {mode === 'light' ? 'Dark mode' : 'Light mode'}
          </span>
        </FooterButton>

        <Item to={ROUTES.SETTINGS}>
          <SettingsIcon size={18} />
          <span className="label">Settings</span>
        </Item>

        <FooterButton onClick={handleLogout}>
          <LogOut size={18} />
          <span className="label">Logout</span>
        </FooterButton>
      </Footer>
    </Aside>
  )
}

export default Sidebar
