import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { scan } from 'react-scan'
import routers from './routers'
import stores from './stores'
import './App.css'

if (typeof window !== 'undefined') {
  scan({
    enabled: true,
    log: true // logs render info to console (default: false)
  })
}

const root = document.querySelector('#root')
if (root) {
  createRoot(root).render(
    <Provider store={stores}>
      <RouterProvider router={routers}></RouterProvider>
    </Provider>
  )
}
