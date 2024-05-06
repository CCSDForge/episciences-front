import { combineReducers } from 'redux'

import authReducer from './auth/auth.slice'
import userReducer from './user/user.slice'
import { authApi } from './auth/auth.query'
import { userApi } from './user/user.query'

const createRootReducer = combineReducers({
  // Slices
  authReducer,
  userReducer,
  // RTK Query's
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer
})

export default createRootReducer