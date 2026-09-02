import { useContext } from 'react'
import { SitesContext } from '../contexts/SitesContext'

export const useSites = () => useContext(SitesContext)
