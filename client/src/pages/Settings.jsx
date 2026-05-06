import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import {
  User,
  Mail,
  Camera,
  Lock,
  Bell,
  Save,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  AtSign,
} from 'lucide-react'
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  verifyBeforeUpdateEmail,
} from 'firebase/auth'
import { auth } from '../services/firebase'
import { useUser } from '../hooks/useUser'
import { useAuthedRequest } from '../hooks/useAuthedRequest'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

/* ---------- Layout ---------- */

const Wrapper = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 2rem 5rem;
`

const PageHead = styled.div`
  margin-bottom: 2.5rem;

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

const Section = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.75rem;
  margin-bottom: 1.5rem;
`

const SectionHead = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 1.25rem;

  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: ${({ $tint }) => $tint};
    color: ${({ $color }) => $color};
    border-radius: ${({ theme }) => theme.radii.md};
  }

  h2 {
    font-size: 1.1rem;
    font-weight: 700;
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    letter-spacing: -0.015em;
  }

  .desc {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.82rem;
    margin: 0.15rem 0 0 0;
  }
`

const HeadText = styled.div`
  flex: 1;
`

/* ---------- Avatar ---------- */

const AvatarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
`

const AvatarWrap = styled.div`
  position: relative;
  width: 88px;
  height: 88px;
  border-radius: 50%;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.primary};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.6rem;
  flex-shrink: 0;
  border: 2px solid ${({ theme }) => theme.colors.border};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const ChangeAvatarBtn = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 500;
  font-size: 0.85rem;
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  input {
    display: none;
  }
`

const AvatarMeta = styled.div`
  flex: 1;
  min-width: 0;

  .name {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    font-size: 1rem;
    margin-bottom: 0.2rem;
  }

  .email {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.85rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .actions {
    margin-top: 0.6rem;
  }
`

/* ---------- Form fields ---------- */

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
  margin-bottom: 0.85rem;

  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }
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
  color: ${({ theme }) => theme.colors.text};
`

const Input = styled.input`
  padding: 0.7rem 0.95rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 0.92rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const Textarea = styled.textarea`
  padding: 0.7rem 0.95rem;
  min-height: 84px;
  resize: vertical;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 0.92rem;
  line-height: 1.5;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const SaveBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 0.5rem;
`

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.7rem 1.2rem;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  font-family: inherit;
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
  gap: 0.55rem;
  padding: 0.7rem 0.9rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.85rem;
  line-height: 1.45;
  margin-bottom: 1rem;

  ${({ $kind }) =>
    $kind === 'success'
      ? `
    background: rgba(16,185,129,0.1);
    border: 1px solid rgba(16,185,129,0.25);
    color: #10b981;
  `
      : `
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.25);
    color: #ef4444;
  `}

  svg {
    flex-shrink: 0;
    margin-top: 1px;
  }
`

/* ---------- Toggle row ---------- */

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  .info {
    flex: 1;
    min-width: 0;
  }

  .title {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.93rem;
    margin-bottom: 0.2rem;
  }

  .desc {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 0.82rem;
    line-height: 1.45;
  }
`

const Toggle = styled.button`
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: 999px;
  border: none;
  background: ${({ $on, theme }) =>
    $on ? theme.colors.primary : theme.colors.border};
  cursor: pointer;
  transition: background 0.2s ease;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${({ $on }) => ($on ? '22px' : '2px')};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    transition: left 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
