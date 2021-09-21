import { AnyAction, Action } from './types/actions'
import { ActionFromReducersMapObject, Reducer, ReducersMapObject, StateFromReducersMapObject } from './types/reducers'
import { CombinedState, Dispatch } from './types/store'

import ActionTypes from './utils/actionTypes'
import isPlainObject from './utils/isPlainObject'
import warning from './utils/warning'
import { kindOf } from './utils/kindOf'

function getUnexpectedStateShapeWarningMessage(inputState: object, reducers: ReducersMapObject, action: Action, unexpectedKeyCache: { [key: string]: true }) {
  const reducerKeys = Object.keys(reducers)
  // actions的type是内置reducer的action则会生成warning message
  const argumentName = action && action.type === ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer'

  // 没有reducer return warning
  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.'
  }

  if (!isPlainObject(inputState)) {
    return `The ${argumentName} has unexpected type of "${kindOf(inputState)}". Expected argument to be an object with the following ` + `keys: "${reducerKeys.join('", "')}"`
  }

  const unexpectedKeys = Object.keys(inputState).filter(key => !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key])

  unexpectedKeys.forEach(key => {
    unexpectedKeyCache[key] = true
  })

  if (action && action.type === ActionTypes.REPLACE) return

  if (unexpectedKeys.length > 0) {
    return (
      `Unexpected ${unexpectedKeys.length > 1 ? 'keys' : 'key'} ` +
      `"${unexpectedKeys.join('", "')}" found in ${argumentName}. ` +
      `Expected to find one of the known reducer keys instead: ` +
      `"${reducerKeys.join('", "')}". Unexpected keys will be ignored.`
    )
  }
}

function assertReducerShape(reducers: ReducersMapObject) {
  Object.keys(reducers).forEach(key => {
    // 获取每个reducer
    const reducer = reducers[key]
    // 将每个reducer的state赋值为当前reducer的默认state，并且type为一个redux内部的随机数
    const initialState = reducer(undefined, { type: ActionTypes.INIT })

    // 每个reducer的默认返回值不能为空,可用null代替而不能为undefined
    if (typeof initialState === 'undefined') {
      throw new Error(
        `The slice reducer for key "${key}" returned undefined during initialization. ` +
          `If the state passed to the reducer is undefined, you must ` +
          `explicitly return the initial state. The initial state may ` +
          `not be undefined. If you don't want to set a value for this reducer, ` +
          `you can use null instead of undefined.`
      )
    }
    // 再次测试
    // if (
    //   typeof reducer(undefined, {
    //     type: ActionTypes.PROBE_UNKNOWN_ACTION(),
    //   }) === 'undefined'
    // ) {
    //   throw new Error(
    //     `The slice reducer for key "${key}" returned undefined when probed with a random type. ` +
    //       `Don't try to handle '${ActionTypes.INIT}' or other actions in "redux/*" ` +
    //       `namespace. They are considered private. Instead, you must return the ` +
    //       `current state for any unknown actions, unless it is undefined, ` +
    //       `in which case you must return the initial state, regardless of the ` +
    //       `action type. The initial state may not be undefined, but can be null.`
    //   )
    // }
  })
}

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @template S Combined state object type.
 *
 * @param reducers An object whose values correspond to different reducer
 *   functions that need to be combined into one. One handy way to obtain it
 *   is to use ES6 `import * as reducers` syntax. The reducers may never
 *   return undefined for any action. Instead, they should return their
 *   initial state if the state passed to them was undefined, and the current
 *   state for any unrecognized action.
 *
 * @returns A reducer function that invokes every reducer inside the passed
 *   object, and builds a state object with the same shape.
 */
/**
 * 将一个对象的值是不同的reducer函数，变成一个单一的
 * 减速机功能。 它将调用每个子reducer，并收集他们的结果
 * 进入单个状态对象，其键对应于传递的键
 * 减速机功能。
 *
 * @param {Object} reducers 一个值对应不同的对象
 * 需要合二为一的reducer函数。 一种便捷的获取方式
 * 是使用 ES6 `import * as reducers` 语法。 减速器可能永远不会返回
 * 未定义任何操作。 相反，他们应该返回他们的初始状态
 * 如果传递给它们的状态是未定义的，并且任何状态的当前状态
 * 无法识别的动作。
 *
 * @returns {Function} 一个 reducer 函数，它调用内部的每个 reducer
 * 传递对象，并构建具有相同形状的状态对象。
 */

