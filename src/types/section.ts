import { AvailableLanguage } from "../utils/i18n";
import { PartialSectionArticle } from "./article";

export interface ISection {
  id: number;
  title?: Record<AvailableLanguage, string>;
  description?: Record<AvailableLanguage, string>;
  articles: PartialSectionArticle[];
}