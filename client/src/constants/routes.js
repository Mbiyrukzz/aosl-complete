export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  SERVICES: '/services',
  CONTACT: '/contact',
  CAREERS: '/careers',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  SUPPORT: '/support',
  SUPPORT_NEW: '/support/new',
  SUPPORT_DETAIL: '/support/:id',
  ADMIN_ISSUES: '/admin/issues',
  CAREERS_DETAIL: '/careers/:id',
  ADMIN_JOBS: '/admin/jobs',
  ADMIN_APPLICATIONS: '/admin/applications',
  ADMIN_CLIENTS: '/admin/clients',
  SETTINGS: '/settings',
}

// Helper so consumers don't hardcode `/support/${id}` strings everywhere
export const buildIssuePath = (id) => `/support/${id}`

export const buildJobPath = (id) => `/careers/${id}`

export const ROLES = {
  CLIENT: 'client',
  STAFF: 'staff',
  ADMIN: 'admin',
}
