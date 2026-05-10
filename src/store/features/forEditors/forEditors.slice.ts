import { createSlice } from '@reduxjs/toolkit';

import { forEditorsApi } from './forEditors.query';
import { IForEditorsState } from './forEditors.type';

const forEditorsSlice = createSlice({
  name: 'forEditors',
  initialState: {} as IForEditorsState,
  reducers: {},
  extraReducers: builder => {
    builder.addMatcher(
      forEditorsApi.endpoints.fetchForEditorsPage.matchFulfilled,
      (state, { payload }) => {
        state.forEditors = payload;
      }
    );
  },
});

export default forEditorsSlice.reducer;
