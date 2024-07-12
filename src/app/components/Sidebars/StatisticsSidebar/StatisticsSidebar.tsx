import { TFunction } from 'i18next';

import './StatisticsSidebar.scss'

export interface IStatisticsYearSelection {
  year: number;
  isSelected: boolean;
}

interface IStatisticsSidebarProps {
  t: TFunction<"translation", undefined>
  years: IStatisticsYearSelection[];
  onSelectYearCallback: (year: number) => void;
}

export default function StatisticsSidebar({ t, years, onSelectYearCallback }: IStatisticsSidebarProps): JSX.Element {
  return (
    <div className='statisticsSidebar'>
      <div className='statisticsSidebar-title'>{t('common.filters.years')}</div>
      <div className='statisticsSidebar-years'>
        <div className='statisticsSidebar-years-list'>
          {years.map((y) => (
            <div
              key={y.year}
              className={`statisticsSidebar-years-list-year ${y.isSelected && 'statisticsSidebar-years-list-year-selected'}`}
              onClick={(): void => onSelectYearCallback(y.year)}
            >
              {y.year}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}