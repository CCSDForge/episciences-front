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

// Define the sort order for publish sections based on publishSections array
const getPublishSectionSortOrder = (sectionType: PUBLISH_SECTION): number => {
  const index = publishSections.indexOf(sectionType);
  return index !== -1 ? index + 1 : 999;
};

export const getPublishSections = (): IPublishSection[] => {
  const sections: IPublishSection[] = [];

  // Always include for authors
  sections.push({
    type: PUBLISH_SECTION.FOR_AUTHORS,
    path: PATHS.forAuthors,
    translationKey: 'pages.publish.forAuthors'
  });

  // Include for-reviewers only if environment variable is not 'false'
  const shouldRenderForReviewers = import.meta.env.VITE_JOURNAL_MENU_JOURNAL_FOR_REVIEWERS_RENDER !== 'false';
  if (shouldRenderForReviewers) {
    sections.push({
      type: PUBLISH_SECTION.FOR_REVIEWERS,
      path: PATHS.forReviewers,
      translationKey: 'pages.publish.forReviewers'
    });
  }

  // Include for-conference-organisers only if environment variable is not 'false'
  const shouldRenderForConferenceOrganisers = import.meta.env.VITE_JOURNAL_MENU_JOURNAL_FOR_CONFERENCE_ORGANISERS_RENDER !== 'false';
  if (shouldRenderForConferenceOrganisers) {
    sections.push({
      type: PUBLISH_SECTION.FOR_CONFERENCE_ORGANISERS,
      path: PATHS.forConferenceOrganisers,
      translationKey: 'pages.publish.forConferenceOrganisers'
    });
  }

  // Sort sections by defined order
  return sections.sort((a, b) => {
    const orderA = getPublishSectionSortOrder(a.type);
    const orderB = getPublishSectionSortOrder(b.type);
    return orderA - orderB;
  });
}