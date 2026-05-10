import { useContext } from 'react'
import { AccountsContext } from '../contexts/AccountsContext'

export const useAccounts = () => {
  const context = useContext(AccountsContext)

  if (!context) {
    throw new Error('useAccounts must be used within AccountsProvider')
  }

  return context
}
