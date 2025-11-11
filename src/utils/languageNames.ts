/**
 * Language names in their native language
 * Used for displaying language options in the language switcher
 */
export const languageNames: Record<string, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  nl: 'Nederlands',
  ru: 'Русский',
  ja: '日本語',
  zh: '中文',
  ar: 'العربية',
  he: 'עברית',
  fa: 'فارسی',
  ur: 'اردو',
  ps: 'پښتو',
  syr: 'ܣܘܪܝܝܐ',
  dv: 'ދިވެހި',
  ku: 'کوردی',
  pl: 'Polski',
  sv: 'Svenska',
  no: 'Norsk',
  da: 'Dansk',
  fi: 'Suomi',
  el: 'Ελληνικά',
  tr: 'Türkçe',
  cs: 'Čeština',
  sk: 'Slovenčina',
  ro: 'Română',
  hu: 'Magyar',
  bg: 'Български',
  uk: 'Українська',
  hr: 'Hrvatski',
  sr: 'Српски',
  sl: 'Slovenščina',
  lt: 'Lietuvių',
  lv: 'Latviešu',
  et: 'Eesti',
  ca: 'Català',
  eu: 'Euskara',
  gl: 'Galego',
  ko: '한국어',
  vi: 'Tiếng Việt',
  th: 'ไทย',
  id: 'Bahasa Indonesia',
  ms: 'Bahasa Melayu',
  hi: 'हिन्दी',
};

/**
 * Get the native name of a language from its code
 * @param langCode - ISO 639-1 language code
 * @returns Native language name or the code in uppercase if not found
 */
export const getLanguageName = (langCode: string): string => {
  return languageNames[langCode.toLowerCase()] || langCode.toUpperCase();
};
