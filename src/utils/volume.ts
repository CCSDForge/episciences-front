import { IVolume, IVolumeMetadata, RawVolume, RawVolumeMetadata } from "../types/volume";
import { AvailableLanguage } from "./i18n";

export const formatVolume = (language: AvailableLanguage, volume: RawVolume): IVolume => {
  let metadatas: IVolumeMetadata[]  = [];
  let tileImageURL = undefined;
  
  if (volume['metadata'] && volume['metadata'].length) {
    metadatas = volume['metadata'].map((meta) => formatVolumeMetadata(meta))

    if (metadatas.length > 0) {
      const tileFile = metadatas.find(metadata => metadata['file'] && metadata['title'] && metadata['title'][language] === 'tile')?.file
      if (tileFile) {
        tileImageURL = `https://${import.meta.env.VITE_JOURNAL_RVCODE}.episciences.org/public/volumes/${volume['vid']}/${tileFile}`
      }
    }
  }

  return {
    ...volume,
    id: volume['vid'],
    num: volume['vol_num'],
    title: volume['titles'],
    description: volume['descriptions'],
    year: volume['vol_year'],
    types: volume['vol_type'],
    articles: volume['papers'],
    downloadLink: `https://${import.meta.env.VITE_JOURNAL_RVCODE}.episciences.org/volumes/${volume['vid']}/${volume['vid']}.pdf`,
    metadatas: metadatas,
    tileImageURL
  }
}

export const formatVolumeMetadata = (metadata: RawVolumeMetadata): IVolumeMetadata => {
  return {
    ...metadata,
    title: metadata['titles'],
    content: metadata['content'],
    file: metadata['file'],
  }
}

export enum VOLUME_TYPE {
  SPECIAL_ISSUE = 'special_issue',
  PROCEEDINGS = 'proceedings'
}

export const volumeTypes: { labelPath: string; value: string; }[] = [
  { labelPath: 'pages.volumes.types.specialIssues', value: VOLUME_TYPE.SPECIAL_ISSUE },
  { labelPath: 'pages.volumes.types.proceedings', value: VOLUME_TYPE.PROCEEDINGS }
]