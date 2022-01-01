import { addActionParamsHandler } from '../reducer'
const CONTAINER = 'reducerContainer'
/**
 * @description 是否创建reducer container 在容器中, 没有则返回 new reducer
 */
export function isCreateReducerContainer<S, A>(target: Function): Map<string, addActionParamsHandler<S, A>> {
  if (target.prototype[CONTAINER]) return target.prototype[CONTAINER]
  target.prototype[CONTAINER] = new Map()
  return target.prototype[CONTAINER]
}

export function checkTargetIsFunction(target: unknown): never | void {
  if (typeof target !== 'function') throw new TypeError(`The target should be a function type and a ${typeof target} type is passed in`)
}
/**
 * @description reducerHandler 去重
 * @param map
 * @param key
 */
export function deDuplication<S, A>(map: Map<string, addActionParamsHandler<S, A>>, key: string): void | never {
  if (map.has(key)) throw new Error('There can be no handlers with the same key in a reducer')
}
