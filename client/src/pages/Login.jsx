import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react'
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { auth } from '../services/firebase'
import { ROUTES } from '../constants/routes'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 1.5rem 3rem;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-family: 'Inter', system-ui, sans-serif;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
      ${({ theme }) => theme.colors.border} 1px,
      transparent 1px
    );
    background-size: 32px 32px;
    opacity: 0.4;
    pointer-events: none;
  }
`

const Card = styled.div`
  position: relative;
  width: 100%;
  max-width: 420px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 2.25rem 2rem;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.06),
    0 2px 6px rgba(0, 0, 0, 0.03);
  animation: ${fadeUp} 0.5s ease-out;
`

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.75rem;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};

  .logo {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #ffffff;
    border: 1px solid ${({ theme }) => theme.colors.border};
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .name {
    font-weight: 700;
    font-size: 0.95rem;
    letter-spacing: -0.01em;
  }
`

const Headline = styled.h1`
  font-size: 1.65rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  margin: 0 0 0.4rem 0;
  color: ${({ theme }) => theme.colors.text};
`

const Sub = styled.p`
  font-size: 0.92rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0 0 1.75rem 0;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`

const Label = styled.label`
  font-size: 0.82rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`

const InputWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  .icon-left {
    position: absolute;
    left: 0.85rem;
    color: ${({ theme }) => theme.colors.muted};
    pointer-events: none;
  }
`

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 0.95rem 0.75rem 2.4rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 0.95rem;
  transition: border-color 0.15s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${({ $hasToggle }) => $hasToggle && `padding-right: 2.6rem;`}
`

const ToggleVisibility = styled.button`
  position: absolute;
  right: 0.6rem;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.muted};
  cursor: pointer;
  padding: 0.35rem;
  display: inline-flex;
  border-radius: ${({ theme }) => theme.radii.sm};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`

const ForgotLink = styled.button`
  align-self: flex-end;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  margin-top: -0.4rem;

  &:hover {
    text-decoration: underline;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const SubmitButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.9rem 1.4rem;
  margin-top: 0.5rem;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  font-size: 0.95rem;
  font-family: inherit;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    opacity 0.15s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    opacity: 0.94;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

const ErrorBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.7rem 0.9rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: ${({ theme }) => theme.radii.md};
  color: #ef4444;
  font-size: 0.85rem;
  line-height: 1.45;

  svg {
    flex-shrink: 0;
    margin-top: 1px;
  }
`

const SuccessBanner = styled(ErrorBanner)`
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.25);
  color: #10b981;
`

const Footer = styled.div`
  margin-top: 1.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  text-align: center;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.muted};

  a {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`

const friendlyError = (code) => {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email or password is incorrect.'
    case 'auth/invalid-email':
      return 'That email address looks invalid.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again in a few minutes or reset your password.'
    case 'auth/user-disabled':
      return 'This account has been disabled. Contact support.'
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.'
    default:
      return 'Sign-in failed. Please try again.'
  }
}

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || ROUTES.DASHBOARD

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [resetMsg, setResetMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setResetMsg('')

    if (!email.trim() || !password) {
      setError('Please enter your email and password.')
      return
    }

    setSubmitting(true)
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(friendlyError(err.code))
    } finally {
      setSubmitting(false)
    }
  }

  const handleForgot = async () => {
    setError('')
    setResetMsg('')

    if (!email.trim()) {
      setError('Enter your email above first, then click "Forgot password".')
      return
    }

    try {
      await sendPasswordResetEmail(auth, email.trim())
      setResetMsg(
        `We've sent a password reset link to ${email.trim()}. Check your inbox.`,
      )
    } catch (err) {
      setError(friendlyError(err.code))
    }
  }

  return (
    <Page>
      <Card>
        <Brand to={ROUTES.HOME}>
          <span className="logo">
            <img src="/aos.png" alt="AOS" />
          </span>
          <span className="name">Ashmif Office Solutions</span>
        </Brand>

        <Headline>Welcome back</Headline>
        <Sub>
          Sign in to access your dashboard, projects, and support tickets.
        </Sub>

        {error && (
          <ErrorBanner style={{ marginBottom: '1rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </ErrorBanner>
        )}

        {resetMsg && (
          <SuccessBanner style={{ marginBottom: '1rem' }}>
            <Mail size={16} />
            <span>{resetMsg}</span>
          </SuccessBanner>
        )}

        <Form onSubmit={handleSubmit}>
          <Field>
            <Label htmlFor="email">Email</Label>
            <InputWrap>
              <Mail size={16} className="icon-left" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
                disabled={submitting}
                required
              />
            </InputWrap>
          </Field>

          <Field>
            <Label htmlFor="password">Password</Label>
            <InputWrap>
              <Lock size={16} className="icon-left" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={submitting}
                $hasToggle
                required
              />
              <ToggleVisibility
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </ToggleVisibility>
            </InputWrap>
          </Field>

          <ForgotLink
            type="button"
            onClick={handleForgot}
            disabled={submitting}
          >
            Forgot password?
          </ForgotLink>

          <SubmitButton type="submit" disabled={submitting}>
            {submitting ? (
              'Signing in...'
            ) : (
              <>
                Sign in <ArrowRight size={16} />
              </>
            )}
          </SubmitButton>
        </Form>

        <Footer>
          Don't have an account? <Link to={ROUTES.CONTACT}>Contact us</Link> to
          get set up.
        </Footer>
      </Card>
    </Page>
  )
}

export default Login
