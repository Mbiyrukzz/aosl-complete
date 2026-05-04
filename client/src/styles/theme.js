const baseTheme = {
  fonts: {
    body: 'system-ui, -apple-system, sans-serif',
  },
  radii: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
}

export const lightTheme = {
  ...baseTheme,
  mode: 'light',
  colors: {
    primary: '#3b82f6',
    background: '#ffffff',
    surface: '#f9fafb',
    text: '#111827',
    muted: '#6b7280',
    border: '#e5e7eb',
  },
}

export const darkTheme = {
  ...baseTheme,
  mode: 'dark',
  colors: {
    primary: '#60a5fa',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    muted: '#94a3b8',
    border: '#334155',
  },
}
