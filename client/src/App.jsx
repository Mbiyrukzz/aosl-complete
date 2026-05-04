import AppRoutes from '../AppRoutes'
import Toasts from './components/Toasts'
import AppProvider from './providers/AppProvider'

function App() {
  return (
    <AppProvider>
      <Toasts />
      <AppRoutes />
    </AppProvider>
  )
}

export default App
