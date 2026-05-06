import { useState } from 'react'
import axios from 'axios'
import styled, { keyframes, css } from 'styled-components'
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  MessageCircle,
  Clock,
} from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

/* ---------- Animations ---------- */

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
`

/* ---------- Layout ---------- */

const Page = styled.div`
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-family: 'Inter', system-ui, sans-serif;
  min-height: 100vh;
`

/* ---------- Hero ---------- */

const Hero = styled.section`
  position: relative;
  padding: 8rem 2rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
  overflow: hidden;

  @media (max-width: 720px) {
    padding: 6rem 1.25rem 3rem;
  }
`

const HeroDecor = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 500px;
  height: 500px;
  pointer-events: none;
  z-index: 0;

  /* Soft radial accent */
  background: radial-gradient(
    circle at top right,
    ${({ theme }) => theme.colors.primary}22,
    transparent 60%
  );
`

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 760px;
  animation: ${fadeUp} 0.6s ease-out;
`

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 0.85rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 1.5rem;

  .pulse {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
  }
`

const Headline = styled.h1`
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -0.04em;
  margin: 0 0 1.5rem 0;

  span.accent {
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.primary},
      ${({ theme }) => theme.colors.primary}aa
    );
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-style: italic;
  }
`

const Lead = styled.p`
  font-size: 1.15rem;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0;
  max-width: 580px;
`

/* ---------- Body grid ---------- */

const Body = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 2rem 7rem;
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 4rem;
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 3rem;
    padding: 1rem 1.25rem 4rem;
  }
`

/* ---------- Left rail ---------- */

const LeftRail = styled.div`
  position: sticky;
  top: 6rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;

  @media (max-width: 960px) {
    position: static;
  }
`

const NumberHighlight = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.muted};
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  letter-spacing: 0.04em;

  .num {
    font-size: 4rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1;
    letter-spacing: -0.03em;
    font-family: inherit;
  }

  .unit {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
`

const NumberCaption = styled.p`
  font-size: 0.95rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0;
  max-width: 320px;
`

const ContactList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  h3 {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${({ theme }) => theme.colors.muted};
    margin: 0 0 0.75rem 0;
    font-weight: 500;
  }
`

const ContactLink = styled.a`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.1rem 0;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  transition: padding 0.25s ease;

  &:last-child {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  &:hover {
    padding-left: 0.5rem;
    color: ${({ theme }) => theme.colors.primary};

    .arrow {
      opacity: 1;
      transform: translate(2px, -2px);
    }
  }

  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
    flex-shrink: 0;
    transition: background 0.18s ease;
  }

  .body {
    flex: 1;
    min-width: 0;
  }

  .label {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${({ theme }) => theme.colors.muted};
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 0.2rem;
  }

  .value {
    font-size: 0.98rem;
    font-weight: 500;
  }

  .arrow {
    opacity: 0;
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
    flex-shrink: 0;
  }
`

/* ---------- Form card ---------- */

const FormCard = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
`

const FormHeader = styled.div`
  padding: 1.85rem 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;

  h2 {
    font-size: 1.15rem;
    font-weight: 600;
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    letter-spacing: -0.01em;
  }

  .estimate {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.muted};
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }
`

const Form = styled.form`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 540px) {
    padding: 1.5rem;
  }
`

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;

  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }
`

/* Floating label field */
const Field = styled.div`
  position: relative;
`

const Input = styled.input`
  width: 100%;
  padding: 1.4rem 1rem 0.6rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 0.95rem;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus + label,
  &:not(:placeholder-shown) + label {
    transform: translateY(-0.55rem) scale(0.85);
    color: ${({ theme }) => theme.colors.primary};
  }
`

const Textarea = styled.textarea`
  width: 100%;
  padding: 1.5rem 1rem 0.7rem;
  min-height: 160px;
  resize: vertical;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 0.95rem;
  line-height: 1.6;
  transition: border-color 0.15s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus + label,
  &:not(:placeholder-shown) + label {
    transform: translateY(-0.55rem) scale(0.85);
    color: ${({ theme }) => theme.colors.primary};
  }
`

const FloatingLabel = styled.label`
  position: absolute;
  left: 1rem;
  top: 1rem;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.muted};
  pointer-events: none;
  transform-origin: left top;
  transition:
    transform 0.18s ease,
    color 0.18s ease;
  background: ${({ theme }) => theme.colors.background};
  padding: 0 0.3rem;

  .required {
    color: ${({ theme }) => theme.colors.primary};
  }
