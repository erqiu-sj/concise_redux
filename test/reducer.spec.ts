import { combineReducers, CreateReducer, createStore, getAllValsWithActionCollectionHepler } from '../src'

type countInStoreTypes = {
  name?: string
  age?: number
}

type storeResult = {
  count: countInStoreTypes
}
const action = {
  RESET_NAME: 'resetName',
  RESET_AGE: "resetAge",
  RESET: 'reset'
}

type actionTypes = getAllValsWithActionCollectionHepler<typeof action>
type State = {
  name: string; age: number
}

type actionPayload = {
  resetName?: string; resetAge?: number
}
const count = new CreateReducer<State, actionPayload, actionTypes>({ name: 'qsj', age: 19 })
  .addAction('reset', () => {
    return { name: 'qsj', age: 19 }
  })
  .addAction('resetName', (state, action) => {
    return { ...state, name: action?.resetName || '' }
  })
  .addAction('resetAge', (state, action) => {
    return { ...state, age: action?.resetAge || 18 }
  })
  .setReducerKey('count')
const finish = count.finish()

const multiplication = new CreateReducer({ name: 'multiplication ' })
const store = createStore(
  combineReducers({
    count: finish,
    multiplication: multiplication.finish(),
  })
)

afterAll(() => {
  count.dispatcher('reset')
})

it('init', () => {
  expect(JSON.stringify(store.getState())).toBe(
    JSON.stringify({
      count: { name: 'qsj', age: 19 },
      multiplication: { name: 'multiplication ' },
    } as storeResult)
  )
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

it('getCurState', () => {
  expect(count.getCurState()).toStrictEqual({ name: 'awesome', age: 19 })
})

it('getCallBackAll Return value', () => {
  expect(
    count.getCallBackAll()
  ).toBeInstanceOf(Object)

  expect(
    count.getCallBackAll().resetAge({ resetName: 'haha' })
  ).toStrictEqual({ type: 'resetAge', resetName: 'haha' })
})


