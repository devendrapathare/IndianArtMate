import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './person-2/context/AuthContext/AuthContext.jsx'
import PostContextProvider from './person-2/context/PostContext/PostContext.jsx'
import CartContextProvider from './person-2/context/CartContext/CartContext.jsx'
import HireContextProvider from './person-2/context/HireContext/HIreContext.jsx'
import {CommentProvider} from './person-3/context/CommentContext.jsx'
import SocketProvider from './person-2/context/SocketContext/SocketContext.jsx'
import ChatContextProvider from './person-2/context/chatContext/chatContext.jsx'

createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <PostContextProvider>
      <CartContextProvider>
        <HireContextProvider>
          <ChatContextProvider>
            <CommentProvider>
            <SocketProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </SocketProvider>
            </CommentProvider>
          </ChatContextProvider>
        </HireContextProvider>
      </CartContextProvider>
    </PostContextProvider>
  </AuthContextProvider>
)
