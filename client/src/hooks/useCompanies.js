import { useContext } from 'react'
import { CompaniesContext } from '../contexts/CompaniesContext'

export const useCompanies = () => {
  const ctx = useContext(CompaniesContext)
  if (!ctx) {
    throw new Error('useCompanies must be used inside CompaniesProvider')
  }
  return ctx
}
