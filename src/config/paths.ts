export const PATHS = {
  home: '/',
  boards: '/boards',
  search: '/search',
  articles: 'articles',
  articleDetails: '/articles/:id',
  articleDetailsMetadata: '/articles/:id/metadata/:type',
  articleDetailsPreview: '/articles/:id/preview',
  articleDetailsNotice: '/articles/:id/notice',
  articleDetailsDownload: '/articles/:id/download',
  articlesAccepted: 'articles-accepted',
  authors: '/authors',
  volumes: '/volumes',
  volumeDetails: '/volumes/:id',
  sections: '/sections',
  sectionDetails: '/sections/:id',
  about: '/about',
  credits: '/credits',
  news: '/news',
  statistics: '/statistics',
  forAuthors: '/for-authors'
}

export type PathKeys = keyof typeof PATHS;