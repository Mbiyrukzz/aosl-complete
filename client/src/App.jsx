import AppRoutes from '../AppRoutes'
import AppProvider from './providers/AppProvider'

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  )
}

export default App
