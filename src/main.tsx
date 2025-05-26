import React from 'react'
import type { FC } from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import '@xyflow/react/dist/style.css'

/**
 * Main entry point for the PGN Viewer app.
 * Mounts the React app to the DOM.
 */
const Main: FC = () => (
  <StrictMode>
    <App />
  </StrictMode>
)

createRoot(document.getElementById('root') as HTMLElement).render(<Main />)
