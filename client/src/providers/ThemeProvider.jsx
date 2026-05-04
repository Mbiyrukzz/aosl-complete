import { useEffect, useState } from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { ThemeContext } from '../contexts/ThemeContext'
import { lightTheme, darkTheme } from '../styles/theme'

const STORAGE_KEY = 'theme-mode'

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return saved
    // Respect OS preference on first visit
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode)
  }, [mode])

  const toggleTheme = () => setMode((m) => (m === 'light' ? 'dark' : 'light'))

  const theme = mode === 'light' ? lightTheme : darkTheme

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  )
}
