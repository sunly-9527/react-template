import { useRef, useState, useMemo, useEffect } from 'react'
import { BasicTarget } from './typings'
import useLatest from './useLatest'
import useSize from './useSize'
import useEventListener from './useEventListener'
import useMemoizedFn from './useMemoizedFn'

import { isNumber, getTargetElement } from '@/utils'

type ItemHeight<T> = (index: number, data: T) => number

interface Options<T> {
  containerTarget: BasicTarget
  wrapperTarget: BasicTarget
  itemHeight: number | ItemHeight<T>
  overscan?: number
}

const useVirtualList = <T = any>(list: T[], options: Options<T>) => {
  const { containerTarget, wrapperTarget, itemHeight, overscan = 5 } = options

  const itemHeightRef = useLatest(itemHeight)
  const size = useSize(containerTarget)
  const scrollTriggerByScrollToFunc = useRef(false)
  const [targetList, setTargetList] = useState<{ index: Number; data: T }[]>([])

  const getVisibleCount = (containerHeight: number, fromIndex: number) => {
    if (isNumber(itemHeightRef.current)) {
      return Math.ceil(containerHeight / itemHeightRef.current)
    }

    let sum = 0
    let endIndex = 0
    for (let i = fromIndex; i < list.length; i++) {
      const height = itemHeightRef.current(i, list[i])
      sum += height
      endIndex = i
      if (sum >= containerHeight) {
        break
      }
    }
    return endIndex - fromIndex
  }

  const getOffset = (scrollTop: number) => {
    if (isNumber(itemHeightRef.current)) {
      return Math.floor(scrollTop / itemHeightRef.current) + 1
    }
    let sum = 0
    let offset = 0
    for (let i = 0; i < list.length; i++) {
      const height = itemHeightRef.current(i, list[i])
      sum += height
      if (sum >= scrollTop) {
        offset = i
        break
      }
    }
    return offset + 1
  }

  // 获取上部高度
  const getDistanceTop = (index: number) => {
    if (isNumber(itemHeightRef.current)) {
      const height = index * itemHeightRef.current
      return height
    }
    const height = list
      .slice(0, index)
      .reduce((sum, _, i) => sum + (itemHeightRef.current as ItemHeight<T>)(i, list[i]), 0)
    return height
  }

  const totalHeight = useMemo(() => {
    if (isNumber(itemHeightRef.current)) {
      return list.length * itemHeightRef.current
    }
    return list.reduce(
      (sum, _, index) => sum + (itemHeightRef.current as ItemHeight<T>)(index, list[index]),
      0
    )
  }, [list])

  const calculateRange = () => {
    const container = getTargetElement(containerTarget) as HTMLElement
    const wrapper = getTargetElement(wrapperTarget) as HTMLElement

    if (container && wrapper) {
      const { scrollTop, clientHeight } = container

      const offset = getOffset(scrollTop)
      const visibleCount = getVisibleCount(clientHeight, offset)

      const start = Math.max(0, offset - overscan)
      const end = Math.min(list.length, offset + visibleCount + overscan)

      const offsetTop = getDistanceTop(start)

      wrapper.style.height = `${totalHeight - offsetTop}px`
      wrapper.style.marginTop = `${offsetTop}px`
      setTargetList(
        list.slice(start, end).map((ele, index) => ({
          data: ele,
          index: index + start
        }))
      )
    }
  }

  useEffect(() => {
    if (!size?.width || !size?.height) {
      return
    }
    calculateRange()
  }, [size?.width, size?.height, list])

  useEventListener(
    'scroll',
    e => {
      if (scrollTriggerByScrollToFunc.current) {
        scrollTriggerByScrollToFunc.current = false
        return
      }
      e.preventDefault()
      calculateRange()
    },
    {
      target: containerTarget
    }
  )

  const scrollTo = (index: number) => {
    const container = getTargetElement(containerTarget)
    if (container) {
      scrollTriggerByScrollToFunc.current = true
      container.scrollTop = getDistanceTop(index)
      calculateRange()
    }
  }

  return [targetList, useMemoizedFn(scrollTo)] as const
}

export default useVirtualList
