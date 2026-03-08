/**
 * Entry point / نقطة الدخول
 * English: Renders the React app into #root, imports global styles
 * العربية: يعرض تطبيق React داخل #root ويستورد الأنماط العامة
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
