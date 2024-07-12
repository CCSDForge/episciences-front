import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';

import { useAppSelector } from "../../../hooks/store";
import { useFetchStatsQuery } from '../../../store/features/stat/stat.query';
import { STAT_TYPE, IStatisticsPerLabel, STAT_LABEL, statTypes } from '../../../utils/stat';
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Loader from '../../components/Loader/Loader';
import StatisticsSidebar, { IStatisticsYearSelection } from '../../components/Sidebars/StatisticsSidebar/StatisticsSidebar';
import './Statistics.scss'

export default function Statistics(): JSX.Element {
  const { t, i18n } = useTranslation();

  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code)

  const [statisticsPerLabel, setStatisticsPerLabel] = useState<IStatisticsPerLabel[]>([
    { labelKey: STAT_LABEL.GLANCE, labelPath: 'pages.statistics.labels.glance', statistics: [] },
    { labelKey: STAT_LABEL.EVALUATION_PUBLICATION, labelPath: 'pages.statistics.labels.evaluationPublication', statistics: [] }
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

  useEffect(() => {
    if (stats) {
      const glanceStatTypes = [STAT_TYPE.ACCEPTANCE_RATE, STAT_TYPE.NB_SUBMISSIONS]
      const evaluationPublicationStatTypes = [STAT_TYPE.MEDIAN_SUBMISSION_PUBLICATION]

      const glanceStats = stats.data.filter((stat) => glanceStatTypes.includes(stat.name as STAT_TYPE))
      const evaluationPublicationStats = stats.data.filter((stat) => evaluationPublicationStatTypes.includes(stat.name as STAT_TYPE))

      const updatedStatisticsPerLabel = statisticsPerLabel.map((statisticPerLabel) => {
        return {
          ...statisticPerLabel,
          statistics: statisticPerLabel.labelKey === STAT_LABEL.GLANCE ? glanceStats : evaluationPublicationStats
        }
      })

      setStatisticsPerLabel(updatedStatisticsPerLabel)
    }

  }, [stats, stats?.data, statisticsPerLabel])

  return (
    <main className='statistics'>
      <Breadcrumb parent={{ path: 'home', label: `${t('pages.home.title')} > ${t('common.about')} >` }} crumbLabel={t('pages.statistics.title')} />
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
                  <div className="statistics-content-results-cards-row-title">{t(statisticPerLabel.labelPath)}</div>
                  <div className="statistics-content-results-cards-row-stats">
                    {statisticPerLabel.statistics.map((statistic, index) => (
                      <div key={index} className={`statistics-content-results-cards-row-stats-row ${index !== statisticPerLabel.statistics.length - 1 && 'statistics-content-results-cards-row-stats-row-bordered'}`}>
                        {statistic.unit ? (
                          <div className="statistics-content-results-cards-row-stats-row-stat">{statistic.value} {i18n.exists(`common.${statistic.unit}`) ? t(`common.${statistic.unit}`) : statistic.unit}</div>
                        ) : (
                          <div className="statistics-content-results-cards-row-stats-row-stat">{statistic.value}</div>
                        )}
                        <div className="statistics-content-results-cards-row-stats-row-title">{t(statTypes.find(stat => stat.value === statistic.name)?.labelPath!)}</div>
                      </div>
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