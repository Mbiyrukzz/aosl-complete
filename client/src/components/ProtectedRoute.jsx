import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import { ROUTES } from '../constants/routes'

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, profile, loading } = useUser()
  const location = useLocation()

  if (loading) return <p>Loading...</p>

  if (!user) {
    // Save where they were trying to go so we can redirect back after login
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(profile?.role)) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
