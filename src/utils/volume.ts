import { IVolume, RawVolume } from "../types/volume";

export const formatVolume = (volume: RawVolume): IVolume => {
  return {
    ...volume,
    id: volume['vid'],
    num: volume['vol_num'],
    title: volume['titles'],
    description: volume['descriptions'],
    year: volume['vol_year'],
    types: volume['vol_type'],
    articles: volume['papers']
  };
}

export enum VOLUME_TYPE {
  SPECIAL_ISSUE = 'special_issue',
  PROCEEDINGS = 'proceedings'
}

// TODO: translate
export const volumeTypes: { label: string; value: string; }[] = [
  { label: 'Special Issues', value: VOLUME_TYPE.SPECIAL_ISSUE },
  { label: 'Proceedings', value: VOLUME_TYPE.PROCEEDINGS }
]