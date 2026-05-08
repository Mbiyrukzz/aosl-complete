import { useState } from 'react'
import styled from 'styled-components'
import {
  Package as PackageIcon,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Globe,
  Server,
  Wrench,
  Repeat,
  KeyRound,
  Headphones,
  Box,
  Mail,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { usePackages } from '../hooks/usePackages'
import { ROUTES } from '../constants/routes'
import { FullScreenLoader } from '../components/Loader'

const Wrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`

const PageHead = styled.div`
  margin-bottom: 2rem;

  h1 {
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 0.4rem 0;
    font-size: 1.75rem;
    letter-spacing: -0.025em;
  }

  p {
    color: ${({ theme }) => theme.colors.muted};
    margin: 0;
    font-size: 0.92rem;
  }
`

const Filters = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`

const FilterChip = styled.button`
  padding: 0.45rem 0.95rem;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.text : theme.colors.surface};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.background : theme.colors.text};
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.text : theme.colors.border};
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s ease;

  &:hover {
    transform: translateY(-1px);
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.25rem;
  transition: border-color 0.15s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  ${({ $urgent }) =>
    $urgent &&
    `&::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: #ef4444;
    }`}
`

const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  margin-bottom: 1rem;
`

const TypeIconBox = styled.div`
  width: 42px;
  height: 42px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $tint }) => $tint};
  color: ${({ $color }) => $color};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

const CardTitle = styled.div`
  flex: 1;
  min-width: 0;

  h3 {
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 0.2rem 0;
    font-size: 1rem;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .type {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
`

const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${({ $tint }) => $tint};
  color: ${({ $color }) => $color};
  flex-shrink: 0;
`

const Description = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.88rem;
  line-height: 1.5;
  margin: 0 0 1rem 0;
`

const ExpiryBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: 1rem;

  .left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.82rem;
  }

  .date {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    font-size: 0.92rem;
  }

  .countdown {
    color: ${({ $urgent }) => ($urgent ? '#ef4444' : 'inherit')};
    font-weight: 600;
    font-size: 0.85rem;
  }
`

const RenewButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1rem;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  font-size: 0.85rem;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.92;
  }
`

const Empty = styled.div`
  text-align: center;
  padding: 4rem 1rem;
  color: ${({ theme }) => theme.colors.muted};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};

  svg {
    color: ${({ theme }) => theme.colors.border};
    margin-bottom: 1rem;
  }

  h3 {
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 0.4rem 0;
    font-size: 1rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 0.88rem;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
`

const TYPE_CONFIG = {
  hosting: {
    color: '#10b981',
    tint: 'rgba(16,185,129,0.12)',
    icon: Server,
    label: 'Hosting',
  },
  domain: {
    color: '#ef4444',
    tint: 'rgba(239,68,68,0.12)',
    icon: Globe,
    label: 'Domain',
  },
  maintenance: {
    color: '#f59e0b',
    tint: 'rgba(245,158,11,0.12)',
    icon: Wrench,
    label: 'Maintenance',
  },
  subscription: {
    color: '#6366f1',
    tint: 'rgba(99,102,241,0.12)',
    icon: Repeat,
    label: 'Subscription',
  },
  license: {
    color: '#8b5cf6',
    tint: 'rgba(139,92,246,0.12)',
    icon: KeyRound,
    label: 'License',
  },
  support_plan: {
    color: '#06b6d4',
    tint: 'rgba(6,182,212,0.12)',
    icon: Headphones,
    label: 'Support plan',
  },
  other: {
    color: '#6b7280',
    tint: 'rgba(107,114,128,0.15)',
    icon: Box,
    label: 'Other',
  },
}

const STATUS_CONFIG = {
  active: {
    color: '#10b981',
    tint: 'rgba(16,185,129,0.12)',
    label: 'Active',
    icon: CheckCircle2,
  },
  expiring_soon: {
    color: '#f59e0b',
    tint: 'rgba(245,158,11,0.12)',
    label: 'Expiring soon',
    icon: AlertTriangle,
  },
  expired: {
    color: '#ef4444',
    tint: 'rgba(239,68,68,0.12)',
    label: 'Expired',
    icon: XCircle,
  },
  cancelled: {
    color: '#6b7280',
    tint: 'rgba(107,114,128,0.15)',
    label: 'Cancelled',
    icon: XCircle,
  },
}

const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

const daysUntil = (date) => {
  const diff = new Date(date) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const MyPackages = () => {
  const { packages = [], loading } = usePackages()
  const [filter, setFilter] = useState('all')

  const filtered = packages.filter((p) =>
    filter === 'all' ? true : p.status === filter,
  )

  if (loading) {
    return (
      <Wrapper>
        <FullScreenLoader />
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <PageHead>
        <h1>My packages</h1>
        <p>Your subscriptions, hosting, domains, and other services with us.</p>
      </PageHead>

      <Filters>
        {[
          { key: 'all', label: 'All' },
          { key: 'active', label: 'Active' },
          { key: 'expiring_soon', label: 'Expiring soon' },
          { key: 'expired', label: 'Expired' },
        ].map((f) => (
          <FilterChip
            key={f.key}
            $active={filter === f.key}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </FilterChip>
        ))}
      </Filters>

      {filtered.length === 0 ? (
        <Empty>
          <PackageIcon size={36} />
          <h3>{packages.length === 0 ? 'No packages yet' : 'Nothing here'}</h3>
          <p>
            {packages.length === 0
              ? "You don't have any packages with us yet. If you think this is wrong, get in touch and we'll sort it out."
              : 'Try a different filter.'}
          </p>
        </Empty>
      ) : (
        <Grid>
          {filtered.map((pkg) => {
            const typeCfg = TYPE_CONFIG[pkg.type] || TYPE_CONFIG.other
            const statusCfg = STATUS_CONFIG[pkg.status] || STATUS_CONFIG.active
            const TypeIcon = typeCfg.icon
            const StatusIcon = statusCfg.icon
            const days = daysUntil(pkg.expiryDate)
            const isUrgent = days <= 7 && days >= 0
            const isExpired = days < 0

            return (
              <Card key={pkg._id} $urgent={isUrgent || isExpired}>
                <CardTop>
                  <TypeIconBox $tint={typeCfg.tint} $color={typeCfg.color}>
                    <TypeIcon size={20} />
                  </TypeIconBox>
                  <CardTitle>
                    <h3>{pkg.name}</h3>
                    <div className="type">{typeCfg.label}</div>
                  </CardTitle>
                  <StatusPill $tint={statusCfg.tint} $color={statusCfg.color}>
                    <StatusIcon size={11} /> {statusCfg.label}
                  </StatusPill>
                </CardTop>

                {pkg.description && (
                  <Description>{pkg.description}</Description>
                )}

                <ExpiryBox $urgent={isUrgent || isExpired}>
                  <div className="left">
                    <Calendar size={14} />
                    <span>{isExpired ? 'Expired on' : 'Expires on'}</span>
                  </div>
                  <div>
                    <div className="date">{formatDate(pkg.expiryDate)}</div>
                  </div>
                  <div className="countdown">
                    {isExpired
                      ? `${Math.abs(days)}d ago`
                      : days === 0
                        ? 'today'
                        : `${days}d`}
                  </div>
                </ExpiryBox>

                {(pkg.status === 'expiring_soon' ||
                  pkg.status === 'expired') && (
                  <RenewButton to={ROUTES.CONTACT}>
                    <Mail size={14} /> Contact us to renew
                  </RenewButton>
                )}
              </Card>
            )
          })}
        </Grid>
      )}
    </Wrapper>
  )
}

export default MyPackages
