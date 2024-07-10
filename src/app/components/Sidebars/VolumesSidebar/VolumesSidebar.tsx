import { TFunction } from 'i18next';

import Checkbox from '../../Checkbox/Checkbox';
import './VolumesSidebar.scss'

export interface IVolumeTypeSelection {
  label: string;
  value: string;
  isChecked: boolean;
}

export interface IVolumeYearSelection {
  year: number;
  isSelected: boolean;
}

interface IVolumesSidebarProps {
  t: TFunction<"translation", undefined>
  types: IVolumeTypeSelection[];
  onCheckTypeCallback: (value: string) => void;
  years: IVolumeYearSelection[];
  onSelectYearCallback: (year: number) => void;
}

export default function VolumesSidebar({ t, types, onCheckTypeCallback, years, onSelectYearCallback }: IVolumesSidebarProps): JSX.Element {
  return (
    <div className='volumesSidebar'>
      <div className='volumesSidebar-typesSection'>
        <div className='volumesSidebar-typesSection-title'>{t('common.filters.volumeTypes')}</div>
        <div className='volumesSidebar-typesSection-types'>
          {types.map((t, index) => (
            <div
              key={index}
              className='volumesSidebar-typesSection-types-choice'
            >
              <div className='volumesSidebar-typesSection-types-choice-checkbox'>
                <Checkbox checked={t.isChecked} onChangeCallback={(): void => onCheckTypeCallback(t.value)}/>
              </div>
              <span
                className={`volumesSidebar-typesSection-types-choice-label ${t.isChecked && 'volumesSidebar-typesSection-types-choice-label-checked'}`}
                onClick={(): void => onCheckTypeCallback(t.value)}
              >
                {t.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className='volumesSidebar-yearsSection'>
        <div className='volumesSidebar-yearsSection-title'>{t('common.filters.years')}</div>
        <div className='volumesSidebar-yearsSection-years'>
          <div className='volumesSidebar-yearsSection-years-list'>
            {years.map((y) => (
              <div
                key={y.year}
                className={`volumesSidebar-yearsSection-years-list-year ${y.isSelected && 'volumesSidebar-yearsSection-years-list-year-selected'}`}
                onClick={(): void => onSelectYearCallback(y.year)}
              >
                {y.year}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}