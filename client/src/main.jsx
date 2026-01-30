import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { CartProvider } from './context/CartContext'
import { AlertProvider } from './context/AlertContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <AlertProvider>
        <App />
      </AlertProvider>
    </CartProvider>
  </React.StrictMode>,
)