`

const Select = styled.select`
  width: 100%;
  padding: 1.4rem 2.4rem 0.6rem 1rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 0.95rem;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  /* Always treat select as "filled" so label floats */
  & + label {
    transform: translateY(-0.55rem) scale(0.85);
  }
`

const ProjectTypeChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  .chip-label {
    width: 100%;
    font-size: 0.85rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0.35rem;

    .meta {
      font-weight: 400;
      color: ${({ theme }) => theme.colors.muted};
      font-size: 0.78rem;
      margin-left: 0.5rem;
    }
  }
`

const Chip = styled.button.attrs({ type: 'button' })`
  padding: 0.55rem 1rem;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.background};
  color: ${({ $active, theme }) => ($active ? '#fff' : theme.colors.text)};
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.border};
  border-radius: 999px;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const CharCounter = styled.div`
  display: flex;
  justify-content: flex-end;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  color: ${({ theme, $danger }) => ($danger ? '#ef4444' : theme.colors.muted)};
  margin-top: -0.5rem;
`

const HoneyPot = styled.div`
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
`

/* ---------- Submit button (richer) ---------- */

const SubmitButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding: 1rem 1.5rem;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  font-family: inherit;
  transition:
    transform 0.15s ease,
    opacity 0.15s ease;
  overflow: hidden;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Shimmer effect when loading */
  ${({ $loading }) =>
    $loading &&
    css`
      background: linear-gradient(90deg, #1f2937 0%, #374151 50%, #1f2937 100%);
      background-size: 200% 100%;
      animation: ${shimmer} 1.5s infinite linear;
      color: white;
    `}
`

/* ---------- Status banners ---------- */

const Status = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding: 1.1rem 1.2rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.92rem;
  line-height: 1.55;
  animation: ${scaleIn} 0.25s ease-out;

  ${({ $kind }) =>
    $kind === 'success'
      ? `
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
        border: 1px solid rgba(16, 185, 129, 0.25);
      `
      : `
        background: rgba(239, 68, 68, 0.08);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.25);
      `}

  svg {
    flex-shrink: 0;
    margin-top: 1px;
  }

  strong {
    display: block;
    margin-bottom: 0.2rem;
  }
`

/* ---------- Component ---------- */

const PROJECT_TYPES = [
  { value: 'web_app', label: 'Web app' },
  { value: 'mobile', label: 'Mobile app' },
  { value: 'website', label: 'Website' },
  { value: 'backend', label: 'Backend / API' },
  { value: 'other', label: 'Something else' },
]

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    budget: '',
    projectType: '',
    message: '',
    website: '', // honeypot
  })
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState(null)

  const updateField = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value })

  const setProjectType = (value) => {
    setForm({ ...form, projectType: form.projectType === value ? '' : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)
    setSubmitting(true)

    // Compose message with project type prepended
    const finalMessage = form.projectType
      ? `[Project type: ${
          PROJECT_TYPES.find((t) => t.value === form.projectType)?.label
        }]\n\n${form.message}`
      : form.message

    try {
      await axios.post(`${API_BASE}/api/contact`, {
        ...form,
        message: finalMessage,
      })
      setStatus({
        kind: 'success',
        title: 'Message received',
        message:
          'We sent a confirmation to your email. Expect a reply within one business day.',
      })
      setForm({
        name: '',
        email: '',
        company: '',
        budget: '',
        projectType: '',
        message: '',
        website: '',
      })
    } catch (err) {
      const errMsg =
        err.response?.data?.error ||
        'Something went wrong. Please try again or email us directly.'
      setStatus({
        kind: 'error',
        title: 'Could not send',
        message: errMsg,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const messageLength = form.message.length
  const messageOverLimit = messageLength > 5000

  return (
    <Page>
      <Hero>
        <HeroDecor />
        <HeroContent>
          <Eyebrow>
            <span className="pulse" />
            // Currently accepting projects
          </Eyebrow>
          <Headline>
            Let's build <span className="accent">something good.</span>
          </Headline>
          <Lead>
            Tell us about your project — the rough idea is fine. We'll figure
            out the specifics together. No sales pitch, no pressure, no
            auto-reply spam.
          </Lead>
        </HeroContent>
      </Hero>

      <Body>
        <LeftRail>
          <div>
            <NumberHighlight>
              <span className="num">24h</span>
              <span className="unit">avg response</span>
            </NumberHighlight>
            <NumberCaption>
              We don't ghost. Every inquiry gets a personal response within one
              business day, usually faster.
            </NumberCaption>
          </div>

          <ContactList>
            <h3>// Or reach us directly</h3>

            <ContactLink href="mailto:hello@ashmif.com">
              <span className="icon">
                <Mail size={16} />
              </span>
              <div className="body">
                <div className="label">Email</div>
                <div className="value">hello@ashmif.com</div>
              </div>
              <ArrowUpRight className="arrow" size={16} />
            </ContactLink>

            <ContactLink href="tel:+254700000000">
              <span className="icon">
                <Phone size={16} />
              </span>
              <div className="body">
                <div className="label">Phone</div>
                <div className="value">+254 758 839 829</div>
              </div>
              <ArrowUpRight className="arrow" size={16} />
            </ContactLink>

            <ContactLink as="span" style={{ cursor: 'default' }}>
              <span className="icon">
                <MapPin size={16} />
              </span>
              <div className="body">
                <div className="label">Location</div>
                <div className="value">Mombasa, Kenya · GMT+3</div>
              </div>
            </ContactLink>

            <ContactLink href="https://wa.me/254758839829">
              <span className="icon">
                <MessageCircle size={16} />
              </span>
              <div className="body">
                <div className="label">WhatsApp</div>
                <div className="value">Message us directly</div>
              </div>
              <ArrowUpRight className="arrow" size={16} />
            </ContactLink>
          </ContactList>
        </LeftRail>

        <FormCard>
          <FormHeader>
            <h2>Project inquiry</h2>
            <span className="estimate">
              <Clock size={12} />
              ~2 minutes
            </span>
          </FormHeader>

          <Form onSubmit={handleSubmit} noValidate>
            <Row>
              <Field>
                <Input
                  type="text"
                  id="name"
                  placeholder=" "
                  value={form.name}
                  onChange={updateField('name')}
                  required
                  maxLength={100}
                />
                <FloatingLabel htmlFor="name">
                  Your name<span className="required"> *</span>
                </FloatingLabel>
              </Field>

              <Field>
                <Input
                  type="email"
                  id="email"
                  placeholder=" "
                  value={form.email}
                  onChange={updateField('email')}
                  required
                />
                <FloatingLabel htmlFor="email">
                  Email<span className="required"> *</span>
                </FloatingLabel>
              </Field>
            </Row>

            <Row>
              <Field>
                <Input
                  type="text"
                  id="company"
                  placeholder=" "
                  value={form.company}
                  onChange={updateField('company')}
                />
                <FloatingLabel htmlFor="company">Company</FloatingLabel>
              </Field>

              <Field>
                <Select
                  id="budget"
                  value={form.budget}
                  onChange={updateField('budget')}
                >
                  <option value="">Not sure yet</option>
                  <option value="$1k - $5k">$1k – $5k</option>
                  <option value="$5k - $15k">$5k – $15k</option>
                  <option value="$15k - $50k">$15k – $50k</option>
                  <option value="$50k+">$50k+</option>
                </Select>
                <FloatingLabel htmlFor="budget">Budget range</FloatingLabel>
              </Field>
            </Row>

            <ProjectTypeChips>
              <div className="chip-label">
                Project type
                <span className="meta">— pick one (optional)</span>
              </div>
              {PROJECT_TYPES.map((type) => (
                <Chip
                  key={type.value}
                  $active={form.projectType === type.value}
                  onClick={() => setProjectType(type.value)}
                >
                  {type.label}
                </Chip>
              ))}
            </ProjectTypeChips>

            <Field>
              <Textarea
                id="message"
                placeholder=" "
                value={form.message}
                onChange={updateField('message')}
                required
                maxLength={5000}
              />
              <FloatingLabel htmlFor="message">
                Tell us about your project<span className="required"> *</span>
              </FloatingLabel>
            </Field>

            <CharCounter $danger={messageOverLimit}>
              {messageLength.toLocaleString()} / 5,000
            </CharCounter>

            <HoneyPot aria-hidden="true">
              <label>
                Website (leave blank)
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={updateField('website')}
                />
              </label>
            </HoneyPot>

            {status && (
              <Status $kind={status.kind}>
                {status.kind === 'success' ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <AlertCircle size={20} />
                )}
                <div>
                  <strong>{status.title}</strong>
                  {status.message}
                </div>
              </Status>
            )}

            <SubmitButton
              type="submit"
              disabled={submitting || messageOverLimit}
              $loading={submitting}
            >
              {submitting ? (
                'Sending message...'
              ) : (
                <>
                  Send message <Send size={16} />
                </>
              )}
            </SubmitButton>
          </Form>
        </FormCard>
      </Body>
    </Page>
  )
}

export default Contact
