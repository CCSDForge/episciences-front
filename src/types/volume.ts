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
}

export type RawVolume = IVolume & {
  vid: number;
  vol_num: string;
  titles?: Record<AvailableLanguage, string>;
  descriptions?: Record<AvailableLanguage, string>;
  vol_year?: number;
  vol_type?: string[];
  papers: PartialVolumeArticle[];
}

interface IVolumeCommitteeMember {
  uuid: string;
  screenName: string;
}