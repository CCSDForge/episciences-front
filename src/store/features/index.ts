import { combineReducers } from 'redux'

import aboutReducer from './about/about.slice'
import boardReducer from './board/board.slice'
import i18nReducer from './i18n/i18n.slice'
import journalReducer from './journal/journal.slice'
import searchReducer from './search/search.slice'
import sectionReducer from './section/section.slice'
import volumeReducer from './volume/volume.slice'
import { aboutApi } from './about/about.query'
import { boardApi } from './board/board.query'
import { journalApi } from './journal/journal.query'
import { sectionApi } from './section/section.query'
import { volumeApi } from './volume/volume.query'

const createRootReducer = combineReducers({
  // Slices
  aboutReducer,
  boardReducer,
  i18nReducer,
  journalReducer,
  searchReducer,
  sectionReducer,
  volumeReducer,
  // RTK Query's
  [aboutApi.reducerPath]: aboutApi.reducer,
  [boardApi.reducerPath]: boardApi.reducer,
  [journalApi.reducerPath]: journalApi.reducer,
  [sectionApi.reducerPath]: sectionApi.reducer,
  [volumeApi.reducerPath]: volumeApi.reducer
})

export default createRootReducer