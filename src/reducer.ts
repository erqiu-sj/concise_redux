import { Dispatch, Reducer, bindActionCreators, ActionCreator } from './index'
import { Action } from './types/actions'

type Partial<T> = {
  [P in keyof T]?: T[P]
}

type stateHandlerType<S, A> = (state: S) => A
export class CreateReducer<S, A, L extends string> {
  private reducerObj: object
  private state: S
  private dispatch: Dispatch<Action & A> | undefined
  private actionList: string[]
  constructor(state: S) {
    this.state = state
    this.reducerObj = {}
    this.actionList = []
  }

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
  finish(): Reducer<S, Action & A> {
    const ret = (State: S = this.state, action: Action & A, dispatch?: Dispatch<Action & A>) => {
      dispatch && this.setDispatch(dispatch)
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
}