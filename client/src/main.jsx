import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

requestAnimationFrame(() => {
  const loader = document.getElementById('boot-loader')
  if (!loader) return
  loader.classList.add('fade')
  setTimeout(() => loader.remove(), 350)
})
