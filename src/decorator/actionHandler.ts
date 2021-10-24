import { isCreateReducerContainer, checkTargetIsFunction } from '../utils/isCreateReducerContainer'
import 'reflect-metadata'
export function actionHanlder(type?: string) {
  return (target: object, key: string) => {
    checkTargetIsFunction(target)
    const container = isCreateReducerContainer(target as Function)
  }
}
