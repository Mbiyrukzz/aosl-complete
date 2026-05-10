import styled, { css } from 'styled-components'

/* ── Formatting helpers ───────────────────────────────────── */

export const fmt = (n, currency = 'KES') =>
  `${currency} ${Number(n).toLocaleString('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

export const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-KE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—'

export const fmtDateFull = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-KE', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '—'

/* ── Status configs ───────────────────────────────────────── */

export const QUOTATION_STATUS = {
  draft: { label: 'Draft', color: '#64748b', tint: 'rgba(100,116,139,0.12)' },
  sent: { label: 'Sent', color: '#3b82f6', tint: 'rgba(59,130,246,0.12)' },
  accepted: {
    label: 'Accepted',
    color: '#10b981',
    tint: 'rgba(16,185,129,0.12)',
  },
  declined: {
    label: 'Declined',
    color: '#ef4444',
    tint: 'rgba(239,68,68,0.12)',
  },
  converted: {
    label: 'Converted',
    color: '#8b5cf6',
    tint: 'rgba(139,92,246,0.12)',
  },
}

export const INVOICE_STATUS = {
  draft: { label: 'Draft', color: '#64748b', tint: 'rgba(100,116,139,0.12)' },
  sent: { label: 'Sent', color: '#3b82f6', tint: 'rgba(59,130,246,0.12)' },
  paid: { label: 'Paid', color: '#10b981', tint: 'rgba(16,185,129,0.12)' },
  overdue: { label: 'Overdue', color: '#ef4444', tint: 'rgba(239,68,68,0.12)' },
  cancelled: {
    label: 'Cancelled',
    color: '#94a3b8',
    tint: 'rgba(148,163,184,0.12)',
  },
}

/* ── Shared styled components ─────────────────────────────── */

export const PageWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 640px) {
    padding: 1rem;
  }
`

export const PageHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`

export const PageHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;

  .icon-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: rgba(99, 102, 241, 0.12);
    color: #6366f1;
    border-radius: ${({ theme }) => theme.radii?.lg || '12px'};
  }

  h1 {
    color: ${({ theme }) => theme.colors?.text || '#1a1a1a'};
    margin: 0 0 0.2rem 0;
    font-size: 1.65rem;
    letter-spacing: -0.02em;
  }

  p {
    color: ${({ theme }) => theme.colors?.muted || '#6b7280'};
    margin: 0;
    font-size: 0.88rem;
  }
`

export const HeadActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
`

export const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.6rem 1.1rem;
  background: ${({ theme }) => theme.colors?.text || '#1a1a1a'};
  color: ${({ theme }) => theme.colors?.background || '#fff'};
  border: none;
  border-radius: ${({ theme }) => theme.radii?.md || '8px'};
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.6rem 1.1rem;
  background: transparent;
  color: ${({ theme }) => theme.colors?.text || '#1a1a1a'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#e5e7eb'};
  border-radius: ${({ theme }) => theme.radii?.md || '8px'};
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors?.background || '#f9fafb'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const DangerButton = styled(SecondaryButton)`
  color: #ef4444;

  &:hover {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.06);
  }
`

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: ${({ $tint }) => $tint};
  color: ${({ $color }) => $color};

  &::before {
    content: '';
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
  }
`

export const Toolbar = styled.div`
  display: flex;
  gap: 0.6rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  align-items: center;
`

export const SearchWrap = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;

  svg {
    position: absolute;
    left: 0.7rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors?.muted || '#6b7280'};
    pointer-events: none;
  }
`

export const SearchInput = styled.input`
  width: 100%;
  padding: 0.55rem 0.7rem 0.55rem 2.1rem;
  background: ${({ theme }) => theme.colors?.surface || '#fff'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#e5e7eb'};
  border-radius: ${({ theme }) => theme.radii?.md || '8px'};
  color: ${({ theme }) => theme.colors?.text || '#1a1a1a'};
  font-size: 0.88rem;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors?.primary || '#6366f1'};
  }
`

export const FilterSelect = styled.select`
  padding: 0.55rem 2rem 0.55rem 0.75rem;
  background: ${({ theme }) => theme.colors?.surface || '#fff'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#e5e7eb'};
  border-radius: ${({ theme }) => theme.radii?.md || '8px'};
  color: ${({ theme }) => theme.colors?.text || '#1a1a1a'};
  font-size: 0.85rem;
  font-family: inherit;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.6rem center;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors?.primary || '#6366f1'};
  }
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
`

export const Thead = styled.thead`
  background: ${({ theme }) => theme.colors?.background || '#f9fafb'};
  border-bottom: 1px solid ${({ theme }) => theme.colors?.border || '#e5e7eb'};
`

export const Th = styled.th`
  padding: 0.65rem 1rem;
  text-align: left;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: ${({ theme }) => theme.colors?.muted || '#6b7280'};
  white-space: nowrap;

  ${({ $right }) => $right && `text-align: right;`}
