import { IStat } from '../../../../types/stat';
import './StatisticsSection.scss'

interface IStatisticsSectionProps {
  stats: IStat[];
}

export default function StatisticsSection({ stats }: IStatisticsSectionProps): JSX.Element {
  return (
    <div className="statisticsSection">
      {stats.map((singleStat, index) => (
        <div key={index} className={`statisticsSection-row ${index !== stats.length - 1 && 'statisticsSection-row-bordered'}`}>
          <div className="statisticsSection-row-stat">{singleStat.stat}</div>
          <div className="statisticsSection-row-title">{singleStat.title}</div>
        </div>
      ))}
    </div>
  )
}