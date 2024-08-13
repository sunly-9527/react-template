import { DependencyList } from 'react'
import { TargetType, BasicTarget, TargetValue, DebouncedFunction } from './typings'

export const isObject = (value: unknown): value is Record<any, any> =>
  value !== null && typeof value === 'object'

export const isFunction = (value: unknown): value is Function => typeof value === 'function'

export const isString = (value: unknown): value is string => typeof value === 'string'

export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean'

export const isNumber = (value: unknown): value is number => typeof value === 'number'

export const isUndef = (value: unknown): value is undefined => typeof value === 'undefined'

export const getTargetElement = <T extends TargetType>(
  target: BasicTarget<T>,
  defaultElement?: T
) => {
  if (!target) {
    return defaultElement
  }

  let targetElement: TargetValue<T>

  if (isFunction(target)) {
    targetElement = target()
  } else if ('current' in target) {
    targetElement = target.current
  } else {
    targetElement = target
  }

  return targetElement
}

export const depsAreSame = (oldDeps: DependencyList, deps: DependencyList): boolean => {
  if (oldDeps === deps) return true
  for (let i = 0; i < oldDeps.length; i++) {
    if (!Object.is(oldDeps[i], deps[i])) return false
  }
  return true
}

export const toChineseNumber = (num: number) => {
  const units = ['', '十', '百', '千', '万', '十万', '百万', '千万', '亿']
  const decimals = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']

  const parts = num
    .toString()
    .replace(/(?=(\d{4})+$)/g, ',')
    .split(',')
    .filter(Boolean)

  let result = ''
  const data = parts[0]
  for (let i = 0; i < data.length; i++) {
    result += decimals[data[i]]
    if (i < data.length - 1) {
      result += units[i]
    }
  }
  return result
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): DebouncedFunction<T> {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}
