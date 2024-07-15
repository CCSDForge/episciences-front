import { TFunction } from 'i18next';
import {
	Cell,
	Pie,
	PieChart as RechartsPieChart,
  ResponsiveContainer,
} from 'recharts';

import { IStatValueDetailsAsPieChart } from '../../../../types/stat';
import './PieChart.scss'

interface IPieChartProps {
  t: TFunction<"translation", undefined>
  data: IStatValueDetailsAsPieChart[];
}

export default function PieChart({ t, data }: IPieChartProps): JSX.Element {
  const CHART_COLORS = ['#9A312C', '#C9605B', '#FF9994', '#FFC9C7'];

  const getLegend = (): JSX.Element => {
    const notBeingToPublishStatuses = data.filter(singleData => !singleData.isBeingToPublishStatus)
    const beingToPublishStatuses = data.filter(singleData => singleData.isBeingToPublishStatus)

    return (
      <div className='pieChart-legend'>
        <div className='pieChart-legend-rows'>
          {notBeingToPublishStatuses.map((singleData, index) => getLegendRow(singleData, index, CHART_COLORS.slice(0, 2)))}
        </div>
        <div className='pieChart-legend-category'>{t('pages.statistics.statuses.beingPublished')}</div>
        <div className='pieChart-legend-rows'>
          {beingToPublishStatuses.map((singleData, index) => getLegendRow(singleData, index, CHART_COLORS.slice(2, 4)))}
        </div>
      </div>
    )
  }

  const getLegendRow = (singleData: IStatValueDetailsAsPieChart, index: number, colors: string[]): JSX.Element => {
    return (
      <div key={index} className='pieChart-legend-rows-row'>
        <div className='pieChart-legend-rows-row-square' style={{ backgroundColor: colors[index % colors.length]}}></div>
        <div>{`${singleData.count} ${t(`pages.statistics.statuses.${singleData.status}`)}`}</div>
      </div>
    )
  }

  return (
    <div className='pieChart'>
      <ResponsiveContainer>
        <RechartsPieChart>
          <Pie dataKey="count" data={data}>
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Pie>
        </RechartsPieChart>
      </ResponsiveContainer>
      {getLegend()}
    </div>
  )
}