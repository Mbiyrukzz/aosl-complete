import { signOut } from 'firebase/auth'
import { useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import { auth } from '../services/firebase'
import { useUser } from '../hooks/useUser'
import { ROUTES } from '../constants/routes'

const Wrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`

const Greeting = styled.h1`
  color: ${({ theme }) => theme.colors.text};
`

const Email = styled.p`
  color: ${({ theme }) => theme.colors.muted};
`

const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
`

const Button = styled.button`
  padding: 0.6rem 1.2rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  font-weight: 500;
`

const SecondaryButton = styled(Button)`
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const Dashboard = () => {
  const { user } = useUser()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut(auth)
    navigate(ROUTES.HOME)
  }

  return (
    <Wrapper>
      <Header>
        <div>
          <Greeting>Dashboard</Greeting>
          <Email>{user?.email}</Email>
        </div>
        <Actions>
          <Button as={Link} to={ROUTES.SUPPORT}>
            View Issues
          </Button>
          <SecondaryButton onClick={handleLogout}>Logout</SecondaryButton>
        </Actions>
      </Header>
    </Wrapper>
  )
}

export default Dashboard