export default function combineReducers<S>(reducers: ReducersMapObject<S, any>): Reducer<CombinedState<S>>
export default function combineReducers<S, A extends Action = AnyAction>(reducers: ReducersMapObject<S, A>): Reducer<CombinedState<S>, A>
export default function combineReducers<M extends ReducersMapObject>(reducers: M): Reducer<CombinedState<StateFromReducersMapObject<M>>, ActionFromReducersMapObject<M>>
export default function combineReducers(reducers: ReducersMapObject) {
  // 获取所有reducer的key
  const reducerKeys = Object.keys(reducers)
  // 存放合法的reducer
  const finalReducers: ReducersMapObject = {}
  for (let i = 0; i < reducerKeys.length; i++) {
    // 循环获取每个reducer的key
    const key = reducerKeys[i]
    // 开发阶段如果reducer的某个key是空则直接报错
    if (process.env.NODE_ENV !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        warning(`No reducer provided for key "${key}"`)
      }
    }
    // 判断传入的reducer是否是一个函数，是则放入真正的reducer list
    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  }

  // 获取合法的reducer key
  const finalReducerKeys = Object.keys(finalReducers)
  // This is used to make sure we don't warn about the same
  // keys multiple times.
  // 这用于确保我们不会警告相同的key多次。
  let unexpectedKeyCache: { [key: string]: true }
  if (process.env.NODE_ENV !== 'production') {
    unexpectedKeyCache = {}
  }

  let shapeAssertionError: Error
  try {
    // TODO: 每个reducer都会断言两次，能否只断言一次？
    // 断言reducer,主要判断reducer的默认返回值，不能为undefine至少应该是一个null，未undefine时保存，由catch捕获
    assertReducerShape(finalReducers)
  } catch (e) {
    // @ts-ignore
    shapeAssertionError = e
  }
  // 是否是第一次初始化
  let mount = true
  // 初始化时 会出发一次该函数
  // 之后就是每一次dispatch会触发
  return function combination(
    //  一定 state === undefined
    state: StateFromReducersMapObject<typeof reducers> = {},
    // actions
    action: AnyAction,
    dispatch?: any
  ) {
    // 断言是否出错
    if (shapeAssertionError) {
      throw shapeAssertionError
    }

    if (process.env.NODE_ENV !== 'production') {
      // 开发阶段
      const warningMessage = getUnexpectedStateShapeWarningMessage(
        // === undefine === {}
        state,
        finalReducers,
        action,
        unexpectedKeyCache
      )
      if (warningMessage) {
        warning(warningMessage)
      }
    }

    let hasChanged = false
    // 下一次的state, 初始化时候是在此处定义所有reducer的默认值 key === reducer.key
    const nextState: StateFromReducersMapObject<typeof reducers> = {}
    // TODO: 除了第一次初始化，都不应该循环再次调用reducer ，maybe?
    for (let i = 0; i < finalReducerKeys.length; i++) {
      // 获取每个reducer的key
      const key = finalReducerKeys[i]
      // 在reducerlist中找出对应的reducer handler
      const reducer = finalReducers[key]
      // 找出该reducer对应的state
      const previousStateForKey = state[key]
      // @ts-ignore
      console.log(reducer.prototype.getActionList)
      // 带上该state 调用reducer
      const nextStateForKey = reducer(previousStateForKey, action, dispatch)
      // 再次判断reducer的返回值
      if (typeof nextStateForKey === 'undefined') {
        const actionType = action && action.type
        throw new Error(
          `When called with an action of type ${actionType ? `"${String(actionType)}"` : '(unknown type)'}, the slice reducer for key "${key}" returned undefined. ` +
            `To ignore an action, you must explicitly return the previous state. ` +
            `If you want this reducer to hold no value, you can return null instead of undefined.`
        )
      }
      // 初始化对应reducer的value
      nextState[key] = nextStateForKey
      // 通过判断当前reducer的返回值是否等于传入的state判断是否change
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }
    hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length
    // 是否change，没有change则直接返回state
    return hasChanged ? nextState : state
  }
}
