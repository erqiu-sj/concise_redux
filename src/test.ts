import { combineReducers, createStore, CreateReducer } from './index'
const count = new CreateReducer(1)
  .addAction('add', () => {
    return 2
  })
  .addAction('addtwo', () => {
    return 3
  })

const red = new CreateReducer(2).addAction('remove', () => {
  return 1
})
const store = createStore(combineReducers({ count: count.finish(), red: red.finish() }))

count.dispatcher('add')
