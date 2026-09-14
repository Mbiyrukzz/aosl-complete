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
  ADMIN_CLIENT_DETAIL: '/admin/clients/:id',
  ADMIN_COMPANIES: '/admin/companies',
  ADMIN_REMINDERS: '/admin/reminders',
  ADMIN_REMINDER_DETAIL: '/admin/reminders/:id',
  ADMIN_PACKAGES: '/admin/packages',
  ADMIN_PACKAGE_DETAIL: '/admin/packages/:id',
  ADMIN_SITES: '/admin/sites',
  ADMIN_PAYMENTS: '/admin/payments',
  ADMIN_SITE_DETAIL: '/admin/sites/:id',
  ADMIN_PAYMENT_DETAIL: '/admin/payments/:id',
  ADMIN_PROJECTS: '/admin/projects',
  ADMIN_PROJECT_DETAIL: '/admin/projects/:id',

  MY_PACKAGES: '/my-packages',
  MY_PACKAGE_DETAIL: '/my-packages/:id',
  MY_REMINDERS: '/my-reminders',
  MY_REMINDER_DETAIL: '/my-reminders/:id',
  MY_PROJECTS: '/my-projects',
  MY_PROJECT_DETAIL: '/my-projects/:id',
  COMPANY_DETAILS: '/dashboard/company',
  ADMIN_INVOICES: '/accounts/invoices',
  ADMIN_QUOTATIONS: '/accounts/quotations',
  ADMIN_COMPANY_DETAIL: '/admin/companies/:id',
  SETTINGS: '/settings',
}

export const buildIssuePath = (id) => `/support/${id}`
export const buildJobPath = (id) => `/careers/${id}`
export const buildAdminCompanyPath = (id) => `/admin/companies/${id}`
export const buildAdminClientPath = (id) => `/admin/clients/${id}`
export const buildAdminPackagePath = (id) => `/admin/packages/${id}`
export const buildMyPackagePath = (id) => `/my-packages/${id}`
export const buildAdminReminderPath = (id) => `/admin/reminders/${id}`
export const buildMyReminderPath = (id) => `/my-reminders/${id}`
export const buildAdminIssuesPath = (companyId) =>
  companyId ? `/admin/issues?companyId=${companyId}` : '/admin/issues'

export const buildAdminSitePath = (id) => `/admin/sites/${id}`
export const buildAdminPaymentPath = (id) => `/admin/payments/${id}`
export const buildAdminProjectPath = (id) => `/admin/projects/${id}`
export const buildMyProjectPath = (id) => `/my-projects/${id}`
export const buildAdminProjectsPath = (companyId) =>
  companyId ? `/admin/projects?companyId=${companyId}` : '/admin/projects'

export const ROLES = {
  CLIENT: 'client',
  STAFF: 'staff',
  ADMIN: 'admin',
}