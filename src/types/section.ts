import { AvailableLanguage } from "../utils/i18n";
import { PartialSectionArticle } from "./article";

export interface ISection {
  id: number;
  title?: Record<AvailableLanguage, string>;
  description?: Record<AvailableLanguage, string>;
  articles: PartialSectionArticle[];
}

export type RawSection = ISection & {
  sid: number;
  titles?: Record<AvailableLanguage, string>;
  descriptions?: Record<AvailableLanguage, string>;
  papers: PartialSectionArticle[];
}