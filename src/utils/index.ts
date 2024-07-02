import { DependencyList } from 'react'
import { TargetType, BasicTarget, TargetValue } from './typings'

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
