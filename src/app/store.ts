import { configureStore, getDefaultMiddleware, Action } from '@reduxjs/toolkit'
import { ThunkAction } from 'redux-thunk'
import { initAction } from '@reatom/core'

import { reactionsMiddleware } from 'utils/store'
import rootReducer, { RootState } from './rootReducer'

const store = configureStore({
  reducer: rootReducer,
  middleware: [reactionsMiddleware, ...getDefaultMiddleware()]
})

store.dispatch(initAction)

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./rootReducer', () => {
    const newRootReducer = require('./rootReducer').default
    store.replaceReducer(newRootReducer)
    store.dispatch(initAction)
  })
}

export type AppDispatch = typeof store.dispatch

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>

export default store
