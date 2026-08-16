import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.tsx'
import { CartProvider } from './context/CartContext.tsx'
import './styles/fonts-embedded.css'
import './styles/global.css'

// HashRouter keeps deep links working on any static host, from file://, and
// inside a single-file build — no server rewrites required.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </HashRouter>
  </React.StrictMode>,
)
