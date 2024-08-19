import { AvailableLanguage } from "./i18n";
import { SearchRange } from "./pagination";

export const formatSearchRange = (range?: SearchRange) => {
  const searchRange = range as { 
    year?: Record<string, number>,
    type?: Record<string, number>,
    volume?: Record<AvailableLanguage, Record<string, Record<string, number>>>,
    section?: Record<AvailableLanguage, Record<string, Record<string, number>>>,
    author?: Record<string, number>,
  };

  let years: number[] = [];
  if (searchRange.year) {
    years = Object.keys(searchRange.year).map(y => parseInt(y));
  }

  let types: string[] = [];
  if (searchRange.type) {
    types = Object.keys(searchRange.type).map(t => t);
  }

  let volumes: Record<AvailableLanguage, Record<number, string>[]> = {
    en: [],
    fr: []
  };
  if (searchRange.volume) {
    volumes = Object.entries(searchRange.volume).reduce((acc, [language, sectionData]) => {
      acc[language as AvailableLanguage] = formatVolumeOrSection(sectionData);
      return acc;
    }, {} as Record<AvailableLanguage, Record<number, string>[]>);
  }

  let sections: Record<AvailableLanguage, Record<number, string>[]> = {
    en: [],
    fr: []
  }
  if (searchRange.section) {
    sections = Object.entries(searchRange.section).reduce((acc, [language, sectionData]) => {
      acc[language as AvailableLanguage] = formatVolumeOrSection(sectionData);
      return acc;
    }, {} as Record<AvailableLanguage, Record<number, string>[]>);
  }

  let authors: string[] = [];
  if (searchRange.author) {
    authors = Object.keys(searchRange.author).map(a => a)
  }

  return {
    years,
    types,
    volumes,
    sections,
    authors,
  }
}

const formatVolumeOrSection = (data: Record<string, Record<string, number>>): Record<number, string>[] => {
  return Object.entries(data).map(([id, titleObj]) => {
    const title = Object.keys(titleObj)[0];
    return { [parseInt(id)]: title };
  });
};