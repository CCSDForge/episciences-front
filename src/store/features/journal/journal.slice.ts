import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { IJournal } from '../../../types/journal'
import { journalApi } from './journal.query'
import { IJournalState } from './journal.type'

const journalSlice = createSlice({
  name: 'journal',
  initialState: {
    journals: [],
  } as IJournalState,
  reducers: {
    setCurrentJournal(state, action: PayloadAction<IJournal>) {
      state.currentJournal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      journalApi.endpoints.fetchJournals.matchFulfilled,
      (state, { payload }) => {
        state.journals = payload
      },
    )
  }
})

export const { setCurrentJournal } = journalSlice.actions

export default journalSlice.reducer
