import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { ISearchState } from './search.type'

const searchSlice = createSlice({
  name: 'search',
  initialState: {} as ISearchState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
  }
})

export const { setSearch } = searchSlice.actions

export default searchSlice.reducer
