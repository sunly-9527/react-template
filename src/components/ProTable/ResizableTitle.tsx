import React, { useState } from 'react'
import { Resizable, ResizableProps } from 'react-resizable'
import 'react-resizable/css/styles.css'

type ResizableTitleProps = {
  onResize: (e: React.SyntheticEvent<Element>, data: { size: { width: number; height: number } }) => void
  width?: number | string
  [key: string]: any
}

/**
 * 可调整宽度的表格标题组件
 * 
 * @param props 组件属性
 * @returns React组件
 */
const ResizableTitle: React.FC<ResizableTitleProps> = props => {
  const { onResize, width, ...restProps } = props
  const [resizing, setResizing] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  if (!width) {
    return <th {...restProps} />
  }

  // 确保width是数字
  const numWidth = typeof width === 'string' ? parseInt(width, 10) : width

  // 处理拖拽开始事件
  const handleResizeStart = () => {
    setResizing(true)
  }

  // 处理拖拽结束事件
  const handleResizeStop = () => {
    setResizing(false)
  }

  return (
    <Resizable
      width={numWidth}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={e => e.stopPropagation()}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            zIndex: 1,
            width: 10,
            height: '100%',
            cursor: 'col-resize',
            transition: 'background-color 0.2s',
            backgroundColor: resizing || isHovering ? 'rgba(0, 0, 0, 0.1)' : 'transparent'
          }}
        />
      }
      onResize={onResize}
      onResizeStart={handleResizeStart}
      onResizeStop={handleResizeStop}
      draggableOpts={{ 
        enableUserSelectHack: false,
        // 减小拖拽阻力，提高流畅度
        offsetParent: document.body,
        grid: [1, 0], // 只在水平方向移动
      }}
    >
      <th 
        {...restProps} 
        style={{ 
          ...restProps.style, 
          position: 'relative',
          transition: 'width 0.05s', // 添加宽度变化的过渡效果
          backgroundColor: resizing ? 'rgba(0, 0, 0, 0.02)' : restProps.style?.backgroundColor,  // 拖拽时显示背景色
        }} 
      />
    </Resizable>
  )
}

export default ResizableTitle
