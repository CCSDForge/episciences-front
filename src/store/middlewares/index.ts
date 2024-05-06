import { authApi } from '../features/auth/auth.query'
import { userApi } from '../features/user/user.query'

// eslint-disable-next-line @typescript-eslint/ban-types
export const enhancedMiddleware = (getDefaultMiddleware: Function) => getDefaultMiddleware()
  .concat(authApi.middleware)
  .concat(userApi.middleware)