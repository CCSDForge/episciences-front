export enum STAT_TYPE {
  NB_SUBMISSIONS = 'nb-submissions',
  ACCEPTANCE_RATE = 'acceptance-rate',
  MEDIAN_SUBMISSION_PUBLICATION = 'median-submission-publication',
  MEDIAN_SUBMISSION_ACCEPTANCE = 'median-submission-acceptance',
}

export const statTypes: { labelPath: string; value: string; }[] = [
  { labelPath: 'pages.statistics.types.nbSubmissions', value: STAT_TYPE.NB_SUBMISSIONS },
  { labelPath: 'pages.statistics.types.acceptanceRate', value: STAT_TYPE.ACCEPTANCE_RATE },
  { labelPath: 'pages.statistics.types.medianSubmissionPublication', value: STAT_TYPE.MEDIAN_SUBMISSION_PUBLICATION },
  { labelPath: 'pages.statistics.types.medianSubmissionAcceptance', value: STAT_TYPE.MEDIAN_SUBMISSION_ACCEPTANCE }
]