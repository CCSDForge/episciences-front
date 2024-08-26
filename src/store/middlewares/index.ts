import { aboutApi } from '../features/about/about.query'
import { articleApi } from '../features/article/article.query'
import { authorApi } from '../features/author/author.query'
import { boardApi } from '../features/board/board.query'
import { creditsApi } from '../features/credits/credits.query'
import { forAuthorApi } from '../features/forAuthor/forAuthor.query'
import { indexationApi } from '../features/indexation/indexation.query'
import { journalApi } from '../features/journal/journal.query'
import { newsApi } from '../features/news/news.query'
import { searchApi } from '../features/search/search.query'
import { sectionApi } from '../features/section/section.query'
import { statApi } from '../features/stat/stat.query'
import { volumeApi } from '../features/volume/volume.query'

// eslint-disable-next-line @typescript-eslint/ban-types
export const enhancedMiddleware = (getDefaultMiddleware: Function) => getDefaultMiddleware({ serializableCheck: false })
  .concat(aboutApi.middleware)
  .concat(articleApi.middleware)
  .concat(authorApi.middleware)
  .concat(boardApi.middleware)
  .concat(creditsApi.middleware)
  .concat(forAuthorApi.middleware)
  .concat(indexationApi.middleware)
  .concat(journalApi.middleware)
  .concat(newsApi.middleware)
  .concat(searchApi.middleware)
  .concat(sectionApi.middleware)
  .concat(statApi.middleware)
  .concat(volumeApi.middleware)