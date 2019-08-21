import { combineReducers } from 'redux-starter-kit'

import issuesDisplayReducer from 'features/issuesDisplay/issuesDisplaySlice'

const rootReducer = combineReducers({
  issuesDisplay: issuesDisplayReducer
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
