import { PATHS } from '../config/paths';

export enum PUBLISH_SECTION {
  FOR_AUTHORS = 'for-authors',
  FOR_REVIEWERS = 'for-reviewers',
  FOR_CONFERENCE_ORGANISERS = 'for-conference-organisers'
}

export const publishSections = [
  PUBLISH_SECTION.FOR_AUTHORS,
  PUBLISH_SECTION.FOR_REVIEWERS,
  PUBLISH_SECTION.FOR_CONFERENCE_ORGANISERS
]

export interface IPublishSection {
  type: PUBLISH_SECTION;
  path: string;
  translationKey: string;
}

// Define the sort order for publish sections
const getPublishSectionSortOrder = (sectionType: PUBLISH_SECTION): number => {
  const sortOrderMap: Record<PUBLISH_SECTION, number> = {
    [PUBLISH_SECTION.FOR_AUTHORS]: 1,
    [PUBLISH_SECTION.FOR_REVIEWERS]: 2,
    [PUBLISH_SECTION.FOR_CONFERENCE_ORGANISERS]: 3,
  };

  return sortOrderMap[sectionType] ?? 999;
};

export const getPublishSections = (): IPublishSection[] => {
  const sections: IPublishSection[] = [
    {
      type: PUBLISH_SECTION.FOR_AUTHORS,
      path: PATHS.forAuthors,
      translationKey: 'pages.publish.forAuthors'
    },
    {
      type: PUBLISH_SECTION.FOR_REVIEWERS,
      path: PATHS.forReviewers,
      translationKey: 'pages.publish.forReviewers'
    },
    {
      type: PUBLISH_SECTION.FOR_CONFERENCE_ORGANISERS,
      path: PATHS.forConferenceOrganisers,
      translationKey: 'pages.publish.forConferenceOrganisers'
    }
  ];

  // Sort sections by defined order
  return sections.sort((a, b) => {
    const orderA = getPublishSectionSortOrder(a.type);
    const orderB = getPublishSectionSortOrder(b.type);
    return orderA - orderB;
  });
}