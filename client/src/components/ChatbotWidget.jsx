import { useEffect, useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { MessageCircle, X, Send, Sparkles } from 'lucide-react'
import { useChatbot } from '../hooks/useChatbot'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

/* ---------- Animations ---------- */

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`

const dotBounce = keyframes`
  0%, 80%, 100% { transform: scale(0.5); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
`

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.06); }
`

/* ---------- Floating button ---------- */

const FloatingButton = styled.button`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 998;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.18),
    0 2px 6px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  animation: ${pulse} 2.4s ease-in-out infinite;

  &:hover {
    transform: translateY(-3px) scale(1.04);
    box-shadow:
      0 12px 32px rgba(0, 0, 0, 0.22),
      0 4px 10px rgba(0, 0, 0, 0.1);
    animation-play-state: paused;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 3px;
  }
`

/* ---------- Panel ---------- */

const Panel = styled.div`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 999;
  width: 380px;
  height: min(560px, calc(100vh - 3rem));
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow:
    0 24px 48px rgba(0, 0, 0, 0.18),
    0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${slideUp} 0.25s ease-out;

  @media (max-width: 540px) {
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: 0;
    border: none;
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.1rem;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const HeaderAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`

const HeaderText = styled.div`
  flex: 1;
  min-width: 0;

  .name {
    font-weight: 600;
    font-size: 0.95rem;
    line-height: 1.2;
  }

  .status {
    font-size: 0.75rem;
    opacity: 0.7;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    margin-top: 0.15rem;
  }

  .status::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10b981;
  }
`

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.background};
  opacity: 0.7;
  cursor: pointer;
  padding: 0.4rem;
  display: inline-flex;
  border-radius: 999px;
  transition:
    opacity 0.15s ease,
    background 0.15s ease;

  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
  }
`

/* ---------- Messages ---------- */

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  background: ${({ theme }) => theme.colors.background};

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 3px;
  }
`

const Bubble = styled.div`
  max-width: 85%;
  padding: 0.7rem 0.95rem;
  border-radius: 14px;
  font-size: 0.9rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;

  ${({ $role, theme }) =>
    $role === 'user'
      ? `
    align-self: flex-end;
    background: ${theme.colors.text};
    color: ${theme.colors.background};
    border-bottom-right-radius: 4px;
  `
      : `
    align-self: flex-start;
    background: ${theme.colors.surface};
    color: ${theme.colors.text};
    border: 1px solid ${theme.colors.border};
    border-bottom-left-radius: 4px;
  `}
`

const TypingBubble = styled(Bubble)`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.85rem 1rem;

  span {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.muted};
    animation: ${dotBounce} 1.2s ease-in-out infinite;

    &:nth-child(2) {
      animation-delay: 0.15s;
    }
    &:nth-child(3) {
      animation-delay: 0.3s;
    }
  }
`

const Suggestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.5rem;
`

const Chip = styled.button`
  padding: 0.45rem 0.85rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.8rem;
  font-family: inherit;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    transform 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
  }
`

/* ---------- Input ---------- */

const InputBar = styled.form`
  display: flex;
  gap: 0.5rem;
  padding: 0.85rem 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
`

const Input = styled.input`
  flex: 1;
  padding: 0.65rem 0.9rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
  }
`

const SendButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  cursor: pointer;
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;

  &:hover:not(:disabled) {
    transform: scale(1.06);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

/* ---------- Component ---------- */

const QUICK_SUGGESTIONS = [
  'What products do you offer?',
  'Tell me about SmartRealtors',
  'How do you work with clients?',
  'I have a project idea',
]

const WELCOME_MESSAGE = {
  role: 'assistant',
  content:
    "Hi there! I'm AOS Assistant. I can tell you about our products, services, or help you figure out how we might work together. What would you like to know?",
}

const ChatbotWidget = () => {
  const { isOpen, open, close } = useChatbot()
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const messagesRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll on new message
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages, sending])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 250)
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && isOpen) close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  const sendMessage = async (text) => {
    const trimmed = text.trim()
    if (!trimmed || sending) return

    const userMsg = { role: 'user', content: trimmed }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput('')
    setSending(true)

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply },
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry, something went wrong on my end. You can also reach us via the contact form at /contact.',
        },
      ])
    } finally {
      setSending(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  const showSuggestions = messages.length === 1 && !sending

  if (!isOpen) {
    return (
      <FloatingButton onClick={open} aria-label="Open chat">
        <MessageCircle size={22} />
      </FloatingButton>
    )
  }

  return (
    <Panel role="dialog" aria-label="AOS Assistant chat">
      <Header>
        <HeaderAvatar>
          <Sparkles size={18} />
        </HeaderAvatar>
        <HeaderText>
          <div className="name">AOS Assistant</div>
          <div className="status">Online · Ready to help</div>
        </HeaderText>
        <CloseButton onClick={close} aria-label="Close chat">
          <X size={18} />
        </CloseButton>
      </Header>

      <Messages ref={messagesRef}>
        {messages.map((m, i) => (
          <Bubble key={i} $role={m.role}>
            {m.content}
          </Bubble>
        ))}

        {sending && (
          <TypingBubble $role="assistant">
            <span />
            <span />
            <span />
          </TypingBubble>
        )}

        {showSuggestions && (
          <Suggestions>
            {QUICK_SUGGESTIONS.map((s) => (
              <Chip key={s} onClick={() => sendMessage(s)}>
                {s}
              </Chip>
            ))}
          </Suggestions>
        )}
      </Messages>

      <InputBar onSubmit={handleSubmit}>
        <Input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about our products or services..."
          disabled={sending}
        />
        <SendButton type="submit" disabled={sending || !input.trim()}>
          <Send size={16} />
        </SendButton>
      </InputBar>
    </Panel>
  )
}

export default ChatbotWidget
