import { combineReducers, CreateReducer, createStore } from '../src'
type countInStoreTypes = {
  name?: string
  age?: number
}
type storeResult = {
  count: countInStoreTypes
}

const count = new CreateReducer<{ name: string; age: number }, { resetName: string; resetAge: number }, 'resetName' | 'resetAge' | 'reset'>({ name: 'qsj', age: 19 })
  .addAction('reset', () => {
    return { name: 'qsj', age: 19 }
  })
  .addAction('resetName', (state, action) => {
    return { ...state, name: action?.resetName || '' }
  })
  .addAction('resetAge', (state, action) => {
    return { ...state, age: action?.resetAge || 18 }
  })
const store = createStore(
  combineReducers({
    count: count.finish(),
  })
)

afterAll(() => {
  count.dispatcher('reset')
})

it('init', () => {
  expect(JSON.stringify(store.getState())).toBe(JSON.stringify({ count: { name: 'qsj', age: 19 } } as storeResult))
})

it('resetName', () => {
  count.dispatcher('resetName', { resetName: 'awesome' })
  const storeResult: storeResult = store.getState()

  expect(storeResult.count).toStrictEqual(
    expect.objectContaining({
      name: 'awesome',
    } as countInStoreTypes)
  )
})
