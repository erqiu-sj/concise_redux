import type { InitialOptionsTsJest } from 'ts-jest/dist/types'
import { defaults as tsjPrese } from 'ts-jest/presets'

const config: InitialOptionsTsJest = {
  transform: {
    ...tsjPrese.transform,
  },
  globals: {
    'ts-jest': {},
  },
}

export default config
