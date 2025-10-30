import { createSlice } from '@reduxjs/toolkit'

import { acknowledgmentsApi } from './acknowledgments.query'
import { IAcknowledgmentsState } from './acknowledgments.type'

const acknowledgmentsSlice = createSlice({
  name: 'acknowledgments',
  initialState: {} as IAcknowledgmentsState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      acknowledgmentsApi.endpoints.fetchAcknowledgmentsPage.matchFulfilled,
      (state, { payload }) => {
        state.acknowledgments = payload
      },
    )
  }
})

export default acknowledgmentsSlice.reducer