import styled, { keyframes, css } from 'styled-components'

/* ---------- Animations ---------- */

const spin = keyframes`
  to { transform: rotate(360deg); }
`

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
`

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`

const dotBounce = keyframes`
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40% { transform: translateY(-6px); opacity: 1; }
`

/* ---------- Spinner ---------- */

const SpinnerRing = styled.div`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme, $accent }) => $accent || theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  flex-shrink: 0;
`

export const Spinner = ({ size = 20, accent }) => (
  <SpinnerRing
    $size={size}
    $accent={accent}
    aria-label="Loading"
    role="status"
  />
)

/* ---------- Three bouncing dots (good for inline loading messages) ---------- */

const DotsWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`

const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  animation: ${dotBounce} 1.2s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay}s;
`

export const Dots = () => (
  <DotsWrapper aria-label="Loading" role="status">
    <Dot $delay={0} />
    <Dot $delay={0.15} />
    <Dot $delay={0.3} />
  </DotsWrapper>
)

/* ---------- Skeleton — shimmering placeholder shapes ---------- */

const skeletonBase = css`
  background: ${({ theme }) =>
    theme.mode === 'light'
      ? 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)'
      : 'linear-gradient(90deg, #1e293b 0%, #2a3447 50%, #1e293b 100%)'};
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite linear;
  border-radius: ${({ theme }) => theme.radii.md};
`

export const SkeletonLine = styled.div`
  ${skeletonBase};
  height: ${({ $height }) => $height || '14px'};
  width: ${({ $width }) => $width || '100%'};
  margin-bottom: ${({ $mb }) => $mb || '0.5rem'};
`

export const SkeletonBlock = styled.div`
  ${skeletonBase};
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || '60px'};
  border-radius: ${({ theme, $radius }) => $radius || theme.radii.md};
`

export const SkeletonCircle = styled.div`
  ${skeletonBase};
  width: ${({ $size }) => $size || '32px'};
  height: ${({ $size }) => $size || '32px'};
  border-radius: 50%;
  flex-shrink: 0;
`

/* ---------- Full-page loader ---------- */

const FullScreenWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: ${({ $fullScreen }) => ($fullScreen ? '100vh' : '40vh')};
  color: ${({ theme }) => theme.colors.muted};
  animation: ${pulse} 2s ease-in-out infinite;
`

const FullScreenLabel = styled.p`
  font-size: 0.9rem;
  margin: 0;
`

export const FullScreenLoader = ({
  label = 'Loading...',
  fullScreen = false,
}) => (
  <FullScreenWrapper $fullScreen={fullScreen}>
    <SpinnerRing $size={36} />
    <FullScreenLabel>{label}</FullScreenLabel>
  </FullScreenWrapper>
)

/* ---------- Inline button loader (for "Posting...", "Creating...") ---------- */

export const ButtonSpinner = styled(SpinnerRing).attrs({ $size: 14 })`
  border-width: 2px;
  border-top-color: white;
  border-color: rgba(255, 255, 255, 0.3);
  border-top-color: white;
`
