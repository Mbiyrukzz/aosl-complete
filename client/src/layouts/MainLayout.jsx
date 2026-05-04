import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Shell = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`

const Page = styled.main`
  flex: 1;
  padding-top: 6rem;
`

const MainLayout = () => {
  return (
    <Shell>
      <Navbar />
      <Page>
        <Outlet />
      </Page>
      <Footer />
    </Shell>
  )
}

export default MainLayout
