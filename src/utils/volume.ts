import { useTranslation } from 'react-i18next';

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
    articles: volume['papers'],
    downloadLink: `https://${import.meta.env.VITE_JOURNAL_RVCODE}.episciences.org/volumes/${volume['vid']}/${volume['vid']}.pdf`
  }
}

export enum VOLUME_TYPE {
  SPECIAL_ISSUE = 'special_issue',
  PROCEEDINGS = 'proceedings'
}

export const volumeTypes = (): { label: string; value: string; }[] => {
  const { t } = useTranslation();

  return [
    { label: t('pages.volumes.types.specialIssues'), value: VOLUME_TYPE.SPECIAL_ISSUE },
    { label: t('pages.volumes.types.proceedings'), value: VOLUME_TYPE.PROCEEDINGS }
  ]
}