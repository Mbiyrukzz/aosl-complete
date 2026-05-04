import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import Sidebar from '../components/Sidebar'

const Shell = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`

const Main = styled.main`
  margin-left: 240px;
  min-height: 100vh;

  @media (max-width: 768px) {
    margin-left: 64px;
  }
`

const DashboardLayout = () => {
  return (
    <Shell>
      <Sidebar />
      <Main>
        <Outlet />
      </Main>
    </Shell>
  )
}

export default DashboardLayout
