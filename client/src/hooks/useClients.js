import { useContext } from 'react'
import { ClientsContext } from '../contexts/ClientsContext'

export const useClients = () => {
  const ctx = useContext(ClientsContext)
  if (!ctx) throw new Error('useClients must be used inside ClientsProvider')
  return ctx
}
