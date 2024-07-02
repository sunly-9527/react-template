import { FC, lazy, Suspense } from 'react'

interface LazyWrapperProps {
  path: string
  type: 'prefetch' | 'preload' | 'normal'
}

const LazyWrapper: FC<LazyWrapperProps> = ({ path, type = 'normal' }) => {
  const PREFIX_PATH = `./pages/${path}`

  const importMap = {
    prefetch: () =>
      import(
        /* webpackChunkName: "PreFetchDemo" */
        /*webpackPrefetch: true*/
        PREFIX_PATH
      ),
    preload: () =>
      import(
        /* webpackChunkName: "PreloadDemo" */
        /*webpackPreload: true*/
        PREFIX_PATH
      ),
    normal: () => import(PREFIX_PATH)
  }

  const LazyComponent = lazy(importMap[type])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  )
}
export default LazyWrapper
