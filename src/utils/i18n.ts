export const availableLanguages = ['en', 'fr'] as const;

export type AvailableLanguage = typeof availableLanguages[number];