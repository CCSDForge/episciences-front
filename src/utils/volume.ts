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