import { IStat } from "../types/stat"
import { AvailableLanguage } from "../utils/i18n"

export enum HOMEPAGE_BLOCK {
  LAST_NEWS = 'last-news',
  LATEST_ARTICLES_CAROUSEL = 'latest-articles-carousel',
  LATEST_NEWS_CAROUSEL = 'latest-news-carousel',
  MEMBERS_CAROUSEL = 'members-carousel',
  STATS = 'stats',
  JOURNAL_INDEXATION = 'journal-indexation',
  SPECIAL_ISSUES = 'special-issues'
}


export const blocksConfiguration = (): { key: HOMEPAGE_BLOCK, render: boolean, stats?: Record<AvailableLanguage, IStat[]> }[] => [
  {
    key: HOMEPAGE_BLOCK.LAST_NEWS,
    render: true
  },
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
    render: true,
    stats: {
      'en': [
        { stat: '62.07%', title: 'Acceptance rate' },
        { stat: '29', title: 'Published articles' },
        { stat: '2 weeks', title: 'Submission-publication time' }
      ],
      'fr': [
        { stat: '62.07%', title: "Taux d'acceptation" },
        { stat: '29', title: 'Articles publiés' },
        { stat: '2 semaines', title: 'Délai de soumission et de publication' }
      ]
    }
  },
  {
    key: HOMEPAGE_BLOCK.JOURNAL_INDEXATION,
    render: true
  },
  {
    key: HOMEPAGE_BLOCK.SPECIAL_ISSUES,
    render: true
  }
]