import { TFunction } from 'i18next';

import Checkbox from '../../Checkbox/Checkbox';
import './SearchResultsSidebar.scss'
import { AvailableLanguage } from '../../../../utils/i18n';

export interface ISearchResultTypeSelection {
  labelPath: string;
  value: string;
  isChecked: boolean;
}

export interface ISearchResultYearSelection {
  year: number;
  isChecked: boolean;
}

export interface ISearchResultVolumeSelection {
  id: number;
  label: string;
  isChecked: boolean;
}

export interface ISearchResultSectionSelection {
  id: number;
  label: string;
  isChecked: boolean;
}

interface ISearchResultsSidebarProps {
  language: AvailableLanguage;
  t: TFunction<"translation", undefined>;
  types: ISearchResultTypeSelection[];
  onCheckTypeCallback: (value: string) => void;
  years: ISearchResultYearSelection[];
  onCheckYearCallback: (year: number) => void;
  volumes: Record<AvailableLanguage, ISearchResultVolumeSelection[]>;
  onCheckVolumeCallback: (id: number) => void;
  sections: Record<AvailableLanguage, ISearchResultSectionSelection[]>;
  onCheckSectionCallback: (id: number) => void;
}

export default function SearchResultsSidebar({ language, t, types, onCheckTypeCallback, years, onCheckYearCallback, volumes, onCheckVolumeCallback, sections, onCheckSectionCallback }: ISearchResultsSidebarProps): JSX.Element {
  return (
    <div className='searchResultsSidebar'>
      <div className='searchResultsSidebar-typesSection'>
        <div className='searchResultsSidebar-typesSection-title'>{t('common.filters.documentTypes')}</div>
        <div className='searchResultsSidebar-typesSection-types'>
          {types.map((type, index) => (
            <div
              key={index}
              className='searchResultsSidebar-typesSection-types-choice'
            >
              <div className='searchResultsSidebar-typesSection-types-choice-checkbox'>
                <Checkbox checked={type.isChecked} onChangeCallback={(): void => onCheckTypeCallback(type.value)}/>
              </div>
              <span
                className={`searchResultsSidebar-typesSection-types-choice-label ${type.isChecked && 'searchResultsSidebar-typesSection-types-choice-label-checked'}`}
                onClick={(): void => onCheckTypeCallback(type.value)}
              >
                {t(type.labelPath)}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className='searchResultsSidebar-yearsSection'>
        <div className='searchResultsSidebar-yearsSection-title'>{t('common.filters.years')}</div>
        <div className='searchResultsSidebar-yearsSection-years'>
          <div className='searchResultsSidebar-yearsSection-years-list'>
            {years.map((y, index) => (
              <div
                key={index}
                className='searchResultsSidebar-yearsSection-years-list-choice'
              >
                <div className='searchResultsSidebar-yearsSection-years-list-choice-checkbox'>
                  <Checkbox checked={y.isChecked} onChangeCallback={(): void => onCheckYearCallback(y.year)}/>
                </div>
                <span
                  className={`searchResultsSidebar-yearsSection-years-list-choice-label ${y.isChecked && 'searchResultsSidebar-yearsSection-years-list-choice-label-checked'}`}
                  onClick={(): void => onCheckYearCallback(y.year)}
                >
                  {y.year}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='searchResultsSidebar-volumesSection'>
        <div className='searchResultsSidebar-volumesSection-title'>{t('common.filters.volumes')}</div>
        <div className='searchResultsSidebar-volumesSection-volumes'>
          <div className='searchResultsSidebar-volumesSection-volumes-list'>
            {volumes[language].map((v, index) => (
              <div
                key={index}
                className='searchResultsSidebar-volumesSection-volumes-list-choice'
              >
                <div className='searchResultsSidebar-volumesSection-volumes-list-choice-checkbox'>
                  <Checkbox checked={v.isChecked} onChangeCallback={(): void => onCheckVolumeCallback(v.id)}/>
                </div>
                <span
                  className={`searchResultsSidebar-volumesSection-volumes-list-choice-label ${v.isChecked && 'searchResultsSidebar-volumesSection-volumes-list-choice-label-checked'}`}
                  onClick={(): void => onCheckVolumeCallback(v.id)}
                >
                  {v.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='searchResultsSidebar-sectionsSection'>
        <div className='searchResultsSidebar-sectionsSection-title'>{t('common.filters.sections')}</div>
        <div className='searchResultsSidebar-sectionsSection-sections'>
          <div className='searchResultsSidebar-sectionsSection-sections-list'>
            {sections[language].map((s, index) => (
              <div
                key={index}
                className='searchResultsSidebar-sectionsSection-sections-list-choice'
              >
                <div className='searchResultsSidebar-sectionsSection-sections-list-choice-checkbox'>
                  <Checkbox checked={s.isChecked} onChangeCallback={(): void => onCheckSectionCallback(s.id)}/>
                </div>
                <span
                  className={`searchResultsSidebar-sectionsSection-sections-list-choice-label ${s.isChecked && 'searchResultsSidebar-sectionsSection-sections-list-choice-label-checked'}`}
                  onClick={(): void => onCheckSectionCallback(s.id)}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}