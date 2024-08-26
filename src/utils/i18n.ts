export const defaultLanguage = 'en';

export const availableLanguages = [
  defaultLanguage,
  'fr'
] as const;

export type AvailableLanguage = typeof availableLanguages[number];