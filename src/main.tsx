import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/onest'
import '@fontsource/eb-garamond/400.css'
import '@fontsource/eb-garamond/400-italic.css'
import '@fontsource-variable/jetbrains-mono'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
