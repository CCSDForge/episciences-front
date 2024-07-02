import { persistReducer, persistStore } from 'redux-persist'
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import rootReducer, { RootReducer } from './features'
import { enhancedMiddleware } from './middlewares'
import { persistConfig } from './middlewares/persist'

const store = configureStore({
  reducer: persistReducer<RootReducer>(persistConfig, rootReducer),
  middleware: (getDefaultMiddleware) => enhancedMiddleware(getDefaultMiddleware)
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const persistedStore = persistStore(store)

export default store