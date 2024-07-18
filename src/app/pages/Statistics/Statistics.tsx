import { useState, useEffect, Fragment } from 'react'
import { useTranslation } from 'react-i18next';

import caretUp from '/icons/caret-up-red.svg';
import caretDown from '/icons/caret-down-red.svg';
import { useAppSelector } from "../../../hooks/store";
import { useFetchStatsQuery } from '../../../store/features/stat/stat.query';
import { IStat, IStatValueEvaluation, getFormattedStatsAsPieChart, isIStatValueDetails, isIStatValueEvaluation } from '../../../types/stat';
import { STAT_TYPE, IStatisticsPerLabel, STAT_LABEL, statTypes, statEvaluationTypes } from '../../../utils/stat';
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Loader from '../../components/Loader/Loader';
import PieChart from '../../components/Charts/PieChart/PieChart';
import StatisticsSidebar, { IStatisticsYearSelection } from '../../components/Sidebars/StatisticsSidebar/StatisticsSidebar';
import './Statistics.scss'

export default function Statistics(): JSX.Element {
  const { t, i18n } = useTranslation();

  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code)

  const [statisticsPerLabel, setStatisticsPerLabel] = useState<IStatisticsPerLabel[]>([
    { labelKey: STAT_LABEL.GLANCE, labelPath: 'pages.statistics.labels.glance', statistics: [], isOpened: true },
    { labelKey: STAT_LABEL.EVALUATION_PUBLICATION, labelPath: 'pages.statistics.labels.evaluationPublication', statistics: [], isOpened: true }
  ]);
  const [years, setYears] = useState<IStatisticsYearSelection[]>([]);

  const getSelectedYear = (): number | undefined => years.find(y => y.isSelected)?.year;

  const { data: stats, isFetching: isFetching } = useFetchStatsQuery({ rvcode: rvcode!, page: 1, itemsPerPage: 7, year: getSelectedYear() }, { skip: !rvcode, refetchOnMountOrArgChange: true })

  useEffect(() => {
    if (stats?.range && stats.range.years && years.length === 0) {
      const initYears = stats.range.years.map((y) => ({
        year: y,
        isSelected: false
      }))

      setYears(initYears)
    }
  }, [stats?.range, stats?.range?.years, years])

  const onSelectYear = (year: number): void => {
    const updatedYears = years.map((y) => {
      if (y.year === year) {
        return { ...y, isSelected: !y.isSelected };
      }

      return { ...y, isSelected: false };
    });

    setYears(updatedYears);
  }

  const getStatisticTitle = (statistic: IStat): string | undefined => {
    if (statTypes.find(stat => stat.value === statistic.name)) {
      return t(statTypes.find(stat => stat.value === statistic.name)?.labelPath!)
    }

    if (statEvaluationTypes.find(stat => stat.value === statistic.name)) {
      return t(statEvaluationTypes.find(stat => stat.value === statistic.name)?.labelPath!)
    }

    return
  }

  const toggleStatisticsSection = (labelKey: STAT_LABEL): void => {
    const updatedStatistics = statisticsPerLabel.map((statisticPerLabel) => {
      if (statisticPerLabel.labelKey === labelKey) {
        return {
          ...statisticPerLabel,
          isOpened: !statisticPerLabel.isOpened
        }
      }

      return { ...statisticPerLabel };
    });

    setStatisticsPerLabel(updatedStatistics)
  }

  useEffect(() => {
    if (stats) {
      const glanceStatTypes = [STAT_TYPE.ACCEPTANCE_RATE, STAT_TYPE.NB_SUBMISSIONS, STAT_TYPE.NB_SUBMISSIONS_DETAILS]
      const evaluationPublicationStatTypes = [STAT_TYPE.EVALUATION, STAT_TYPE.MEDIAN_SUBMISSION_PUBLICATION]

      const glanceStats = stats.data.filter((stat) => glanceStatTypes.includes(stat.name as STAT_TYPE))
      let evaluationPublicationStats = stats.data.filter((stat) => evaluationPublicationStatTypes.includes(stat.name as STAT_TYPE))

      const evaluationStat = evaluationPublicationStats.find((stat) => isIStatValueEvaluation(stat.value))
      if (evaluationStat) {
        evaluationPublicationStats.push({
          name: 'medianReviewsNumber',
          unit: evaluationStat.unit,
          value: (evaluationStat.value as IStatValueEvaluation)['median-reviews-number']!
        })

        evaluationPublicationStats.push({
          name: 'reviewsReceived',
          unit: evaluationStat.unit,
          value: (evaluationStat.value as IStatValueEvaluation)['reviews-received']!
        })

        evaluationPublicationStats.push({
          name: 'reviewsRequested',
          unit: evaluationStat.unit,
          value: (evaluationStat.value as IStatValueEvaluation)['reviews-requested']!
        })

        evaluationPublicationStats = evaluationPublicationStats.filter((stat) => !isIStatValueEvaluation(stat.value))
      }

      const updatedStatisticsPerLabel = statisticsPerLabel.map((statisticPerLabel) => {
        return {
          ...statisticPerLabel,
          statistics: statisticPerLabel.labelKey === STAT_LABEL.GLANCE ? glanceStats : evaluationPublicationStats
        }
      })

      setStatisticsPerLabel(updatedStatisticsPerLabel)
    }

  }, [stats, stats?.data])

  return (
    <main className='statistics'>
      <Breadcrumb parents={[
        { path: 'home', label: `${t('pages.home.title')} > ${t('common.about')} >` }
      ]} crumbLabel={t('pages.statistics.title')} />
      <div className='statistics-title'>
        <h1 className='statistics-title-text'>{t('pages.statistics.title')}</h1>
        <div className='statistics-title-year'>{getSelectedYear()}</div>
      </div>
      <div className='statistics-content'>
        <div className='statistics-content-results'>
          <StatisticsSidebar t={t} years={years} onSelectYearCallback={onSelectYear} />
          {isFetching ? (
            <Loader />
          ) : (
            <div className='statistics-content-results-cards'>
              {statisticsPerLabel.map((statisticPerLabel, index) => (
                <div key={index} className='statistics-content-results-cards-row'>
                  <div className="statistics-content-results-cards-row-title" onClick={(): void => toggleStatisticsSection(statisticPerLabel.labelKey)}>
                    <div className="statistics-content-results-cards-row-title-text">{t(statisticPerLabel.labelPath)}</div>
                    {statisticPerLabel.isOpened ? (
                    <img className='boards-content-groups-group-caret' src={caretUp} alt='Caret up icon' />
                  ) : (
                    <img className='boards-content-groups-group-caret' src={caretDown} alt='Caret down icon' />
                  )}
                  </div>
                  <div className={`statistics-content-results-cards-row-stats ${statisticPerLabel.isOpened && "statistics-content-results-cards-row-stats-active"}`}>
                    {statisticPerLabel.statistics.map((statistic, index) => (
                      <Fragment key={index}>
                        <div className='statistics-content-results-cards-row-stats-row'>
                          {isIStatValueDetails(statistic.value) ? (
                            <PieChart t={t} data={getFormattedStatsAsPieChart(statistic.value)} />
                          ) : (
                            <>
                              {statistic.unit ? (
                                <div
                                  className={`${statisticPerLabel.labelKey === STAT_LABEL.EVALUATION_PUBLICATION ? "statistics-content-results-cards-row-stats-row-stat statistics-content-results-cards-row-stats-row-stat-evaluation" : "statistics-content-results-cards-row-stats-row-stat"}`}
                                >
                                  {statistic.value}{i18n.exists(`common.${statistic.unit}`) ? <span className={`${statisticPerLabel.labelKey === STAT_LABEL.EVALUATION_PUBLICATION && "statistics-content-results-cards-row-stats-row-stat-unitEvaluation"}`}>{t(`common.${statistic.unit}`)}</span> : statistic.unit}
                                </div>
                              ) : (
                                <div className={`${statisticPerLabel.labelKey === STAT_LABEL.EVALUATION_PUBLICATION ? "statistics-content-results-cards-row-stats-row-stat statistics-content-results-cards-row-stats-row-stat-evaluation" : "statistics-content-results-cards-row-stats-row-stat"}`}>{statistic.value}</div>
                              )}
                              <div className={`${statisticPerLabel.labelKey === STAT_LABEL.EVALUATION_PUBLICATION ? "statistics-content-results-cards-row-stats-row-title statistics-content-results-cards-row-stats-row-title-evaluation" : "statistics-content-results-cards-row-stats-row-title"}`}>{getStatisticTitle(statistic)}</div>
                            </>
                          )}
                        </div>
                        {index !== statisticPerLabel.statistics.length - 1 && (
                          <div className={`${statisticPerLabel.labelKey === STAT_LABEL.EVALUATION_PUBLICATION ? "statistics-content-results-cards-row-stats-divider statistics-content-results-cards-row-stats-divider-evaluation" : "statistics-content-results-cards-row-stats-divider"}`}></div>
                        )}
                      </Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}