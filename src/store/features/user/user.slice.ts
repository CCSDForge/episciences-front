import { createSlice } from '@reduxjs/toolkit'

import { userApi } from './user.query'
import { IUserState } from './user.type'

const userSlice = createSlice({
  name: 'user',
  initialState: {} as IUserState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      userApi.endpoints.fetchProfile.matchFulfilled,
      (state, { payload }) => {
        state.user = payload
      },
    )
  }
})

export default userSlice.reducer
