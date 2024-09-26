import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './person-2/context/AuthContext/AuthContext.jsx'
import PostContextProvider from './person-2/context/PostContext/PostContext.jsx'
import CartContextProvider from './person-2/context/CartContext/CartContext.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <BrowserRouter>
    <AuthContextProvider>
      <PostContextProvider>
        <CartContextProvider>
          <App />
        </CartContextProvider>
      </PostContextProvider>
    </AuthContextProvider>
  </BrowserRouter>
  // </StrictMode>,
)
