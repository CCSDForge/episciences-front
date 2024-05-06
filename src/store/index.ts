import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import rootReducer from './features'
import { enhancedMiddleware } from './middlewares'

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => enhancedMiddleware(getDefaultMiddleware)
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store