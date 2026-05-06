import { useContext } from 'react'
import { ChatbotContext } from '../contexts/ChatbotContext'

export const useChatbot = () => useContext(ChatbotContext)
