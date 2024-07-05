import { FC, lazy, Suspense } from 'react'

interface LazyWrapperProps {
  path: string
  type?: 'prefetch' | 'preload' | 'normal'
}

const LazyWrapper: FC<LazyWrapperProps> = ({ path, type = 'normal' }) => {
  const importMap = {
    prefetch: import(
      /* webpackChunkName: "About" */
      /* webpackPrefetch: true */
      `@/pages/${path}`
    ),
    preload: import(
      /* webpackChunkName: "PreloadDemo" */
      /* webpackPreload: true */
      `@/pages/${path}`
    ),
    normal: import(`@/pages/${path}`)
  }

  console.log('LazyWrapper', type, path)

  const LazyComponent = lazy(() => importMap[type])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  )
}
export default LazyWrapper
