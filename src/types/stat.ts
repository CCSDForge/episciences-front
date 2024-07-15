export interface IStat {
  name: string;
  value: IStatValue;
  unit?: string;
}

type IStatValue = number | IStatValueDetails;

interface IStatValueDetails {
  published?: number;
  refused?: number;
  'being-to-publish'?: {
    accepted?: number;
    'other-status'?: number;
  }
}

export const isIStatValueDetails = (value: IStatValue): value is IStatValueDetails => {
  return (value as IStatValueDetails).published !== undefined || (value as IStatValueDetails).refused !== undefined || (value as IStatValueDetails)['being-to-publish'] !== undefined;
}

export interface IStatValueDetailsAsPieChart {
  status: string;
  count: number;
  isBeingToPublishStatus?: boolean;
}

export const getFormattedStatsAsPieChart = (value: IStatValue): IStatValueDetailsAsPieChart[] => {
  const stats: IStatValueDetailsAsPieChart[] = [];

  if (!isIStatValueDetails) return stats;
  const typedValue = value as IStatValueDetails;

  if (typedValue.published !== undefined) {
    stats.push({ status: 'published', count: typedValue.published })
  }

  if (typedValue.refused !== undefined) {
    stats.push({ status: 'refused', count: typedValue.refused })
  }

  if (typedValue['being-to-publish'] !== undefined && typedValue['being-to-publish'].accepted !== undefined) {
    stats.push({ status: 'accepted', count: typedValue['being-to-publish'].accepted, isBeingToPublishStatus: true })
  }

  if (typedValue['being-to-publish'] !== undefined && typedValue['being-to-publish']['other-status'] !== undefined) {
    stats.push({ status: 'other-status', count: typedValue['being-to-publish']['other-status'], isBeingToPublishStatus: true })
  }

  return stats;
}

export interface IStatValueEvaluation {
  'median-reviews-number'?: number;
  'reviews-received'?: number;
  'reviews-requested'?: number;
}

export const isIStatValueEvaluation = (value: IStatValue): boolean => {
  return (value as IStatValueEvaluation)['median-reviews-number'] !== undefined || (value as IStatValueEvaluation)['reviews-received'] !== undefined || (value as IStatValueEvaluation)['reviews-requested'] !== undefined;
}