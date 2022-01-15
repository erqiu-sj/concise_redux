import { Dispatch, Reducer, bindActionCreators } from './index'
import { Action } from './types/actions'

export type Partial<T> = {
  [P in keyof T]?: T[P]
}

export type getAllValsWithActionCollectionHelper<T> = T extends { [key in string]: infer K } ? K : never

export type addActionParamsHandler<S, A> = (staet: S, action: Partial<Action & A>) => S

type stateHandlerType<S, A> = (state: S) => A

type reducerObjTypes<S, A> = {
  [k: string]: (state: S, action: A) => S
}

type dispatchHandler<A> = (action: A) => A
type dispatchHandleWithReactTypes<A, L extends string> = {
  [k in L]: dispatchHandler<A>
}
export class CreateReducer<S, A, L extends string> {
  private reducerObj: reducerObjTypes<S, A>
  private dispatchHandleWithReact: dispatchHandleWithReactTypes<A, L>
  private state: S
  private dispatch: Dispatch<Action & A> | undefined
  private getState: (() => S) | undefined
  private actionList: L[]
  private reducerKey: string | undefined
  constructor(state: S) {
    this.state = state
    this.reducerObj = {}
    this.actionList = []
    this.dispatchHandleWithReact = {} as dispatchHandleWithReactTypes<A, L>
  }

  addAction(action: L, handler: addActionParamsHandler<S, A>): this {
    if (Reflect.has(this.reducerObj, action)) throw new Error('The action exists')
    this.actionList.push(action)
    Reflect.set(this.reducerObj, action, handler)
    this.addDispatchHandleWithReact(action)
    return this
  }

  private addDispatchHandleWithReact(action: L) {
    Reflect.set(this.dispatchHandleWithReact, action, (actionType: A) => {
      return { type: action, ...actionType }
    })
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
  /**
   * @description 返回一个reducer 用于注册
   * @returns 
   */
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
  /**
   * @description 更新函数
   * @param actions 
   * @param states 
   */
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
  /**
   * @description 获取redux中对应reducer的值，前提需要调用setReducerKey指定reducer的key
   * @returns 
   */
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

  getCallBackAll(): dispatchHandleWithReactTypes<A, L> {
    return this.dispatchHandleWithReact
  }
}
