export enum HOMEPAGE_BLOCK {
  LATEST_ARTICLES_CAROUSEL = 'latest-articles-carousel',
  LATEST_NEWS_CAROUSEL = 'latest-news-carousel',
  MEMBERS_CAROUSEL = 'members-carousel',
  STATS = 'stats',
  JOURNAL_INDEXATION = 'journal-indexation',
  SPECIAL_ISSUES = 'special-issues',
  LATEST_ACCEPTED_ARTICLES_CAROUSEL = 'latest-accepted-articles-carousel',
}

export enum HOMEPAGE_LAST_INFORMATION_BLOCK {
  LAST_NEWS = 'last-news',
  LAST_VOLUME = 'last-volume',
  LAST_SPECIAL_ISSUE = 'last-special-issue'
}

export const blocksConfiguration = (): { key: HOMEPAGE_BLOCK, render: boolean }[] => [
  {
    key: HOMEPAGE_BLOCK.LATEST_ARTICLES_CAROUSEL,
    render: true
  },
  {
    key: HOMEPAGE_BLOCK.LATEST_NEWS_CAROUSEL,
    render: true
  },
  {
    key: HOMEPAGE_BLOCK.MEMBERS_CAROUSEL,
    render: true
  },
  {
    key: HOMEPAGE_BLOCK.STATS,
    render: true
  },
  {
    key: HOMEPAGE_BLOCK.JOURNAL_INDEXATION,
    render: true
  },
  {
    key: HOMEPAGE_BLOCK.SPECIAL_ISSUES,
    render: true
  },
  {
    key: HOMEPAGE_BLOCK.LATEST_ACCEPTED_ARTICLES_CAROUSEL,
    render: true
  }
]

export const lastInformationBlockConfiguration = (): { key: HOMEPAGE_LAST_INFORMATION_BLOCK, render: boolean } => {
  return {
    key: HOMEPAGE_LAST_INFORMATION_BLOCK.LAST_NEWS,
    render: true
  }
} 