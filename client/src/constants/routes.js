export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  SERVICES: '/services',
  CONTACT: '/contact',
  CAREERS: '/careers',
  AUTH_ACTION: '/__/auth/action',
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
  ADMIN_COMPANIES: '/admin/companies',
  ADMIN_REMINDERS: '/admin/reminders',
  ADMIN_PACKAGES: '/admin/packages',
  MY_PACKAGES: '/my-packages',
  MY_REMINDERS: '/my-reminders',
  COMPANY_DETAILS: '/dashboard/company',
  ADMIN_INVOICES: '/accounts/invoices',
  ADMIN_QUOTATIONS: '/accounts/quotations',
  ADMIN_COMPANY_DETAIL: '/admin/companies/:id',
  SETTINGS: '/settings',
}

export const buildIssuePath = (id) => `/support/${id}`
export const buildJobPath = (id) => `/careers/${id}`

export const buildAdminCompanyPath = (id) => `/admin/companies/${id}`

export const buildAdminIssuesPath = (companyId) =>
  companyId ? `/admin/issues?companyId=${companyId}` : '/admin/issues'

export const ROLES = {
  CLIENT: 'client',
  STAFF: 'staff',
  ADMIN: 'admin',
}
