## CreateReducer with redux

```ts
// constant.ts
export const RESET_NAME = 'resetName'
export const RESET_AGE = 'resetAge'
export const RESET = 'reset'
```

```ts
import { CreateReducer , getAllValsWithActionCollectionHelper } from '@zealforchange/conciseredux'
import * as actions from './constant'
// or
/**
 * const h = {
 *  RESET_NAME: 'resetName',
 *  RESET_AGE: 'resetAge',
 *  RESET: 'reset'
 * }
 * type actionTypes =  getAllValsWithActionCollectionHelper<typeof h> // reset | resetAge | resetName
 *
 */


type actionTypes =  getAllValsWithActionCollectionHelper<typeof actions> // reset | resetAge | resetName
type State =  { name: string; age: number }
type actionPayloadTypes = { resetName: string; resetAge: number }
//  new CreateReducer<State,Action,ActionType>
const count = new CreateReducer<State, actionPayloadTypes, actionTypes>({ name: 'qsj', age: 19 })
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

// There will be the type hints you want!
count.dispatcher('resetName', { resetName: 'awesome' })

console.log(store.getState()) // { count: { name: "awesome", age: 19 } }
console.log(count.getCurState()) // { name: "awesome", age: 19 }
```
