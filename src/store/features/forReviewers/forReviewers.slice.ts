import { createSlice } from '@reduxjs/toolkit'

import { forReviewersApi } from './forReviewers.query'
import { IForReviewersState } from './forReviewers.type'

const forReviewersSlice = createSlice({
  name: 'forReviewers',
  initialState: {} as IForReviewersState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      forReviewersApi.endpoints.fetchForReviewersPage.matchFulfilled,
      (state, { payload }) => {
        state.forReviewers = payload
      },
    )
  }
})

export default forReviewersSlice.reducer