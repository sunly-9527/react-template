import { useEffect, useRef } from 'react'

const useUnmount = (fn: () => void) => {
  const ref = useRef(fn)
  ref.current = fn

  useEffect(
    () => () => {
      ref.current()
    },
    []
  )
}

export default useUnmount
