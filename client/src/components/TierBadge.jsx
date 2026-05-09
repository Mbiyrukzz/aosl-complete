import styled from 'styled-components'
import { Award, Crown, Gem } from 'lucide-react'

const TIER_CONFIG = {
  silver: {
    color: '#94a3b8',
    tint: 'rgba(148,163,184,0.15)',
    icon: Award,
    label: 'Silver',
  },
  gold: {
    color: '#d97706',
    tint: 'rgba(217,119,6,0.15)',
    icon: Crown,
    label: 'Gold',
  },
  platinum: {
    color: '#6366f1',
    tint: 'rgba(99,102,241,0.15)',
    icon: Gem,
    label: 'Platinum',
  },
}

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: ${({ $size }) =>
    $size === 'sm' ? '0.1rem 0.4rem' : '0.2rem 0.6rem'};
  border-radius: 999px;
  font-size: ${({ $size }) => ($size === 'sm' ? '0.65rem' : '0.7rem')};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${({ $tint }) => $tint};
  color: ${({ $color }) => $color};
  flex-shrink: 0;
  white-space: nowrap;
`

const TierBadge = ({ tier, size = 'md', showIcon = true }) => {
  if (!tier) return null
  const cfg = TIER_CONFIG[tier]
  if (!cfg) return null
  const Icon = cfg.icon
  const iconSize = size === 'sm' ? 9 : 11

  return (
    <Badge
      $tint={cfg.tint}
      $color={cfg.color}
      $size={size}
      title={`${cfg.label} tier`}
    >
      {showIcon && <Icon size={iconSize} />}
      {cfg.label}
    </Badge>
  )
}

export default TierBadge
export { TIER_CONFIG }
