import { Routes, Route } from 'react-router-dom'

import Home from './src/pages/Home'
import Products from './src/pages/Products'
import Services from './src/pages/Services'
import Contact from './src/pages/Contact'
import Careers from './src/pages/Careers'
import Login from './src/pages/Login'
import Dashboard from './src/pages/Dashboard'
import Support from './src/pages/Support'
import IssueDetail from './src/pages/IssueDetail'
import NotFound from './src/pages/NotFound'

import { ROUTES, ROLES } from './src/constants/routes'
import MainLayout from './src/layouts/MainLayout'
import DashboardLayout from './src/layouts/DashboardLayout'
import ProtectedRoute from './src/components/ProtectedRoute'
import AdminIssues from './src/pages/AdminIssues'
import JobDetail from './src/pages/JobDetail'
import AdminJobs from './src/pages/AdminJobs'
import AdminApplications from './src/pages/AdminApplications'
import AdminClients from './src/pages/AdminClients'
import Settings from './src/pages/Settings'
import AdminReminders from './src/pages/AdminReminders'
import AdminPackages from './src/pages/AdminPackages'
import MyPackages from './src/pages/MyPackages'
import MyReminders from './src/pages/MyReminders'
import AuthAction from './src/pages/AuthAction'
import AdminCompanies from './src/pages/AdminCompanies'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.PRODUCTS} element={<Products />} />
        <Route path={ROUTES.SERVICES} element={<Services />} />
        <Route path={ROUTES.CONTACT} element={<Contact />} />
        <Route path={ROUTES.CAREERS} element={<Careers />} />
        <Route path={ROUTES.CAREERS_DETAIL} element={<JobDetail />} />
        <Route path="/__/auth/action" element={<AuthAction />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
      </Route>

      {/* Any logged-in user */}

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.MY_PACKAGES} element={<MyPackages />} />
          <Route path={ROUTES.MY_REMINDERS} element={<MyReminders />} />
          <Route path={ROUTES.SUPPORT} element={<Support />} />
          <Route path={ROUTES.SUPPORT_DETAIL} element={<IssueDetail />} />
          <Route path={ROUTES.SETTINGS} element={<Settings />} />
        </Route>
      </Route>

      {/* Role-restricted */}
      <Route
        element={<ProtectedRoute allowedRoles={[ROLES.STAFF, ROLES.ADMIN]} />}
      >
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.ADMIN_ISSUES} element={<AdminIssues />} />
          <Route path={ROUTES.ADMIN_JOBS} element={<AdminJobs />} />
          <Route
            path={ROUTES.ADMIN_APPLICATIONS}
            element={<AdminApplications />}
          />
          <Route path={ROUTES.ADMIN_REMINDERS} element={<AdminReminders />} />
          <Route path={ROUTES.ADMIN_PACKAGES} element={<AdminPackages />} />
          <Route path={ROUTES.ADMIN_CLIENTS} element={<AdminClients />} />
          <Route path={ROUTES.ADMIN_COMPANIES} element={<AdminCompanies />} />
          <Route path={ROUTES.SETTINGS} element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
