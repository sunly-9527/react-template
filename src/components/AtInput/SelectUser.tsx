import { memo } from 'react'

interface SelectUserProps {
  options: any[] // 选项
  visible: boolean // 是否显示
  cursorPosition: { x: number; y: number } // 光标位置
  onSelect: (option: any) => void // 选中回调
}
const SelectUser = memo((props: SelectUserProps) => {
  const { options, visible, cursorPosition, onSelect } = props

  const { x, y } = cursorPosition

  return (
    <div
      className='selectWrap'
      style={{
        display: `${visible ? 'block' : 'none'}`,
        position: 'absolute',
        left: x,
        top: y + 20
      }}
    >
      <ul>
        {options.map(item => {
          return (
            <li key={item.id} onClick={() => onSelect(item)}>
              <img src={item.wechatAvatarUrl} alt='' />
              <span>{item.name}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
})

export default SelectUser
