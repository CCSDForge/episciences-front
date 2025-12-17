export enum HOMEPAGE_BLOCK {
  LATEST_ARTICLES_CAROUSEL = 'latest-articles-carousel',
  LATEST_NEWS_CAROUSEL = 'latest-news-carousel',
  MEMBERS_CAROUSEL = 'members-carousel',
  STATS = 'stats',
  JOURNAL_INDEXATION = 'journal-indexation',
  SPECIAL_ISSUES = 'special-issues',
  LATEST_ACCEPTED_ARTICLES_CAROUSEL = 'latest-accepted-articles-carousel',
}

export const blocksConfiguration = (): {
  key: HOMEPAGE_BLOCK;
  render: boolean;
}[] => [
  {
    key: HOMEPAGE_BLOCK.LATEST_ARTICLES_CAROUSEL,
    render:
      import.meta.env.VITE_JOURNAL_HOMEPAGE_LATEST_ARTICLES_CAROUSEL_RENDER !==
      'false',
  },
  {
    key: HOMEPAGE_BLOCK.LATEST_NEWS_CAROUSEL,
    render:
      import.meta.env.VITE_JOURNAL_HOMEPAGE_LATEST_NEWS_CAROUSEL_RENDER !==
      'false',
  },
  {
    key: HOMEPAGE_BLOCK.MEMBERS_CAROUSEL,
    render:
      import.meta.env.VITE_JOURNAL_HOMEPAGE_MEMBERS_CAROUSEL_RENDER !== 'false',
  },
  {
    key: HOMEPAGE_BLOCK.STATS,
    render: import.meta.env.VITE_JOURNAL_HOMEPAGE_STATS_RENDER !== 'false',
  },
  {
    key: HOMEPAGE_BLOCK.JOURNAL_INDEXATION,
    render:
      import.meta.env.VITE_JOURNAL_HOMEPAGE_JOURNAL_INDEXATION_RENDER !==
      'false',
  },
  {
    key: HOMEPAGE_BLOCK.SPECIAL_ISSUES,
    render:
      import.meta.env.VITE_JOURNAL_HOMEPAGE_SPECIAL_ISSUES_RENDER !== 'false',
  },
  {
    key: HOMEPAGE_BLOCK.LATEST_ACCEPTED_ARTICLES_CAROUSEL,
    render:
      import.meta.env
        .VITE_JOURNAL_HOMEPAGE_LATEST_ACCEPTED_ARTICLES_CAROUSEL_RENDER !==
      'false',
  },
];

export enum HOMEPAGE_LAST_INFORMATION_BLOCK {
  LAST_NEWS = 'last-news',
  LAST_VOLUME = 'last-volume',
  LAST_SPECIAL_ISSUE = 'last-special-issue',
}

export const lastInformationBlockConfiguration = (): {
  key?: HOMEPAGE_LAST_INFORMATION_BLOCK;
  render: boolean;
} => {
  const renderType: string | null = import.meta.env
    .VITE_JOURNAL_HOMEPAGE_LAST_INFORMATION_RENDER_TYPE;

  if (!renderType) {
    return {
      render: false,
    };
  }

  if (renderType === HOMEPAGE_LAST_INFORMATION_BLOCK.LAST_NEWS) {
    return {
      key: HOMEPAGE_LAST_INFORMATION_BLOCK.LAST_NEWS,
      render: true,
    };
  }

  if (renderType === HOMEPAGE_LAST_INFORMATION_BLOCK.LAST_VOLUME) {
    return {
      key: HOMEPAGE_LAST_INFORMATION_BLOCK.LAST_VOLUME,
      render: true,
    };
  }

  if (renderType === HOMEPAGE_LAST_INFORMATION_BLOCK.LAST_SPECIAL_ISSUE) {
    return {
      key: HOMEPAGE_LAST_INFORMATION_BLOCK.LAST_SPECIAL_ISSUE,
      render: true,
    };
  }

  return {
    render: false,
  };
};
