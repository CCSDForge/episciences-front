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
  tag: string;
  pdfLink: string;
  halLink: string;
  keywords?: string[];
  doi: string;
}

export type RawArticle = IPartialArticle & IArticle & {
  document: {
    public_properties: {
      journal?: {
        journal_article: {
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
          doi_data: {
            doi: string;
            resource: string;
          }
          keywords?: string [];
        }
      }
      database: {
        current: {
          dates: {
            publication_date: string;
          }
          files: {
            link: string;
          }
          repository: {
            doc_url: string;
            paper_url: string;
          }
        }
      }
    }
  }
}