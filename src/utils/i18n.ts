export const defaultLanguage: string = import.meta.env.VITE_JOURNAL_DEFAULT_LANGUAGE || 'en';

export const availableLanguages = import.meta.env.VITE_JOURNAL_ACCEPTED_LANGUAGES
  ? import.meta.env.VITE_JOURNAL_ACCEPTED_LANGUAGES.split(',')
  : [defaultLanguage];

export type AvailableLanguage = typeof availableLanguages[number];