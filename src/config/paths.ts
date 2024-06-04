export const PATHS = {
  home: '/',
  boards: '/boards',
  search: '/search',
  articles: 'browse/latest',
  authors: '/authors',
  volumes: '/volumes',
  volumeDetails: '/volumes/:id',
  sections: '/sections',
  about: '/about',
  news: '/news',
  statistics: '/statistics',
  forAuthors: '/for-authors'
}

export type PathKeys = keyof typeof PATHS;