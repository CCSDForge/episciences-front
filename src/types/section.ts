import { AvailableLanguage } from "../utils/i18n";
import { IArticle } from "./article";

export interface ISection {
  id: number;
  title?: Record<AvailableLanguage, string>;
  description?: Record<AvailableLanguage, string>;
  articles: IArticle[];
}