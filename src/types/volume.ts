import { AvailableLanguage } from "../utils/i18n";
import { PartialVolumeArticle } from "./article";

export interface IVolume {
  id: number;
  num: string;
  title?: Record<AvailableLanguage, string>;
  description?: Record<AvailableLanguage, string>;
  year?: number;
  types?: string[];
  committee?: IVolumeCommitteeMember[];
  articles: PartialVolumeArticle[];
  downloadLink: string;
  metadatas?: IVolumeMetadata[];
  tileImageURL?: string;
}

export type RawVolume = IVolume & {
  vid: number;
  vol_num: string;
  titles?: Record<AvailableLanguage, string>;
  descriptions?: Record<AvailableLanguage, string>;
  vol_year?: number;
  vol_type?: string[];
  papers: PartialVolumeArticle[];
  metadata?: RawVolumeMetadata[];
}

interface IVolumeCommitteeMember {
  uuid: string;
  screenName: string;
}

export interface IVolumeMetadata {
  title?: Record<AvailableLanguage, string>;
  content?: Record<AvailableLanguage, string>;
  file?: string;
}

export type RawVolumeMetadata = IVolumeMetadata & {
  titles?: Record<AvailableLanguage, string>;
}