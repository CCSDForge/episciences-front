import { TFunction, i18n } from 'i18next';

import { IStat } from '../../../../types/stat';
import { statTypes } from '../../../../utils/stat';
import './StatisticsSection.scss'

interface IStatisticsSectionProps {
  t: TFunction<"translation", undefined>;
  i18n: i18n;
  stats: IStat[];
}

export default function StatisticsSection({ t, i18n, stats }: IStatisticsSectionProps): JSX.Element {
  return (
    <div className="statisticsSection">
      {stats.map((singleStat, index) => (
        <div key={index} className='statisticsSection-row'>
          <div className='statisticsSection-row-content'>
            {singleStat.unit ? (
              <div className="statisticsSection-row-content-stat">{singleStat.value} {i18n.exists(`common.${singleStat.unit}`) ? t(`common.${singleStat.unit}`) : singleStat.unit}</div>
            ) : (
              <div className="statisticsSection-row-content-stat">{singleStat.value}</div>
            )}
            <div className="statisticsSection-row-content-title">{t(statTypes.find(stat => stat.value === singleStat.name)?.labelPath!)}</div>
          </div>
          <div className={`${index !== stats.length - 1 && 'statisticsSection-row-border'}`}></div>
        </div>
      ))}
    </div>
  )
}