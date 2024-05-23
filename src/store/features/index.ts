import { combineReducers } from 'redux'

import aboutReducer from './about/about.slice'
import i18nReducer from './i18n/i18n.slice'
import searchReducer from './search/search.slice'
import sectionReducer from './section/section.slice'
import volumeReducer from './volume/volume.slice'
import { aboutApi } from './about/about.query'
import { sectionApi } from './section/section.query'
import { volumeApi } from './volume/volume.query'

const createRootReducer = combineReducers({
  // Slices
  aboutReducer,
  i18nReducer,
  searchReducer,
  sectionReducer,
  volumeReducer,
  // RTK Query's
  [aboutApi.reducerPath]: aboutApi.reducer,
  [sectionApi.reducerPath]: sectionApi.reducer,
  [volumeApi.reducerPath]: volumeApi.reducer
})

export default createRootReducer