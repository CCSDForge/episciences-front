import { createSlice } from '@reduxjs/toolkit'

import { acknowledgementsApi } from './acknowledgements.query'
import { IAcknowledgementsState } from './acknowledgements.type'

const acknowledgementsSlice = createSlice({
  name: 'acknowledgements',
  initialState: {} as IAcknowledgementsState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      acknowledgementsApi.endpoints.fetchAcknowledgementsPage.matchFulfilled,
      (state, { payload }) => {
        state.acknowledgements = payload
      },
    )
  }
})

export default acknowledgementsSlice.reducer