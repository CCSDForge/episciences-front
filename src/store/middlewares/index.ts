import { aboutApi } from '../features/about/about.query'
import { journalApi } from '../features/journal/journal.query'
import { sectionApi } from '../features/section/section.query'
import { volumeApi } from '../features/volume/volume.query'

// eslint-disable-next-line @typescript-eslint/ban-types
export const enhancedMiddleware = (getDefaultMiddleware: Function) => getDefaultMiddleware()
  .concat(aboutApi.middleware)
  .concat(journalApi.middleware)
  .concat(sectionApi.middleware)
  .concat(volumeApi.middleware)