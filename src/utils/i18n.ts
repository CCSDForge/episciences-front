export const defaultLanguage: string = import.meta.env.VITE_JOURNAL_DEFAULT_LANGUAGE || 'en';

export const availableLanguages = [
  defaultLanguage,
  'fr'
] as const;

export type AvailableLanguage = typeof availableLanguages[number];