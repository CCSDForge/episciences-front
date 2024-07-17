import { AvailableLanguage } from "./i18n";

export const formatDate = (dateString: string, language: AvailableLanguage, overridedOptions?: Intl.DateTimeFormatOptions): string => {
  const date = new Date(dateString);
  
  const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...overridedOptions,
  };

  return new Intl.DateTimeFormat(language, options).format(date);
}