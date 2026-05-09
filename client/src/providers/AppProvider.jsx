import { ThemeProvider } from './ThemeProvider'
import { UserProvider } from './UserProvider'
import { SocketProvider } from './SocketProvider'
import { IssuesProvider } from './IssuesProvider'
import { NotificationsProvider } from './NotificationsProvider'
import GlobalStyles from '../styles/GlobalStyles'
import { PackagesProvider } from './PackagesProvider'
import { RemindersProvider } from './RemindersProvider'
import { CompaniesProvider } from './CompaniesProvider'

function AppProvider({ children }) {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <UserProvider>
        <SocketProvider>
          <NotificationsProvider>
            <CompaniesProvider>
              <IssuesProvider>
                <PackagesProvider>
                  <RemindersProvider>{children} </RemindersProvider>
                </PackagesProvider>
              </IssuesProvider>
            </CompaniesProvider>
          </NotificationsProvider>
        </SocketProvider>
      </UserProvider>
    </ThemeProvider>
  )
}

export default AppProvider
