# CreateReducer with react

## create constant

```ts
// constant.ts
export const RESET_NAME = 'resetName'
export const RESET_AGE = 'resetAge'
export const RESET = 'reset'
```

## create reducer

```ts
// store.ts
import { CreateReducer , getAllValsWithActionCollectionHepler } from '@zealforchange/conciseredux'
import * as actions from './constant'
// or
/**
 * const h = {
 *  RESET_NAME: 'resetName',
 *  RESET_AGE: 'resetAge',
 *  RESET: 'reset'
 * }
 * type actionTypes =  getAllValsWithActionCollectionHepler<typeof h> // reset | resetAge | resetName
 *
 */
type actionTypes =  getAllValsWithActionCollectionHepler<typeof actions> // reset | resetAge | resetName
export type State =  { name: string; age: number }
type actionPayloadTypes = { resetName: string; resetAge: number }
//  new CreateReducer<State,Action,ActionType>
export const count = new CreateReducer<State, actionPayloadTypes, actionTypes>({ name: 'qsj', age: 19 })
  .addAction('reset', () => {
    return { name: 'qsj', age: 19 }
  })
  .addAction('resetName', (state, action) => {
    return { ...state, name: action?.resetName || 'name' }
  })
  .addAction('resetAge', (state, action) => {
    return { ...state, age: action?.resetAge || 18 }
  }
  // Find out the value that can be count in state! wow! awesome!
  .setReducerKey('count')

const store = createStore(
  combineReducers({
    // Don't forget to finish every instance
    count: count.finish(),
  })
)
console.log(store.getState()) // { count: { name: "qsj", age: 19 } }
```

## package hooks

```ts
// useCount.ts
import { useDispatch, useSelector } from 'react-redux'
import { count, State } from './store.ts'
import { getAllValsWithActionCollectionHepler, bindActionCreators } from '@zealforchange/conciseredux'
export function useCount() {
  const dispatcher = bindActionCreators(count.getCallBackAll(), useDispatch())
  const curStateForRedux = count.getCurState()
  const curState = useSelector((state: { count: State }) => {
    return state.count
  })
  return [dispatcher, curState, curStateForRedux]
}
```

## Use in components

```tsx
import { FC , useEffect } from 'react'
import { useCount } from './useCount'
type Props = {}
const CountCpm: FC<Props> = () => {
    const [dispatch,curState] = useCount()
    useEffect(() => {
     dispatch.resetAge({ resetAge: 12 })
    },[])
    // The initial value is 19, but the page will be rendered as 12 after useEffect is updated
    return <>{curState.age}<>
}
```
