import { combineReducers } from 'redux'

import i18nReducer from './i18n/i18n.slice'
import searchReducer from './search/search.slice'
import sectionReducer from './section/section.slice'
import volumeReducer from './volume/volume.slice'
import { sectionApi } from './section/section.query'
import { volumeApi } from './volume/volume.query'

const createRootReducer = combineReducers({
  // Slices
  i18nReducer,
  searchReducer,
  sectionReducer,
  volumeReducer,
  // RTK Query's
  [sectionApi.reducerPath]: sectionApi.reducer,
  [volumeApi.reducerPath]: volumeApi.reducer
})

export default createRootReducer