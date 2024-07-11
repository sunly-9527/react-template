import { useRef, useMemo } from 'react'
import './App.css'
import { useVirtualList, useRequest } from './hooks'
import { getRecommendList } from '@/services'

function App() {
  const containerRef = useRef(null)
  const wrapperRef = useRef(null)

  const originalList = useMemo(() => Array.from(Array(99999).keys()), [])

  const [list] = useVirtualList(originalList, {
    containerTarget: containerRef,
    wrapperTarget: wrapperRef,
    itemHeight: 60,
    overscan: 10
  })

  useRequest(getRecommendList, {
    manual: false,
    onSuccess: result => {
      console.log(result)
    }
  })

  return (
    <div className={'App'}>
      <h3>webpack5 + react18 + typescript4.x </h3>
      {/* <h3>虚拟滚动列表</h3> */}
      <div ref={containerRef} style={{ height: '300px', overflow: 'auto', border: '1px solid' }}>
        <div ref={wrapperRef}>
          {list.map(ele => (
            <div
              style={{
                height: 52,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid #e8e8e8',
                marginBottom: 8
              }}
              key={ele.index as any}
            >
              Row: {ele.data}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
