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
  graphicalAbstract?: string;
  authors: IArticleAuthor[];
  publicationDate: string;
  acceptanceDate?: string;
  submissionDate?: string;
  modificationDate?: string;
  tag?: string;
  pdfLink?: string;
  docLink?: string;
  repositoryIdentifier: string;
  keywords?: string[] | IArticleKeywords;
  doi: string;
  volumeId?: number;
  citations?: IArticleCitation[];
  relatedItems?: IArticleRelatedItem[];
  fundings?: string[];
  license?: string;
  metrics?: {
    views: number;
    downloads: number;
  }
}

export interface IArticleAuthor {
  fullname: string;
  orcid?: string;
  institutions?: string[];
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

export interface IArticleRelatedItem {
  value: string;
  identifierType: string;
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
            modification_date: string;
          }
          graphical_abstract_file?: string;
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
          metrics?: {
            file_count: number;
            page_count: number;
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
      ORCID?: string;
      affiliations?: {
        institution?: {
          institution_name: string;
        } | {
          institution_name: string;
        }[]
      }
    } | {
      surname: string;
      '@sequence': string;
      given_name: string;
      ORCID?: string;
      affiliations?: {
        institution?: {
          institution_name: string;
        } | {
          institution_name: string;
        }[]
      }
    }[]
  }
  program?: {
    '@name'?: string;
    assertion?: {
      assertion?: {
        value: string;
      }
    } | {
      assertion?: {
        value: string;
      }[]
    }
    license_ref?: {
      value: string;
    }
    related_item?: {
      inter_work_relation?: {
        '@identifier-type': string;
        value: string;
      }
      intra_work_relation?: {
        '@identifier-type': string;
        value: string;
      }
    } | {
      inter_work_relation?: {
        '@identifier-type': string;
        value: string;
      }
      intra_work_relation?: {
        '@identifier-type': string;
        value: string;
      }
    }[]
  } | {
    '@name'?: string;
    assertion?: {
      assertion?: {
        value: string;
      }
    } | {
      assertion?: {
        value: string;
      }[]
    }
    license_ref?: {
      value: string;
    }
    related_item?: {
      inter_work_relation?: {
        '@identifier-type': string;
        value: string;
      }
      intra_work_relation?: {
        '@identifier-type': string;
        value: string;
      }
    } | {
      inter_work_relation?: {
        '@identifier-type': string;
        value: string;
      }
      intra_work_relation?: {
        '@identifier-type': string;
        value: string;
      }
    }[]
  }[]
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