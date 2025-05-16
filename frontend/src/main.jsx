import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './contexts/userContext.jsx'
import { CommentProvider } from './contexts/commnetContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <CommentProvider>
        <App />
      </CommentProvider>
    </UserProvider>
  </StrictMode>,
)
