import { AvailableLanguage } from "../utils/i18n";

export interface INews {
  id: number;
  title: Record<AvailableLanguage, string>;
  content?: Record<AvailableLanguage, string>;
  publicationDate: string;
  author: string;
  link?: string;
}