import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import LazyWrapper from './LazyWrapper'

export interface RouterConfig {
  path: string
  element: React.ReactNode
  auth: boolean
  children?: RouterConfig[]
  redirect?: string
}

const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/about',
    element: LazyWrapper({ path: 'About' })
  }
])

export default routes
