import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { App } from './app/App'
import './styles/global.css'
import './styles/components.css'

const root = document.getElementById('root')

if (!root) {
  throw new Error('找不到应用挂载节点 #root')
}

createRoot(root).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
