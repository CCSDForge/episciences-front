import { AvailableLanguage } from '../utils/i18n';
import { PartialSectionArticle } from './article';

export interface ISection {
  id: number;
  rvid: number;
  rvcode: string;
  title?: Record<AvailableLanguage, string>;
  description?: Record<AvailableLanguage, string>;
  committee?: ISectionCommitteeMember[];
  articles: PartialSectionArticle[];
}

export type RawSection = Omit<
  ISection,
  'id' | 'rvcode' | 'title' | 'description' | 'articles'
> & {
  sid: number;
  rvid: number;
  titles?: Record<AvailableLanguage, string>;
  descriptions?: Record<AvailableLanguage, string>;
  papers: PartialSectionArticle[];
};

interface ISectionCommitteeMember {
  uuid: string;
  screenName: string;
}
