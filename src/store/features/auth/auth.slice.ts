import { createSlice } from '@reduxjs/toolkit'

import { authApi } from './auth.query'
import { IAuthState } from './auth.type'

const authSlice = createSlice({
  name: 'auth',
  initialState: {} as IAuthState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.data.token
      },
    )
  }
})

export default authSlice.reducer
