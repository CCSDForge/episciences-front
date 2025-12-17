import { createSlice } from '@reduxjs/toolkit';

import { authorApi } from './author.query';
import { IAuthorState } from './author.type';

const authorSlice = createSlice({
  name: 'author',
  initialState: {
    authors: {
      data: [],
      totalItems: 0,
    },
  } as IAuthorState,
  reducers: {},
  extraReducers: builder => {
    builder.addMatcher(
      authorApi.endpoints.fetchAuthors.matchFulfilled,
      (state, { payload }) => {
        state.authors = payload;
      }
    );
  },
});

export default authorSlice.reducer;
