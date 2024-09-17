import { useState, useEffect, useRef } from 'react';
import { TFunction } from 'i18next';

import caretUpGrey from '/icons/caret-up-grey.svg';
import caretDownGrey from '/icons/caret-down-grey.svg';
import close from '/icons/close-red.svg';
import { useAppDispatch, useAppSelector } from '../../../../hooks/store';
import { setFooterVisibility } from '../../../../store/features/footer/footer.slice';
import Button from '../../Button/Button';
import Checkbox from '../../Checkbox/Checkbox';
import Tag from '../../Tag/Tag';
import './VolumesMobileModal.scss'

enum FILTERS_SECTION {
  TYPE = 'type',
  YEAR = 'year'
}

type VolumesTypeFilter = 'type' | 'year';

interface IVolumesTypeSelection {
  labelPath: string;
  value: string;
  isChecked: boolean;
}

interface IVolumesYearSelection {
  year: number;
  isSelected: boolean;
}

interface IVolumesFilter {
  type: VolumesTypeFilter;
  value: string | number;
  label?: number;
  labelPath?: string;
}

interface IVolumesMobileModalProps {
  t: TFunction<"translation", undefined>
  initialTypes: IVolumesTypeSelection[];
  onUpdateTypesCallback: (types: IVolumesTypeSelection[]) => void;
  initialYears: IVolumesYearSelection[];
  onUpdateYearsCallback: (years: IVolumesYearSelection[]) => void;
  onCloseCallback: () => void;
}

