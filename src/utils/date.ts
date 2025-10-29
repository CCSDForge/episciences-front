import { AvailableLanguage } from "./i18n";

export const formatDate = (dateString: string, language: AvailableLanguage, overridedOptions?: Intl.DateTimeFormatOptions): string => {
  if (!dateString) {
    return '';
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return '';
  }

  const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...overridedOptions,
  };

  return new Intl.DateTimeFormat(language, options).format(date);
}