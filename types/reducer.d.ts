import { Dispatch } from './types/store'
import { Reducer } from './types/reducers'
import { Action } from './types/actions'

type stateHandlerType<S, A> = (state: S) => A

type dispatchHandler<A> = (action: A) => A
type dispatchHandleWithReactTypes<A, L extends string> = {
  [k in L]: dispatchHandler<A>
}
export type getAllValsWithActionCollectionHelper<T> = T extends { [key in string]: infer K } ? K : never
export class CreateReducer<S, A, L extends string> {
  constructor(state: S)
  addAction(action: L, handler: (state: S, action: Partial<Action & A>) => S): this
  getActionList(): string[]
  private setDispatch(dispatch: Dispatch<Action & A>): void
  finish(): Reducer<S, Action & A>
  dispatcher(actions: L, states?: Partial<A> | stateHandlerType<S, Partial<A>> | undefined): void
  getCurState(): S
  setReducerKey(key: string): this
  private setGetState(getState: () => S)
  private addDispatchHandleWithReact(): void
  getCallBackAll(): dispatchHandleWithReactTypes<A, L>
}
