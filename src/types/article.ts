import { AvailableLanguage } from "../utils/i18n";

export interface IPartialArticle {
  '@id': string;
  '@type': string;
  paperid: number;
}

export type PartialSectionArticle = IPartialArticle;
export type PartialVolumeArticle = IPartialArticle;

export interface IArticle {
  id: number;
  title: string;
  abstract?: string;
  authors: string;
  publicationDate: string;
  acceptanceDate?: string;
  submissionDate?: string;
  tag?: string;
  pdfLink: string;
  halLink: string;
  docLink: string;
  repositoryIdentifier: string;
  keywords?: string[] | IArticleKeywords;
  doi: string;
  volumeId?: number;
  citations?: IArticleCitation[];
  relatedItems?: string[];
}

export type IArticleRecordKeywords = {
  [language in AvailableLanguage]: string[];
};

export interface IArticleKeywords extends IArticleRecordKeywords {
  [index: number]: string;
}

export interface IArticleCitation {
  doi?: string;
  citation: string;
}

export type RawArticle = IPartialArticle & IArticle & {
  document: {
    public_properties: {
      journal?: {
        journal_article: IRawArticleContent;
      }
      database: {
        current: {
          type?: {
            title: string;
          }
          dates: {
            publication_date: string;
            first_submission_date: string;
          }
          files: {
            link: string;
          } | {
            link: string;
          }[]
          repository: {
            doc_url: string;
            paper_url: string;
          }
          identifiers: {
            repository_identifier: string;
          }
          volume?: {
            id: number;
          }
        }
      }
      conference: {
        conference_paper: IRawArticleContent;
      }
    }
  }
}

interface IRawArticleContent {
  titles: {
    title: string;
  }
  abstract?: {
    value: string | {
      value: string;
    };
  }
  contributors: {
    person_name: {
      surname: string;
      '@sequence': string;
      given_name: string;
    } | {
      surname: string;
      '@sequence': string;
      given_name: string;
    }[]
  }
  program?: {
    related_item?: {
      inter_work_relation?: {
        value: string;
      }
    } | {
      inter_work_relation?: {
        value: string;
      }
    }[]
  }
  citation_list?: {
    citation?: {
      doi: string;
      unstructured_citation: string;
    }[]
  }
  doi_data: {
    doi: string;
    resource: string;
  }
  keywords?: string[] | IArticleKeywords;
  acceptance_date?: {
    day: string;
    month: string;
    year: string;
  }
}