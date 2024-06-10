import { AvailableLanguage } from "../utils/i18n";

export interface INews {
  id: number;
  title: Record<AvailableLanguage, string>;
  content?: Record<AvailableLanguage, string>;
  publicationDate: string;
  author: string;
  link?: string;
}

export type RawNews = INews & {
  date_creation: string;
  creator: {
    screenName: string;
  };
  link?: {
    und: string;
  }
}