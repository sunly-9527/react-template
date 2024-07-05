import { useState, useRef, useMemo } from 'react'
import './App.css'
import useRequest from '@/hooks/useRequest'
import normalImg from '@/assets/test.jpg'
import { useVirtualList } from './hooks'
import { getRecommendList } from '@/services'

interface IState {
  name: string
  age: number
}

function changeUsername(username: string): Promise<{ success: boolean; username: string }> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ success: true, username })
    }, 1000)
  })
}

function App() {
  const [authorInfo, setAuthorInfo] = useState<IState>({ name: '', age: 26 })
  const containerRef = useRef(null)
  const wrapperRef = useRef(null)

  const { loading, run } = useRequest(changeUsername, {
    manual: true,
    onSuccess: result => {
      if (result.success) {
        setAuthorInfo({ ...authorInfo, name: result.username })
      }
    }
  })
  useRequest(getRecommendList, {
    manual: false,
    onSuccess: result => {
      console.log(result)
    }
  })

  const originalList = useMemo(() => Array.from(Array(99999).keys()), [])

  const [list] = useVirtualList(originalList, {
    containerTarget: containerRef,
    wrapperTarget: wrapperRef,
    itemHeight: 60,
    overscan: 10
  })

  return (
    <div className={'App'}>
      <h3>webpack5 + react18 + typescript4.x </h3>
      <p>author：{authorInfo.name}</p>
      <p>age：{authorInfo.age}</p>
      <img src={normalImg} style={{ width: 240 }} alt='正常图片' />
      <div>
        <input
          onChange={e => setAuthorInfo({ ...authorInfo, name: e.target.value })}
          value={authorInfo.name}
          placeholder='Please enter username'
          style={{ width: 240, marginRight: 16 }}
        />
        <button disabled={loading} type='button' onClick={() => run(authorInfo.name)}>
          {loading ? 'Loading' : 'Edit'}
        </button>
      </div>

      <h3>虚拟滚动列表</h3>
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
