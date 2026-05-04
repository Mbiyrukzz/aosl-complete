import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import { ROUTES } from '../constants/routes'
import { FullScreenLoader } from './Loader'

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, profile, loading } = useUser()
  const location = useLocation()

  if (loading)
    return <FullScreenLoader label="Loading your account..." fullScreen />

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(profile?.role)) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
