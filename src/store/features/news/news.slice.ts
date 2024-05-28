import { createSlice } from '@reduxjs/toolkit'

import { newsApi } from './news.query'
import { INewsState } from './news.type'

const newsSlice = createSlice({
  name: 'news',
  initialState: {
    news: []
  } as INewsState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      newsApi.endpoints.fetchNews.matchFulfilled,
      (state, { payload }) => {
        state.news = payload
      },
    )
  }
})

export default newsSlice.reducer
