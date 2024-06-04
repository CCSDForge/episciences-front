interface IPartialArticle {
  '@id': string;
  '@type': string;
  paperid: number;
}

export type PartialSectionArticle = IPartialArticle;
export type PartialVolumeArticle = IPartialArticle;

// TODO: improve
export interface IArticle {
  id: number;
  title: string;
  authors: string;
  abstract?: string;
  publicationDate: string;
  tag: string;
}