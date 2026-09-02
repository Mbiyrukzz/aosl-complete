import { ThemeProvider } from './ThemeProvider'
import { UserProvider } from './UserProvider'
import { SocketProvider } from './SocketProvider'
import { IssuesProvider } from './IssuesProvider'
import { NotificationsProvider } from './NotificationsProvider'
import GlobalStyles from '../styles/GlobalStyles'
import { PackagesProvider } from './PackagesProvider'
import { RemindersProvider } from './RemindersProvider'
import { CompaniesProvider } from './CompaniesProvider'
import { AccountsProvider } from './AccountsProvider'
import { ClientsProvider } from './ClientsProvider'
import { SitesProvider } from './SitesProvider'
import { AdminPaymentsProvider } from './AdminPaymentsProvider'

function AppProvider({ children }) {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <UserProvider>
        <SocketProvider>
          <NotificationsProvider>
            <CompaniesProvider>
              <ClientsProvider>
                <AccountsProvider>
                  <IssuesProvider>
                    <PackagesProvider>
                      <RemindersProvider>
                        <SitesProvider>
                          <AdminPaymentsProvider>
                            {children}
                          </AdminPaymentsProvider>
                        </SitesProvider>
                      </RemindersProvider>
                    </PackagesProvider>
                  </IssuesProvider>
                </AccountsProvider>
              </ClientsProvider>
            </CompaniesProvider>
          </NotificationsProvider>
        </SocketProvider>
      </UserProvider>
    </ThemeProvider>
  )
}

export default AppProvider
