import { aboutApi } from '../features/about/about.query'
import { articleApi } from '../features/article/article.query'
import { boardApi } from '../features/board/board.query'
import { creditsApi } from '../features/credits/credits.query'
import { forAuthorApi } from '../features/forAuthor/forAuthor.query'
import { journalApi } from '../features/journal/journal.query'
import { newsApi } from '../features/news/news.query'
import { sectionApi } from '../features/section/section.query'
import { volumeApi } from '../features/volume/volume.query'

// eslint-disable-next-line @typescript-eslint/ban-types
export const enhancedMiddleware = (getDefaultMiddleware: Function) => getDefaultMiddleware()
  .concat(aboutApi.middleware)
  .concat(articleApi.middleware)
  .concat(boardApi.middleware)
  .concat(creditsApi.middleware)
  .concat(forAuthorApi.middleware)
  .concat(journalApi.middleware)
  .concat(newsApi.middleware)
  .concat(sectionApi.middleware)
  .concat(volumeApi.middleware)