`

export const Tr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors?.border || '#e5e7eb'};
  transition: background 0.13s ease;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};

  &:hover {
    background: ${({ $clickable, theme }) =>
      $clickable ? theme.colors?.background || '#f9fafb' : 'transparent'};
  }

  &:last-child {
    border-bottom: none;
  }
`

export const Td = styled.td`
  padding: 0.85rem 1rem;
  color: ${({ theme }) => theme.colors?.text || '#1a1a1a'};
  vertical-align: middle;

  ${({ $muted, theme }) =>
    $muted && `color: ${theme.colors?.muted || '#6b7280'};`}
  ${({ $right }) => $right && `text-align: right;`}
  ${({ $mono }) => $mono && `font-family: monospace; font-size: 0.82rem;`}
`

export const TableCard = styled.div`
  background: ${({ theme }) => theme.colors?.surface || '#fff'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#e5e7eb'};
  border-radius: ${({ theme }) => theme.radii?.lg || '12px'};
  overflow: hidden;
`

export const Empty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors?.muted || '#6b7280'};

  svg {
    color: ${({ theme }) => theme.colors?.border || '#e5e7eb'};
    margin-bottom: 1rem;
  }

  h3 {
    color: ${({ theme }) => theme.colors?.text || '#1a1a1a'};
    margin: 0 0 0.4rem 0;
    font-size: 1.05rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 0.88rem;
    max-width: 300px;
    line-height: 1.5;
  }
`

export const Modal = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(3px);
  }
`

export const ModalBox = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors?.surface || '#fff'};
  border-radius: ${({ theme }) => theme.radii?.lg || '12px'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#e5e7eb'};
  width: 100%;
  max-width: ${({ $wide }) => ($wide ? '780px' : '540px')};
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.75rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
`

export const ModalHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;

  h2 {
    color: ${({ theme }) => theme.colors?.text || '#1a1a1a'};
    font-size: 1.2rem;
    margin: 0;
    letter-spacing: -0.01em;
  }
`

export const CloseBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors?.border || '#e5e7eb'};
  background: transparent;
  color: ${({ theme }) => theme.colors?.muted || '#6b7280'};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors?.background || '#f9fafb'};
    color: ${({ theme }) => theme.colors?.text || '#1a1a1a'};
  }
`

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: ${({ $cols }) => $cols || '1fr 1fr'};
  gap: 0.85rem;

  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;

  ${({ $span }) =>
    $span &&
    css`
      grid-column: 1 / -1;
    `}
`

export const Label = styled.label`
  font-size: 0.78rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.muted || '#6b7280'};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

export const Input = styled.input`
  padding: 0.6rem 0.75rem;
  background: ${({ theme }) => theme.colors?.background || '#f9fafb'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#e5e7eb'};
  border-radius: ${({ theme }) => theme.radii?.md || '8px'};
  color: ${({ theme }) => theme.colors?.text || '#1a1a1a'};
  font-size: 0.9rem;
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors?.primary || '#6366f1'};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors?.muted || '#9ca3af'};
    opacity: 0.7;
  }
`

export const Textarea = styled.textarea`
  padding: 0.6rem 0.75rem;
  background: ${({ theme }) => theme.colors?.background || '#f9fafb'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#e5e7eb'};
  border-radius: ${({ theme }) => theme.radii?.md || '8px'};
  color: ${({ theme }) => theme.colors?.text || '#1a1a1a'};
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors?.primary || '#6366f1'};
  }
`

export const Select = styled.select`
  padding: 0.6rem 0.75rem;
  background: ${({ theme }) => theme.colors?.background || '#f9fafb'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#e5e7eb'};
  border-radius: ${({ theme }) => theme.radii?.md || '8px'};
  color: ${({ theme }) => theme.colors?.text || '#1a1a1a'};
  font-size: 0.9rem;
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors?.primary || '#6366f1'};
  }
`

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid ${({ theme }) => theme.colors?.border || '#e5e7eb'};
`

export const StatCard = styled.button`
  background: ${({ theme }) => theme.colors?.surface || '#fff'};
  border: 1px solid
    ${({ $active, theme }) =>
      $active
        ? theme.colors?.primary || '#6366f1'
        : theme.colors?.border || '#e5e7eb'};
  border-radius: ${({ theme }) => theme.radii?.lg || '12px'};
  padding: 1rem 1.25rem;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.18s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors?.primary || '#6366f1'};
    transform: translateY(-1px);
  }

  .num {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors?.text || '#1a1a1a'};
    line-height: 1;
    letter-spacing: -0.03em;
    margin-bottom: 0.35rem;
  }

  .lbl {
    color: ${({ theme }) => theme.colors?.muted || '#6b7280'};
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
  }
`

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`
