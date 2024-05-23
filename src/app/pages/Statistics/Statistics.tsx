import { useState } from 'react'

import { IStat } from '../../../types/stat';
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import StatisticsSidebar from '../../components/Sidebars/StatisticsSidebar/StatisticsSidebar';
import './Statistics.scss'

interface IStatisticsPerTitle {
  title: string;
  statistics: IStat[]
}

export default function Statistics(): JSX.Element {
    // TODO: remove mocks
  // TODO: type hint filters in src/types ?
  const [filters, setFilters] = useState([
    // TODO : years from util
    {
      id: 1,
      title: 'Years',
      choices: [
        { id: 1, label: '2023', isSelected: false },
        { id: 2, label: '2022', isSelected: false },
        { id: 3, label: '2021', isSelected: false }
      ]
    },
  ]);

  const [statistics, setStatistics] = useState<IStatisticsPerTitle[]>([
    {
      title: 'At a glance',
      statistics: [
        { stat: '57%', title: 'Acceptance rate' },
        { stat: '61', title: 'Submissions' },
      ]
    },
    {
      title: 'Evaluation and publication',
      statistics: [
        { stat: '61', title: 'Reviews requested' },
        { stat: '31', title: 'Reviews received' },
        { stat: '4', title: 'Median number of reviews for research articles' },
        { stat: '3 weeks', title: 'Median Time submission-publication' },
      ]
    }
  ]);

  const onSelectFilterChoice = (filterId: number, choiceId: number): void => {
    const updatedFilters = filters.map((filter) => {
      if (filter.id === filterId) {
        const updatedChoices = filter.choices.map((choice) => {
          if (choice.id === choiceId) {
            return { ...choice, isSelected: !choice.isSelected };
          }

          return { ...choice, isSelected: false };
        });

        return { ...filter, choices: updatedChoices };
      }

      return filter;
    });

    setFilters(updatedFilters);
  }

  return (
    <main className='statistics'>
      <Breadcrumb />
      <div className='statistics-title'>
        <h1>Statistics</h1>
        <div className='statistics-title-year'>2023</div>
      </div>
      <div className='statistics-content'>
        <div className='statistics-content-results'>
          <StatisticsSidebar filters={filters} onSelectFilterChoiceCallback={onSelectFilterChoice} />
          <div className='statistics-content-results-cards'>
            {statistics.map((statisticPerTitle, index) => (
              <div key={index} className='statistics-content-results-cards-row'>
                <div className="statistics-content-results-cards-row-title">{statisticPerTitle.title}</div>
                <div className="statistics-content-results-cards-row-stats">
                  {statisticPerTitle.statistics.map((statistic, index) => (
                    <div key={index} className={`statistics-content-results-cards-row-stats-row ${index !== statisticPerTitle.statistics.length - 1 && 'statistics-content-results-cards-row-stats-row-bordered'}`}>
                      <div className="statistics-content-results-cards-row-stats-row-stat">{statistic.stat}</div>
                      <div className="statistics-content-results-cards-row-stats-row-title">{statistic.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}