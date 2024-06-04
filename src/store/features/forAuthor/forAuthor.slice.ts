import { createSlice } from '@reduxjs/toolkit'

import { forAuthorApi } from './forAuthor.query'
import { IForAuthorState } from './forAuthor.type'

const forAuthorSlice = createSlice({
  name: 'forAuthor',
  initialState: {} as IForAuthorState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      forAuthorApi.endpoints.fetchEditorialWorkflowPage.matchFulfilled,
      (state, { payload }) => {
        state.editorialWorkflow = payload
      },
    ),
    builder.addMatcher(
      forAuthorApi.endpoints.fetchEthicalCharterPage.matchFulfilled,
      (state, { payload }) => {
        state.ethicalCharter = payload
      },
    ),
    builder.addMatcher(
      forAuthorApi.endpoints.fetchPrepareSubmissionPage.matchFulfilled,
      (state, { payload }) => {
        state.prepareSubmission = payload
      },
    )
  }
})

export default forAuthorSlice.reducer
