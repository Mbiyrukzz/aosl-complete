import { createContext, useState } from 'react'

export const ChatbotContext = createContext({
  isOpen: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
})

export const ChatbotProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <ChatbotContext.Provider
      value={{
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        toggle: () => setIsOpen((p) => !p),
      }}
    >
      {children}
    </ChatbotContext.Provider>
  )
}
