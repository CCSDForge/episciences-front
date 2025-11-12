import { createSlice } from '@reduxjs/toolkit'

import { forConferenceOrganisersApi } from './forConferenceOrganisers.query'
import { IForConferenceOrganisersState } from './forConferenceOrganisers.type'

const forConferenceOrganisersSlice = createSlice({
  name: 'forConferenceOrganisers',
  initialState: {} as IForConferenceOrganisersState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      forConferenceOrganisersApi.endpoints.fetchForConferenceOrganisersPage.matchFulfilled,
      (state, { payload }) => {
        state.forConferenceOrganisers = payload
      },
    )
  }
})

export default forConferenceOrganisersSlice.reducer