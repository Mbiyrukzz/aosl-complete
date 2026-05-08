import { useContext } from 'react'
import { RemindersContext } from '../contexts/RemindersContext'

export const useReminders = () => {
  const ctx = useContext(RemindersContext)
  if (!ctx)
    throw new Error('useReminders must be used inside RemindersProvider')
  return ctx
}