`

/* ---------- Helper ---------- */

const initials = (name = '') => {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase() || '?'
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const friendlyAuthError = (code) => {
  switch (code) {
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Current password is incorrect.'
    case 'auth/weak-password':
      return 'New password is too weak. Use at least 6 characters.'
    case 'auth/requires-recent-login':
      return 'Please sign out and sign in again before making this change.'
    case 'auth/email-already-in-use':
      return 'That email is already in use by another account.'
    case 'auth/invalid-email':
      return 'That email address is invalid.'
    default:
      return 'Something went wrong. Please try again.'
  }
}

/* ---------- Component ---------- */

const Settings = () => {
  const { user, refreshUser } = useUser() // assumes hook exposes refreshUser
  const { isReady, get, patch, post } = useAuthedRequest()

  const [profile, setProfile] = useState(null)
  const [profileForm, setProfileForm] = useState({
    displayName: '',
    phone: '',
    company: '',
    bio: '',
  })
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMsg, setProfileMsg] = useState(null)

  // Avatar
  const fileRef = useRef(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarMsg, setAvatarMsg] = useState(null)

  // Email change
  const [newEmail, setNewEmail] = useState('')
  const [emailPwd, setEmailPwd] = useState('')
  const [emailSaving, setEmailSaving] = useState(false)
  const [emailMsg, setEmailMsg] = useState(null)

  // Password change
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [pwdSaving, setPwdSaving] = useState(false)
  const [pwdMsg, setPwdMsg] = useState(null)

  // Notifications
  const [prefs, setPrefs] = useState({
    emailIssueUpdates: true,
    emailNewsletters: false,
  })
  const [prefsSaving, setPrefsSaving] = useState(false)

  /* --- Load profile --- */
  useEffect(() => {
    const load = async () => {
      if (!isReady) return
      try {
        const data = await get('/api/users/me')
        setProfile(data.user)
        setProfileForm({
          displayName: data.user.displayName || '',
          phone: data.user.phone || '',
          company: data.user.company || '',
          bio: data.user.bio || '',
        })
        if (data.user.notificationPrefs) {
          setPrefs(data.user.notificationPrefs)
        }
      } catch (err) {
        console.error('Failed to load profile:', err)
      }
    }
    load()
  }, [isReady])

  /* --- Save profile --- */
  const saveProfile = async (e) => {
    e.preventDefault()
    setProfileMsg(null)
    setProfileSaving(true)
    try {
      const data = await patch('/api/users/me', profileForm)
      setProfile(data.user)
      setProfileMsg({ kind: 'success', text: 'Profile updated.' })
      if (refreshUser) refreshUser()
    } catch (err) {
      setProfileMsg({
        kind: 'error',
        text: err.response?.data?.error || 'Failed to update profile',
      })
    } finally {
      setProfileSaving(false)
    }
  }

  /* --- Upload avatar --- */
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setAvatarMsg({ kind: 'error', text: 'Image must be under 5MB.' })
      return
    }

    setAvatarMsg(null)
    setAvatarUploading(true)

    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const token = await auth.currentUser?.getIdToken()
      const res = await fetch(`${API_BASE}/api/users/me/avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')

      setProfile(data.user)
      setAvatarMsg({ kind: 'success', text: 'Avatar updated.' })
      if (refreshUser) refreshUser()
    } catch (err) {
      setAvatarMsg({ kind: 'error', text: err.message })
    } finally {
      setAvatarUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  /* --- Change email (Firebase + sync) --- */
  const changeEmail = async (e) => {
    e.preventDefault()
    setEmailMsg(null)

    if (!newEmail.trim() || !emailPwd) {
      setEmailMsg({
        kind: 'error',
        text: 'Enter your new email and current password.',
      })
      return
    }

    setEmailSaving(true)
    try {
      const fbUser = auth.currentUser
      const credential = EmailAuthProvider.credential(fbUser.email, emailPwd)
      await reauthenticateWithCredential(fbUser, credential)

      // Sends a verification email to the NEW address; email only changes after they click the link
      await verifyBeforeUpdateEmail(fbUser, newEmail.trim())

      setEmailMsg({
        kind: 'success',
        text: `Verification sent to ${newEmail}. Click the link in that email to complete the change.`,
      })
      setNewEmail('')
      setEmailPwd('')
    } catch (err) {
      setEmailMsg({ kind: 'error', text: friendlyAuthError(err.code) })
    } finally {
      setEmailSaving(false)
    }
  }

  /* --- Change password --- */
  const changePassword = async (e) => {
    e.preventDefault()
    setPwdMsg(null)

    if (!currentPwd || !newPwd) {
      setPwdMsg({ kind: 'error', text: 'Fill in all fields.' })
      return
    }
    if (newPwd.length < 8) {
      setPwdMsg({
        kind: 'error',
        text: 'New password must be at least 8 characters.',
      })
      return
    }
    if (newPwd !== confirmPwd) {
      setPwdMsg({ kind: 'error', text: 'New passwords do not match.' })
      return
    }

    setPwdSaving(true)
    try {
      const fbUser = auth.currentUser
      const credential = EmailAuthProvider.credential(fbUser.email, currentPwd)
      await reauthenticateWithCredential(fbUser, credential)
      await updatePassword(fbUser, newPwd)

      setPwdMsg({ kind: 'success', text: 'Password updated successfully.' })
      setCurrentPwd('')
      setNewPwd('')
      setConfirmPwd('')
    } catch (err) {
      setPwdMsg({ kind: 'error', text: friendlyAuthError(err.code) })
    } finally {
      setPwdSaving(false)
    }
  }

  /* --- Toggle notification --- */
  const togglePref = async (key) => {
    const next = { ...prefs, [key]: !prefs[key] }
    setPrefs(next)
    setPrefsSaving(true)
    try {
      await patch('/api/users/me', { notificationPrefs: next })
    } catch (err) {
      // Revert on failure
      setPrefs(prefs)
    } finally {
      setPrefsSaving(false)
    }
  }

  if (!profile) {
    return (
      <Wrapper>
        <p style={{ color: 'var(--muted)' }}>Loading settings...</p>
      </Wrapper>
    )
  }

  const avatarSrc = profile.avatarUrl ? `${API_BASE}${profile.avatarUrl}` : null

  return (
    <Wrapper>
      <PageHead>
        <h1>Settings</h1>
        <p>Manage your profile, security, and notification preferences.</p>
      </PageHead>

      {/* ----- PROFILE ----- */}
      <Section>
        <SectionHead $color="#6366f1" $tint="rgba(99,102,241,0.12)">
          <span className="icon">
            <User size={16} />
          </span>
          <HeadText>
            <h2>Profile</h2>
            <p className="desc">How you appear in the app and to your team.</p>
          </HeadText>
        </SectionHead>

        {avatarMsg && (
          <Banner $kind={avatarMsg.kind}>
            {avatarMsg.kind === 'success' ? (
              <CheckCircle2 size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span>{avatarMsg.text}</span>
          </Banner>
        )}

        <AvatarRow>
          <AvatarWrap>
            {avatarSrc ? (
              <img src={avatarSrc} alt={profile.displayName} />
            ) : (
              initials(profile.displayName || profile.email)
            )}
          </AvatarWrap>
          <AvatarMeta>
            <div className="name">{profile.displayName || '(no name set)'}</div>
            <div className="email">{profile.email}</div>
            <div className="actions">
              <ChangeAvatarBtn>
                <Camera size={14} />
                {avatarUploading ? 'Uploading...' : 'Change photo'}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleAvatarChange}
                  disabled={avatarUploading}
                />
              </ChangeAvatarBtn>
            </div>
          </AvatarMeta>
        </AvatarRow>

        {profileMsg && (
          <Banner $kind={profileMsg.kind}>
            {profileMsg.kind === 'success' ? (
              <CheckCircle2 size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span>{profileMsg.text}</span>
          </Banner>
        )}

        <form onSubmit={saveProfile}>
          <Field>
            <Label>Display name</Label>
            <Input
              value={profileForm.displayName}
              onChange={(e) =>
                setProfileForm({ ...profileForm, displayName: e.target.value })
              }
              placeholder="Jane Doe"
            />
          </Field>

          <FormRow>
            <Field>
              <Label>Phone</Label>
              <Input
                type="tel"
                value={profileForm.phone}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, phone: e.target.value })
                }
                placeholder="+254 700 000 000"
              />
            </Field>
            <Field>
              <Label>Company</Label>
              <Input
                value={profileForm.company}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, company: e.target.value })
                }
                placeholder="Acme Ltd"
              />
            </Field>
          </FormRow>

          <Field>
            <Label>Bio</Label>
            <Textarea
              value={profileForm.bio}
              onChange={(e) =>
                setProfileForm({ ...profileForm, bio: e.target.value })
              }
              placeholder="A short note about yourself or your role..."
              maxLength={500}
            />
          </Field>

          <SaveBar>
            <PrimaryButton type="submit" disabled={profileSaving}>
              <Save size={14} />
              {profileSaving ? 'Saving...' : 'Save profile'}
            </PrimaryButton>
          </SaveBar>
        </form>
      </Section>

      {/* ----- EMAIL ----- */}
      <Section>
        <SectionHead $color="#10b981" $tint="rgba(16,185,129,0.12)">
          <span className="icon">
            <AtSign size={16} />
          </span>
          <HeadText>
            <h2>Change email</h2>
            <p className="desc">
              We'll send a verification link to your new email. The change only
              takes effect after you click that link.
            </p>
          </HeadText>
        </SectionHead>

        {emailMsg && (
          <Banner $kind={emailMsg.kind}>
            {emailMsg.kind === 'success' ? (
              <CheckCircle2 size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span>{emailMsg.text}</span>
          </Banner>
        )}

        <form onSubmit={changeEmail}>
          <Field>
            <Label>New email</Label>
            <Input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="new@email.com"
            />
          </Field>
          <Field>
            <Label>Current password (to confirm it's you)</Label>
            <Input
              type="password"
              value={emailPwd}
              onChange={(e) => setEmailPwd(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </Field>

          <SaveBar>
            <PrimaryButton type="submit" disabled={emailSaving}>
              <Mail size={14} />
              {emailSaving ? 'Sending...' : 'Send verification'}
            </PrimaryButton>
          </SaveBar>
        </form>
      </Section>

      {/* ----- PASSWORD ----- */}
      <Section>
        <SectionHead $color="#f59e0b" $tint="rgba(245,158,11,0.12)">
          <span className="icon">
            <KeyRound size={16} />
          </span>
          <HeadText>
            <h2>Change password</h2>
            <p className="desc">
              Use at least 8 characters with a mix of letters and numbers.
            </p>
          </HeadText>
        </SectionHead>

        {pwdMsg && (
          <Banner $kind={pwdMsg.kind}>
            {pwdMsg.kind === 'success' ? (
              <CheckCircle2 size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span>{pwdMsg.text}</span>
          </Banner>
        )}

        <form onSubmit={changePassword}>
          <Field>
            <Label>Current password</Label>
            <Input
              type="password"
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              autoComplete="current-password"
            />
          </Field>
          <FormRow>
            <Field>
              <Label>New password</Label>
              <Input
                type="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                autoComplete="new-password"
              />
            </Field>
            <Field>
              <Label>Confirm new password</Label>
              <Input
                type="password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                autoComplete="new-password"
              />
            </Field>
          </FormRow>

          <SaveBar>
            <PrimaryButton type="submit" disabled={pwdSaving}>
              <Lock size={14} />
              {pwdSaving ? 'Updating...' : 'Update password'}
            </PrimaryButton>
          </SaveBar>
        </form>
      </Section>

      {/* ----- NOTIFICATIONS ----- */}
      <Section>
        <SectionHead $color="#8b5cf6" $tint="rgba(139,92,246,0.12)">
          <span className="icon">
            <Bell size={16} />
          </span>
          <HeadText>
            <h2>Notifications</h2>
            <p className="desc">Choose what shows up in your inbox.</p>
          </HeadText>
        </SectionHead>

        <ToggleRow>
          <div className="info">
            <div className="title">Issue & ticket updates</div>
            <div className="desc">
              Get notified when there's activity on your support tickets.
            </div>
          </div>
          <Toggle
            $on={prefs.emailIssueUpdates}
            onClick={() => togglePref('emailIssueUpdates')}
            disabled={prefsSaving}
            aria-label="Toggle issue updates"
          />
        </ToggleRow>

        <ToggleRow>
          <div className="info">
            <div className="title">Product news & updates</div>
            <div className="desc">
              Occasional emails about new products, features, and offerings.
            </div>
          </div>
          <Toggle
            $on={prefs.emailNewsletters}
            onClick={() => togglePref('emailNewsletters')}
            disabled={prefsSaving}
            aria-label="Toggle newsletters"
          />
        </ToggleRow>
      </Section>
    </Wrapper>
  )
}

export default Settings
