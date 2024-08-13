import AtInput from './components/AtInput'

function App() {
  const queryUserAll = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          code: 200,
          data: [
            {
              uid: 1,
              nickname: '唐老师',
              avatarUrl: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
            },
            {
              uid: 2,
              nickname: '邓老师',
              avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/pixel/27.jpg'
            },
            {
              uid: 3,
              nickname: '郑老师',
              avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/pixel/26.jpg'
            },
            {
              uid: 4,
              nickname: '刘老师',
              avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/pixel/25.jpg'
            },
            {
              uid: 5,
              nickname: '李老师',
              avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/pixel/24.jpg'
            },
            {
              uid: 6,
              nickname: '刘老师',
              avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/pixel/23.jpg'
            },
            {
              uid: 7,
              nickname: '张老师',
              avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/pixel/22.jpg'
            },
            {
              uid: 8,
              nickname: '徐老师',
              avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/pixel/21.jpg'
            },
            {
              uid: 9,
              nickname: '陈老师',
              avatarUrl: 'https://xsgames.co/randomusers/assets/avatars/pixel/20.jpg'
            }
          ]
        })
      }, 100)
    })
  }

  return (
    <div className={'App'}>
      <AtInput
        height={150}
        onRequest={async () => {
          const { data = [] }: any = await queryUserAll()
          return data?.map((v: { uid: number; nickname: string; avatarUrl: string }) => ({
            id: v.uid,
            name: v.nickname,
            avatarUrl: v.avatarUrl
          }))
        }}
        onChange={(content, selected) => {
          console.log(content, selected)
        }}
      />
    </div>
  )
}

export default App
