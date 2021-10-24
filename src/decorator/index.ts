import { createReducer } from './reducer'
import { actionHanlder } from './actionHandler'

class A {
  static Adds() {}
}
@createReducer()
//@ts-ignore
class R extends A {
  @actionHanlder('add')
  // @ts-ignore
  private static hadnler() {}
}
