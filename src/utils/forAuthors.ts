export enum FOR_AUTHORS_SECTION {
  ETHICAL_CHARTER = 'ethicalCharter',
  EDITORIAL_WORKFLOW = 'editorialWorkflow',
  PREPARE_SUBMISSION = 'prepareSubmission'
}

// Defines the display order of for-authors sections in the navigation menu
export const forAuthorsSections = [
  FOR_AUTHORS_SECTION.ETHICAL_CHARTER,
  FOR_AUTHORS_SECTION.EDITORIAL_WORKFLOW,
  FOR_AUTHORS_SECTION.PREPARE_SUBMISSION
]

// Define the sort order for for-authors sections based on forAuthorsSections array
export const getForAuthorsSectionSortOrder = (sectionType: FOR_AUTHORS_SECTION): number => {
  const index = forAuthorsSections.indexOf(sectionType);
  return index !== -1 ? index + 1 : 999;
};