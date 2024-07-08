import { IStat } from '../../../../types/stat';
import './StatisticsSection.scss'

interface IStatisticsSectionProps {
  stats: IStat[];
}

export default function StatisticsSection({ stats }: IStatisticsSectionProps): JSX.Element {
  return (
    <div className="statisticsSection">
      {stats.map((singleStat, index) => (
        <div key={index} className='statisticsSection-row'>
          <div className='statisticsSection-row-content'>
            <div className="statisticsSection-row-content-stat">{singleStat.stat}</div>
            <div className="statisticsSection-row-content-title">{singleStat.title}</div>
          </div>
          <div className={`${index !== stats.length - 1 && 'statisticsSection-row-border'}`}></div>
        </div>
      ))}
    </div>
  )
}