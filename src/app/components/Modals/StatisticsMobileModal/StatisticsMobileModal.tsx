import { useState, useEffect, useRef } from 'react';
import { TFunction } from 'i18next';

import caretUpGrey from '/icons/caret-up-grey.svg';
import caretDownGrey from '/icons/caret-down-grey.svg';
import close from '/icons/close-red.svg';
import Checkbox from '../../Checkbox/Checkbox';
import './StatisticsMobileModal.scss'
import Button from '../../Button/Button';

enum FILTERS_SECTION {
  YEAR = 'year'
}

interface IStatisticYearSelection {
  year: number;
  isChecked: boolean;
}

interface IStatisticsMobileModalProps {
  t: TFunction<"translation", undefined>
  years: IStatisticYearSelection[];
  onUpdateYearsCallback: (years: IStatisticYearSelection[]) => void;
  onCloseCallback: () => void;
}

export default function StatisticsMobileModal({ t, years, onUpdateYearsCallback, onCloseCallback }: IStatisticsMobileModalProps): JSX.Element {
  const modalRef = useRef<HTMLDivElement>(null);

  const [openedSections, setOpenedSections] = useState<{ key: FILTERS_SECTION, isOpened: boolean }[]>([
    { key: FILTERS_SECTION.YEAR, isOpened: true }
  ]);

  const [filtersYears, setFiltersYears] = useState<IStatisticYearSelection[]>(years);

  const onCheckYear = (year: number): void => {
    const updatedYears = filtersYears.map((y) => {
      if (y.year === year) {
        return { ...y, isChecked: !y.isChecked };
      }

      return { ...y };
    });

    setFiltersYears(updatedYears);
  }

  const onClose = (): void => {
    setFiltersYears([]);
    onCloseCallback();
  }

  const onApplyFilters = (): void => {
    onUpdateYearsCallback(filtersYears);
    onCloseCallback();
  }

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
    <div className='statisticsMobileModal' ref={modalRef}>
      <div className='statisticsMobileModal-title'>
        <div className='statisticsMobileModal-title-text'>{t('common.filters.filter')}</div>
        <img className='statisticsMobileModal-title-close' src={close} alt='Close icon' onClick={onClose} />
      </div>
      <div className='statisticsMobileModal-filters'>
        <div className='statisticsMobileModal-filters-years'>
          <div className='statisticsMobileModal-filters-years-title'>
            <div className='statisticsMobileModal-filters-years-title-text'>{t('common.filters.years')}</div>
            <img className='statisticsMobileModal-filters-years-title-caret' src={isOpenedSection(FILTERS_SECTION.YEAR) ? caretUpGrey : caretDownGrey} alt={isOpenedSection(FILTERS_SECTION.YEAR) ? 'Caret up icon' : 'Caret down icon'} onClick={(): void => toggleSection(FILTERS_SECTION.YEAR)} />
          </div>
          <div className={`statisticsMobileModal-filters-years-list ${isOpenedSection(FILTERS_SECTION.YEAR) && 'statisticsMobileModal-filters-years-list-opened'}`}>
            {filtersYears.map((y, index) => (
              <div
                key={index}
                className='statisticsMobileModal-filters-years-list-choice'
              >
                <div className='statisticsMobileModal-filters-years-list-choice-checkbox'>
                  <Checkbox checked={y.isChecked} onChangeCallback={(): void => onCheckYear(y.year)}/>
                </div>
                <span
                  className={`statisticsMobileModal-filters-years-list-choice-label ${y.isChecked && 'statisticsMobileModal-filters-years-list-choice-label-checked'}`}
                  onClick={(): void => onCheckYear(y.year)}
                >
                  {y.year}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='statisticsMobileModal-submit'>
        <Button text={t('common.filters.applyFilters')} onClickCallback={(): void => onApplyFilters()} />
      </div>
    </div>
  )
}