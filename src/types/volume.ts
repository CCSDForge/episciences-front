import { AvailableLanguage } from "../utils/i18n";
import { IArticle } from "./article";

export interface IVolume {
  id: number;
  title?: Record<AvailableLanguage, string>;
  description?: Record<AvailableLanguage, string>;
  year?: number;
  articles: IArticle[];
}