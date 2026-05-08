import { useContext } from 'react'
import { PackagesContext } from '../contexts/PackagesContext'

export const usePackages = () => {
  const ctx = useContext(PackagesContext)
  if (!ctx) {
    throw new Error('usePackages must be used inside PackagesProvider')
  }
  return ctx
}
