import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import routers from './routers'

const root = document.querySelector('#root')

if (root) {
  createRoot(root).render(
    <StrictMode>
      <RouterProvider router={routers}></RouterProvider>
    </StrictMode>
  )
}
