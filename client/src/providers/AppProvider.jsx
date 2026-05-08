import { ThemeProvider } from './ThemeProvider'
import { UserProvider } from './UserProvider'
import { SocketProvider } from './SocketProvider'
import { IssuesProvider } from './IssuesProvider'
import { NotificationsProvider } from './NotificationsProvider'
import GlobalStyles from '../styles/GlobalStyles'
import { PackagesProvider } from './PackagesProvider'
import { RemindersProvider } from './RemindersProvider'

function AppProvider({ children }) {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <UserProvider>
        <SocketProvider>
          <NotificationsProvider>
            <IssuesProvider>
              <PackagesProvider>
                <RemindersProvider>{children} </RemindersProvider>
              </PackagesProvider>
            </IssuesProvider>
          </NotificationsProvider>
        </SocketProvider>
      </UserProvider>
    </ThemeProvider>
  )
}

export default AppProvider
