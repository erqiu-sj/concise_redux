import { checkTargetIsFunction, isCreateReducerContainer } from '../utils/isCreateReducerContainer'
import 'reflect-metadata'
export function createReducer() {
  return (target: object) => {
    checkTargetIsFunction(target)
    isCreateReducerContainer(target as Function)
  }
}
