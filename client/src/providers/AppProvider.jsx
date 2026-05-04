import { ThemeProvider } from './ThemeProvider'
import { UserProvider } from './UserProvider'
import { IssuesProvider } from './IssuesProvider'
import GlobalStyles from '../styles/GlobalStyles'

function AppProvider({ children }) {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <UserProvider>
        <IssuesProvider>{children}</IssuesProvider>
      </UserProvider>
    </ThemeProvider>
  )
}

export default AppProvider
