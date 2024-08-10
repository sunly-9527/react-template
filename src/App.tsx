import AtInput from './components/AtInput'

function App() {
  const queryUserAll = async ({ nickname }) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          code: 200,
          data: [
            { uid: 1, nickname: '张三', wechatAvatarUrl: '' },
            { uid: 2, nickname: '李四', wechatAvatarUrl: '' },
            { uid: 3, nickname: '王五', wechatAvatarUrl: '' },
            { uid: 4, nickname: '刘老师', wechatAvatarUrl: '' },
            { uid: 5, nickname: '李老师', wechatAvatarUrl: '' },
            { uid: 5, nickname: '刘老师', wechatAvatarUrl: '' },
            { uid: 6, nickname: '张老师', wechatAvatarUrl: '' },
            { uid: 7, nickname: '徐老师', wechatAvatarUrl: '' },
            { uid: 8, nickname: '陈老师', wechatAvatarUrl: '' }
          ].filter(v => v.nickname.includes(nickname))
        })
      }, 1000)
    })
  }
  return (
    <div className={'App'}>
      <AtInput
        height={150}
        onRequest={async searchStr => {
          const { data = [] }: any = await queryUserAll({ nickname: searchStr })
          return data?.map(v => ({
            id: v.uid,
            name: v.nickname,
            wechatAvatarUrl: v.wechatAvatarUrl
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