export default function VolumesMobileModal({ t, initialTypes, onUpdateTypesCallback, initialYears, onUpdateYearsCallback, onCloseCallback }: IVolumesMobileModalProps): JSX.Element {
  const dispatch = useAppDispatch();

  const isFooterEnabled = useAppSelector(state => state.footerReducer.enabled);

  const modalRef = useRef<HTMLDivElement>(null);

  const [openedSections, setOpenedSections] = useState<{ key: FILTERS_SECTION, isOpened: boolean }[]>([
    { key: FILTERS_SECTION.TYPE, isOpened: false },
    { key: FILTERS_SECTION.YEAR, isOpened: false }
  ]);

  const [types, setTypes] = useState<IVolumesTypeSelection[]>(initialTypes)
  const [years, setYears] = useState<IVolumesYearSelection[]>(initialYears)
  const [taggedFilters, setTaggedFilters] = useState<IVolumesFilter[]>([]);

  const onCheckType = (value: string): void => {
    const updatedTypes = types.map((t) => {
      if (t.value === value) {
        return { ...t, isChecked: !t.isChecked };
      }

      return { ...t };
    });

    setTypes(updatedTypes);
  }

  const onCheckYear = (value: number): void => {
    const updatedYears = years.map((y) => {
      if (y.year === value) {
        return { ...y, isSelected: !y.isSelected };
      }

      return { ...y };
    });

    setYears(updatedYears);
  }

  const setAllTaggedFilters = (): void => {
    const initFilters: IVolumesFilter[] = []

    types.filter((t) => t.isChecked).forEach((t) => {
      initFilters.push({
        type: 'type',
        value: t.value,
        labelPath: t.labelPath
      })
    })

    years.filter((y) => y.isSelected).forEach((y) => {
      initFilters.push({
        type: 'year',
        value: y.year,
        label: y.year
      })
    })

    setTaggedFilters(initFilters)
  }

  const onCloseTaggedFilter = (type: VolumesTypeFilter, value: string | number) => {
    if (type === 'type') {
      const updatedTypes = types.map((t) => {
        if (t.value === value) {
          return { ...t, isChecked: false };
        }

        return t;
      });

      setTypes(updatedTypes);
    } else if (type === 'year') {
      const updatedYears = years.map((y) => {
        if (y.year === value) {
          return { ...y, isSelected: false };
        }
  
        return y;
      });
  
      setYears(updatedYears);
    }
  }

  const clearTaggedFilters = (): void => {
    const updatedTypes = types.map((t) => {
      return { ...t, isChecked: false };
    });

    const updatedYears = years.map((y) => {
      return { ...y, isSelected: false };
    });

    setTypes(updatedTypes);
    setYears(updatedYears);
    setTaggedFilters([]);
  }

  const onClose = (): void => {
    clearTaggedFilters();
    onCloseCallback();
    dispatch(setFooterVisibility(true))
  }

  const onApplyFilters = (): void => {
    onUpdateTypesCallback(types);
    onUpdateYearsCallback(years);
    onCloseCallback();
    dispatch(setFooterVisibility(true))
  }

  useEffect(() => {
    setAllTaggedFilters()
  }, [types, years])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    if (isFooterEnabled) {
      dispatch(setFooterVisibility(false))
    }
  }, [isFooterEnabled]);

  const toggleSection = (sectionKey: FILTERS_SECTION) => {
    const updatedSections = openedSections.map((section) => {
      if (section.key === sectionKey) {
        return { ...section, isOpened: !section.isOpened };
      }

      return { ...section };
    });

    setOpenedSections(updatedSections);
  }

  const isOpenedSection = (sectionKey: FILTERS_SECTION): boolean | undefined => openedSections.find(section => section.key === sectionKey)?.isOpened

  return (
    <div className='volumesMobileModal' ref={modalRef}>
      <div className='volumesMobileModal-title'>
        <div className='volumesMobileModal-title-text'>{t('common.filters.filter')}</div>
        <img className='volumesMobileModal-title-close' src={close} alt='Close icon' onClick={onClose} />
      </div>
      {taggedFilters.length > 0 && (
        <div className="volumesMobileModal-tags">
          <div className="volumesMobileModal-tags-row">
            {taggedFilters.map((filter, index) => (
              <Tag key={index} text={filter.labelPath ? t(filter.labelPath) : filter.label!.toString()} onCloseCallback={(): void => onCloseTaggedFilter(filter.type, filter.value)}/>
            ))}
          </div>
          <div className="volumesMobileModal-tags-clear" onClick={clearTaggedFilters}>{t('common.filters.clearAll')}</div>
        </div>
      )}
      <div className='volumesMobileModal-filters'>
        <div className='volumesMobileModal-filters-types'>
          <div className='volumesMobileModal-filters-types-title'>
            <div className='volumesMobileModal-filters-types-title-text' onClick={(): void => toggleSection(FILTERS_SECTION.TYPE)}>{t('common.filters.documentTypes')}</div>
            <img className='volumesMobileModal-filters-types-title-caret' src={isOpenedSection(FILTERS_SECTION.TYPE) ? caretUpGrey : caretDownGrey} alt={isOpenedSection(FILTERS_SECTION.TYPE) ? 'Caret up icon' : 'Caret down icon'} onClick={(): void => toggleSection(FILTERS_SECTION.TYPE)} />
          </div>
          <div className={`volumesMobileModal-filters-types-list ${isOpenedSection(FILTERS_SECTION.TYPE) && 'volumesMobileModal-filters-types-list-opened'}`}>
            {types.map((type, index) => (
              <div
                key={index}
                className='volumesMobileModal-filters-types-list-choice'
              >
                <div className='volumesMobileModal-filters-types-list-choice-checkbox'>
                  <Checkbox checked={type.isChecked} onChangeCallback={(): void => onCheckType(type.value)}/>
                </div>
                <span
                  className={`volumesMobileModal-filters-types-list-choice-label ${type.isChecked && 'volumesMobileModal-filters-types-list-choice-label-checked'}`}
                  onClick={(): void => onCheckType(type.value)}
                >
                  {t(type.labelPath)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className='volumesMobileModal-filters-years'>
          <div className='volumesMobileModal-filters-years-title'>
            <div className='volumesMobileModal-filters-years-title-text' onClick={(): void => toggleSection(FILTERS_SECTION.YEAR)}>{t('common.filters.years')}</div>
            <img className='volumesMobileModal-filters-years-title-caret' src={isOpenedSection(FILTERS_SECTION.YEAR) ? caretUpGrey : caretDownGrey} alt={isOpenedSection(FILTERS_SECTION.YEAR) ? 'Caret up icon' : 'Caret down icon'} onClick={(): void => toggleSection(FILTERS_SECTION.YEAR)} />
          </div>
          <div className={`volumesMobileModal-filters-years-list ${isOpenedSection(FILTERS_SECTION.YEAR) && 'volumesMobileModal-filters-years-list-opened'}`}>
            {years.map((y, index) => (
              <div
                key={index}
                className='volumesMobileModal-filters-years-list-choice'
              >
                <div className='volumesMobileModal-filters-years-list-choice-checkbox'>
                  <Checkbox checked={y.isSelected} onChangeCallback={(): void => onCheckYear(y.year)}/>
                </div>
                <span
                  className={`volumesMobileModal-filters-years-list-choice-label ${y.isSelected && 'volumesMobileModal-filters-years-list-choice-label-checked'}`}
                  onClick={(): void => onCheckYear(y.year)}
                >
                  {y.year}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='volumesMobileModal-submit'>
        <Button text={t('common.filters.applyFilters')} onClickCallback={(): void => onApplyFilters()} />
      </div>
    </div>
  )
}