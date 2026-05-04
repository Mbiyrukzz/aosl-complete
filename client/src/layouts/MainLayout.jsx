import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import Navbar from '../components/Navbar'

const Page = styled.main`
  padding-top: 6rem; /* clear the floating navbar */
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Page>
        <Outlet />
      </Page>
    </>
  )
}

export default MainLayout
