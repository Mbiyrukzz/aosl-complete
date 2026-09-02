import { useContext } from 'react'
import { AdminPaymentsContext } from '../contexts/AdminPaymentsContext'

export const useAdminPayments = () => useContext(AdminPaymentsContext)
