import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // Import global CSS styles (includes Tailwind directives)

import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'
import ErrorBoundary from './Components/ErrorBoundary'

createRoot(document.getElementById('root')).render( //renders React app into the root html

<StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)

