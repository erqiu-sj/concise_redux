import { Action } from '../types/actions'
import { Partial } from '../reducer'

export type addActionParamsHandler<S, A> = (staet: S, action: Partial<Action & A>) => S
