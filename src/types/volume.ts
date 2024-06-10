import { AvailableLanguage } from "../utils/i18n";
import { PartialVolumeArticle } from "./article";

export interface IVolume {
  id: number;
  title?: Record<AvailableLanguage, string>;
  description?: Record<AvailableLanguage, string>;
  year?: number;
  types?: string[];
  articles: PartialVolumeArticle[];
}

export type RawVolume = IVolume & {
  vid: number;
  titles?: Record<AvailableLanguage, string>;
  descriptions?: Record<AvailableLanguage, string>;
  vol_year?: number;
  vol_type?: string[];
  papers: PartialVolumeArticle[];
}