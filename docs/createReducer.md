## CreateReducer

```ts
import { CreateReducer } from '@zealforchange/conciseredux'

//  new CreateReducer<State,Action,ActionType>
const count = new CreateReducer<{ name: string; age: number }, { resetName: string; resetAge: number }, 'resetName' | 'resetAge' | 'reset'>({ name: 'qsj', age: 19 })
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
