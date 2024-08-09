import { AvailableLanguage } from "./i18n";
import { SearchRange } from "./pagination";

export const formatSearchRange = (range?: SearchRange) => {
  const searchRange = range as { 
    year: Record<string, number>,
    type: Record<string, number>,
    volume: Record<AvailableLanguage, Record<string, Record<string, number>>>,
    section: Record<AvailableLanguage, Record<string, Record<string, number>>>,
    author: Record<string, number>,
  };

  const volumes = Object.entries(searchRange.volume).reduce((acc, [language, sectionData]) => {
    acc[language as AvailableLanguage] = formatVolumeOrSection(sectionData);
    return acc;
  }, {} as Record<AvailableLanguage, Record<number, string>[]>);

  const sections = Object.entries(searchRange.section).reduce((acc, [language, sectionData]) => {
    acc[language as AvailableLanguage] = formatVolumeOrSection(sectionData);
    return acc;
  }, {} as Record<AvailableLanguage, Record<number, string>[]>);

  return {
    years: Object.keys(searchRange.year).map(y => parseInt(y)),
    types: Object.keys(searchRange.type).map(t => t),
    volumes: volumes,
    sections: sections,
    authors: Object.keys(searchRange.author).map(a => a),
  }
}

const formatVolumeOrSection = (data: Record<string, Record<string, number>>): Record<number, string>[] => {
  return Object.entries(data).map(([id, titleObj]) => {
    const title = Object.keys(titleObj)[0];
    return { [parseInt(id)]: title };
  });
};