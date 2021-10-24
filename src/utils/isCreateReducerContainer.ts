import { ContainerReducer } from '../types/reducerContainer'
import { CreateReducer } from '../reducer'
const CONTAINER = 'reducerContainer'
/**
 * @description 是否创建reducer container 在容器中, 没有则返回 new reducer
 */
export function isCreateReducerContainer(target: Function): Set<ContainerReducer> {
  new CreateReducer({}).addAction
  if (target.prototype[CONTAINER]) return target.prototype[CONTAINER]
  target.prototype[CONTAINER] = new Set()
  return target.prototype[CONTAINER]
}

export function checkTargetIsFunction(target: unknown): never | void {
  if (typeof target !== 'function') throw new TypeError(`The target should be a function type and a ${typeof target} type is passed in`)
}
