export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  SERVICES: '/services',
  CONTACT: '/contact',
  CAREERS: '/careers',
  CHATBOT: '/chatbot',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  SUPPORT: '/support',
  SUPPORT_NEW: '/support/new',
  SUPPORT_DETAIL: '/support/:id',
}

// Helper so consumers don't hardcode `/support/${id}` strings everywhere
export const buildIssuePath = (id) => `/support/${id}`

export const ROLES = {
  CLIENT: 'client',
  STAFF: 'staff',
  ADMIN: 'admin',
}
