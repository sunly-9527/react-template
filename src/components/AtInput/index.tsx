import { useEffect, useRef, useState } from 'react'
import SelectUser from './SelectUser'
import './styles.less'

interface AtInputProps {
  height?: number
  onRequest: (key?: string) => Promise<any>
  onChange: (val1: any, val2: any) => void
  value?: string
  onBlur?: () => void
}

let timer: NodeJS.Timeout | null = null

const AtInput = (props: AtInputProps) => {
  const { height = 300, onRequest, onChange } = props

  const [content, setContent] = useState<string>('')
  const [show, setShow] = useState<boolean>(false)
  const [options, setOptions] = useState<[]>([])
  // @ 索引
  const [currentAtIdx, setCurrentAtIdx] = useState<number>()
  // 输入 @ 之前字符串
  const [focusNode, setFocusNode] = useState<Node | string>()
  const [searchStr, setSearchStr] = useState<string>('')
  // x，y 坐标
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  // 选择用户
  const [selectUserList, setSelectUserList] = useState<any[]>([])

  const atRef = useRef<HTMLDivElement>(null)

  const getCursorPosition = () => {
    const { x, y } = window.getSelection()?.getRangeAt(0).getBoundingClientRect() as any
    // 获取编辑器的坐标
    const editorDom = window.document.querySelector('#atInput')
    const { x: eX, y: eY } = editorDom?.getBoundingClientRect() as any
    // 光标所在位置
    setCursorPosition({ x: x - eX, y: y - eY })
  }

  // 获取用户信息
  const fetchOptions = (key?: string) => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(async () => {
      const result = await onRequest(key)
      setOptions(result)
    })
  }

  const onObserveInput = () => {
    let cursorBeforeStr = ''
    const selection: any = window.getSelection()
    if (selection?.focusNode?.data) {
      cursorBeforeStr = selection.focusNode?.data.slice(0, selection.focusOffset)
    }
    setFocusNode(selection.focusNode)
    const lastAtIndex = cursorBeforeStr?.lastIndexOf('@')
    setCurrentAtIdx(lastAtIndex)
    if (lastAtIndex !== -1) {
      getCursorPosition()
      const searchStr = cursorBeforeStr.slice(lastAtIndex + 1)
      if (!searchStr) {
        setSearchStr(searchStr)
        fetchOptions(searchStr)
        setShow(true)
      } else {
        setShow(false)
        setSearchStr('')
      }
    } else {
      setShow(false)
    }
  }

  const createAtSpanTag = (id: string | number, name: string, color = 'blue') => {
    const ele = document.createElement('span')
    ele.className = 'at-span'
    ele.style.color = color
    ele.id = id.toString()
    ele.contentEditable = 'false'
    ele.innerText = `@${name}`
    return ele
  }

  const onSelect = (item: any) => {
    const selection = window.getSelection()
    const range = selection?.getRangeAt(0) as Range
    // 选中输入的 @ 关键字
    range.setStart(focusNode as Node, currentAtIdx!)
    range.setEnd(focusNode as Node, currentAtIdx! + 1 + searchStr.length)
    // 替换为用户名
    range.deleteContents()
    // 创建元素节点
    const atEle = createAtSpanTag(item.id, item.name)
    // 插入元素节点
    range.insertNode(atEle)
    // 光标移动到末尾
    range.collapse()
    // 缓存已选中的用户
    setSelectUserList([...selectUserList, item])
    // 选择用户后重新计算内容
    setContent(document.getElementById('atInput')?.innerText as string)
    setShow(false)
    atRef.current?.focus()
  }

  const selectAtSpanTag = (target: Node) => {
    window.getSelection()?.getRangeAt(0).selectNode(target)
  }

  const onEditorChange = (event: any) => {
    setContent(event.target.innerText)
    onObserveInput()
  }

  const onEditorClick = (event: any) => {
    onObserveInput()
    if (event.target.localName === 'span') {
      selectAtSpanTag(event.target)
    }
  }

  const getAttrIds = () => {
    const spans = document.querySelectorAll('.at-span')
    const ids = new Set()
    spans.forEach(span => ids.add(span.id))
    return selectUserList.filter(s => ids.has(String(s.id)))
  }

  useEffect(() => {
    fetchOptions()
  }, [])

  useEffect(() => {
    const selectUsers = getAttrIds()
    onChange(content, selectUsers)
  }, [JSON.stringify(selectUserList), JSON.stringify(content)])

  return (
    <div style={{ height, position: 'relative' }}>
      <div
        id='atInput'
        ref={atRef}
        className='editor-div'
        contentEditable
        onInput={onEditorChange}
        onClick={onEditorClick}
      />
      <SelectUser {...{ options, cursorPosition, onSelect }} visible={show} />
    </div>
  )
}

export default AtInput
