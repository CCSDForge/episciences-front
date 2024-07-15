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
  const COLORS = ['#9A312C', '#C9605B', '#FF9994', '#FFC9C7'];

  return (
    <div className='pieChart'>
      <ResponsiveContainer>
        <RechartsPieChart>
          <Pie dataKey="count" data={data}>
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </RechartsPieChart>
      </ResponsiveContainer>
      <div className='pieChart-legend'>
        {data.map((d, index) => (
          <div key={index} className='pieChart-legend-row'>
            <div className='pieChart-legend-row-square' style={{ backgroundColor: COLORS[index % COLORS.length]}}></div>
            <div>{`${d.count} ${t(`pages.statistics.statuses.${d.status}`)}`}</div>
          </div>
        ))}
      </div>
    </div>
  )
}