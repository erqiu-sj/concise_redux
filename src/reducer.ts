import { Dispatch, Reducer, bindActionCreators } from './index'
import { Action } from './types/actions'

export type Partial<T> = {
  [P in keyof T]?: T[P]
}

type stateHandlerType<S, A> = (state: S) => A
export class CreateReducer<S, A, L extends string> {
  private reducerObj: object
  private state: S
  private dispatch: Dispatch<Action & A> | undefined
  private getState: (() => S) | undefined
  private actionList: string[]
  private reducerKey: string | undefined
  constructor(state: S) {
    this.state = state
    this.reducerObj = {}
    this.actionList = []
  }

  // addAction(action: L, handler: (state: S, action: Partial<Action & A>) => S): this {
  addAction(action: L, handler: (state: S, action: Partial<Action & A>) => S): this {
    if (Reflect.has(this.reducerObj, action)) throw new Error('The action exists')
    this.actionList.push(action)
    Reflect.set(this.reducerObj, action, handler)
    return this
  }
  getActionList() {
    return this.actionList
  }
  private setDispatch(dispatch: Dispatch<Action & A>) {
    this.dispatch = dispatch
  }
  private setGetState(getState: () => S) {
    this.getState = getState
  }
  setReducerKey(key: string): this {
    this.reducerKey = key
    return this
  }
  finish(): Reducer<S, Action & A> {
    const ret = (State: S = this.state, action: Action & A, dispatch?: Dispatch<Action & A>, getState?: () => S) => {
      dispatch && this.setDispatch(dispatch)
      getState && this.setGetState(getState)
      const fn = Reflect.get(this.reducerObj, action.type)
      if (typeof fn === 'function') return fn.call(null, State, action)
      return State
    }
    ret.prototype.getActionList = this.getActionList()
    return ret
  }
  dispatcher(actions: L, states?: Partial<A> | stateHandlerType<S, Partial<A>>): void {
    if (!this.dispatch) {
      throw new Error('dispatch does not exist')
    }
    if (!Reflect.has(this.reducerObj, actions)) {
      throw new Error(`Did you add the ${actions} action?`)
    }
    let stateHandler: undefined | A
    if (typeof states === 'function')
      // @ts-ignore
      stateHandler = states(this.state)
    // @ts-ignore
    else stateHandler = states
    bindActionCreators(() => ({ type: actions, ...stateHandler }), this.dispatch as any)()
  }
  getCurState(): S {
    if (!this.getState) return this.state
    // @ts-ignore
    if (this.reducerKey) {
      const state = this.getState()
      if (typeof state !== 'object') return state
      if (Reflect.has(state as unknown as object, this.reducerKey)) {
        // @ts-ignore
        return state[this.reducerKey]
      }
      return state
      // return this.getState()[this.reducerKey]
    }
    return this.getState()
  }
}
