import { AvailableLanguage } from "../utils/i18n";
import { PartialSectionArticle } from "./article";

export interface ISection {
  id: number;
  rvcode: string;
  title?: Record<AvailableLanguage, string>;
  description?: Record<AvailableLanguage, string>;
  committee?: ISectionCommitteeMember[];
  articles: PartialSectionArticle[];
}

export type RawSection = Omit<ISection, 'rvcode'> & {
  sid: number;
  rvid: number;
  rvcode?: string;
  titles?: Record<AvailableLanguage, string>;
  descriptions?: Record<AvailableLanguage, string>;
  papers: PartialSectionArticle[];
}

interface ISectionCommitteeMember {
  uuid: string;
  screenName: string;
}