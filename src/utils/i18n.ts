export const defaultLanguage: string =
  import.meta.env.VITE_JOURNAL_DEFAULT_LANGUAGE || 'en';

export const availableLanguages = import.meta.env
  .VITE_JOURNAL_ACCEPTED_LANGUAGES
  ? import.meta.env.VITE_JOURNAL_ACCEPTED_LANGUAGES.split(',')
  : [defaultLanguage];

export type AvailableLanguage = (typeof availableLanguages)[number];

export function getLocalizedContent(
  content: Record<string, string> | undefined,
  language: string,
): string | undefined {
  if (!content) return undefined;
  if (content[language]) return content[language];
  if (content[defaultLanguage]) return content[defaultLanguage];
  return undefined;
}

const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur', 'ps', 'syr', 'dv', 'ku'];

export interface LanguageAttributes {
  lang: string;
  dir?: 'rtl' | 'ltr';
}

export const getLanguageAttributes = (langCode: string): LanguageAttributes => {
  if (!langCode) {
    return { lang: '' };
  }

  const isRTL = RTL_LANGUAGES.includes(langCode.toLowerCase());

  return {
    lang: langCode,
    dir: isRTL ? 'rtl' : 'ltr',
  };
};
