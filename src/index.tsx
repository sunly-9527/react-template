import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import routers from './routers'
import stores from './stores'

const root = document.querySelector('#root')
if (root) {
  createRoot(root).render(
    <Provider store={stores}>
      <RouterProvider router={routers}></RouterProvider>
    </Provider>
  )
}
