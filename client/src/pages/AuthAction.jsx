import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import {
  confirmPasswordReset,
  verifyPasswordResetCode,
  applyActionCode,
} from 'firebase/auth'
import { auth } from '../services/firebase'
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react'
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

const Headline = styled.h1`
  font-size: 1.65rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  margin: 0 0 0.4rem 0;
`

const Sub = styled.p`
  font-size: 0.92rem;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0 0 1.75rem 0;
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 0.85rem;
`

const Label = styled.label`
  font-size: 0.82rem;
  font-weight: 600;
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
  padding: 0.75rem 2.6rem 0.75rem 2.4rem;
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

const SubmitButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
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

const Banner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.7rem 0.9rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.85rem;
  line-height: 1.45;
  margin-bottom: 1rem;
  background: ${({ $success }) =>
    $success ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'};
  border: 1px solid
    ${({ $success }) =>
      $success ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'};
  color: ${({ $success }) => ($success ? '#10b981' : '#ef4444')};
  svg {
    flex-shrink: 0;
    margin-top: 1px;
  }
`

const AuthAction = () => {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const mode = params.get('mode')
  const oobCode = params.get('oobCode')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Handle email verification automatically
  useEffect(() => {
    if (mode === 'verifyEmail' && oobCode) {
      applyActionCode(auth, oobCode)
        .then(() => setSuccess('Email verified! You can now sign in.'))
        .catch(() => setError('Verification link is invalid or expired.'))
    }
  }, [mode, oobCode])

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      await verifyPasswordResetCode(auth, oobCode)
      await confirmPasswordReset(auth, oobCode, password)
      setSuccess('Password updated! Redirecting to login...')
      setTimeout(() => navigate(ROUTES.LOGIN), 2500)
    } catch (err) {
      if (err.code === 'auth/expired-action-code') {
        setError('This reset link has expired. Please request a new one.')
      } else if (err.code === 'auth/invalid-action-code') {
        setError('This reset link is invalid or already used.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (!mode || !oobCode) {
    return (
      <Page>
        <Card>
          <Headline>Invalid Link</Headline>
          <Sub>This link is missing required parameters.</Sub>
          <Link to={ROUTES.LOGIN}>Back to login</Link>
        </Card>
      </Page>
    )
  }

  return (
    <Page>
      <Card>
        {mode === 'resetPassword' && (
          <>
            <Headline>Reset password</Headline>
            <Sub>Enter your new password below.</Sub>

            {error && (
              <Banner>
                <AlertCircle size={16} />
                <span>{error}</span>
              </Banner>
            )}
            {success && (
              <Banner $success>
                <CheckCircle size={16} />
                <span>{success}</span>
              </Banner>
            )}

            {!success && (
              <form onSubmit={handleResetPassword}>
                <Field>
                  <Label>New password</Label>
                  <InputWrap>
                    <Lock size={16} className="icon-left" />
                    <Input
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={submitting}
                      required
                    />
                    <ToggleVisibility
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </ToggleVisibility>
                  </InputWrap>
                </Field>

                <Field>
                  <Label>Confirm password</Label>
                  <InputWrap>
                    <Lock size={16} className="icon-left" />
                    <Input
                      type={showPw ? 'text' : 'password'}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="••••••••"
                      disabled={submitting}
                      required
                    />
                  </InputWrap>
                </Field>

                <SubmitButton type="submit" disabled={submitting}>
                  {submitting ? (
                    'Updating...'
                  ) : (
                    <>
                      {' '}
                      Update password <ArrowRight size={16} />{' '}
                    </>
                  )}
                </SubmitButton>
              </form>
            )}
          </>
        )}

        {mode === 'verifyEmail' && (
          <>
            <Headline>Email verification</Headline>
            {error && (
              <Banner>
                <AlertCircle size={16} />
                <span>{error}</span>
              </Banner>
            )}
            {success && (
              <>
                <Banner $success>
                  <CheckCircle size={16} />
                  <span>{success}</span>
                </Banner>
                <Link to={ROUTES.LOGIN}>Go to login</Link>
              </>
            )}
          </>
        )}
      </Card>
    </Page>
  )
}

export default AuthAction
