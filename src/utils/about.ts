import { PATHS } from '../config/paths';

export enum ABOUT_SECTION {
  ABOUT = 'about',
  ACKNOWLEDGEMENTS = 'acknowledgements',
  INDEXATION = 'indexation',
  NEWS = 'news',
  STATISTICS = 'statistics',
}

// Defines the display order of about sections in the navigation menu
export const aboutSections = [
  ABOUT_SECTION.ABOUT,
  ABOUT_SECTION.INDEXATION,
  ABOUT_SECTION.NEWS,
  ABOUT_SECTION.STATISTICS,
  ABOUT_SECTION.ACKNOWLEDGEMENTS,
];

export interface IAboutSection {
  type: ABOUT_SECTION;
  path: string;
  translationKey: string;
  envKey?: string;
}

// Define the sort order for about sections based on aboutSections array
const getAboutSectionSortOrder = (sectionType: ABOUT_SECTION): number => {
  const index = aboutSections.indexOf(sectionType);
  return index !== -1 ? index + 1 : 999;
};

export const getAboutSections = (
  shouldRenderStatistics: boolean
): IAboutSection[] => {
  const sections: IAboutSection[] = [];

  // Always include about
  sections.push({
    type: ABOUT_SECTION.ABOUT,
    path: PATHS.about,
    translationKey: 'components.header.links.about',
  });

  const shouldRenderFeature = (envVarValue: string | undefined): boolean => {
    return envVarValue !== 'false';
  };

  // Include acknowledgements only if environment variable is not 'false'
  const shouldRenderAcknowledgements = shouldRenderFeature(
    import.meta.env.VITE_JOURNAL_MENU_JOURNAL_ACKNOWLEDGEMENTS_RENDER
  );
  if (shouldRenderAcknowledgements) {
    sections.push({
      type: ABOUT_SECTION.ACKNOWLEDGEMENTS,
      path: PATHS.acknowledgements,
      translationKey: 'components.header.links.acknowledgements',
      envKey: 'JOURNAL_ACKNOWLEDGEMENTS',
    });
  }

  // Include indexation only if environment variable is not 'false'
  const shouldRenderIndexation = shouldRenderFeature(
    import.meta.env.VITE_JOURNAL_MENU_JOURNAL_INDEXING_RENDER
  );
  if (shouldRenderIndexation) {
    sections.push({
      type: ABOUT_SECTION.INDEXATION,
      path: PATHS.indexation,
      translationKey: 'components.header.links.indexation',
      envKey: 'JOURNAL_INDEXING',
    });
  }

  // Include news only if environment variable is not 'false'
  const shouldRenderNews = shouldRenderFeature(
    import.meta.env.VITE_JOURNAL_MENU_NEWS_RENDER
  );
  if (shouldRenderNews) {
    sections.push({
      type: ABOUT_SECTION.NEWS,
      path: PATHS.news,
      translationKey: 'components.header.links.news',
      envKey: 'NEWS',
    });
  }

  // Include statistics if configured to render
  if (shouldRenderStatistics) {
    sections.push({
      type: ABOUT_SECTION.STATISTICS,
      path: PATHS.statistics,
      translationKey: 'components.header.links.statistics',
    });
  }

  // Sort sections by defined order
  return sections.sort((a, b) => {
    const orderA = getAboutSectionSortOrder(a.type);
    const orderB = getAboutSectionSortOrder(b.type);
    return orderA - orderB;
  });
};
