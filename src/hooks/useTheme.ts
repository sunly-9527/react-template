import { useState } from 'react'
import useLatest from './useLatest'

const useTheme = () => {
  const htmlDom = document.querySelector('html')
  const [isDark, setDark] = useState(!!htmlDom?.classList.contains('dark'))
  const observer = useLatest<MutationObserver | null>(null)

  if (!observer.current) {
    observer.current = new MutationObserver(mutation => {
      for (const item of mutation) {
        if (item.type === 'attributes' && item.attributeName === 'class') {
          const currentClass = (item.target as HTMLElement).className
          setDark(currentClass.includes('dark'))
        }
      }
    })
  }
  const observerOptions = {
    attributes: true,
    attributeFilter: ['class']
  }
  observer.current.observe(htmlDom as Node, observerOptions)

  return {
    isDark
  }
}

export default useTheme
