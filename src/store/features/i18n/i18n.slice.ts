import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { II18nState } from './i18n.type'

const i18nSlice = createSlice({
  name: 'i18n',
  initialState: {
    language: import.meta.env.VITE_DEFAULT_LANGUAGE
  } as II18nState,
  reducers: {
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
    },
  }
})

export const { setLanguage } = i18nSlice.actions

export default i18nSlice.reducer
