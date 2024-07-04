import { AvailableLanguage } from "./i18n";

export const formatDate = (dateString: string, language: AvailableLanguage): string => {
  const date = new Date(dateString);
  
  const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
  };

  return new Intl.DateTimeFormat(language, options).format(date);
}