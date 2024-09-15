import { useState, useEffect, useRef } from 'react';
import { TFunction } from 'i18next';

import caretUpGrey from '/icons/caret-up-grey.svg';
import caretDownGrey from '/icons/caret-down-grey.svg';
import close from '/icons/close-red.svg';
import Button from '../../Button/Button';
import Checkbox from '../../Checkbox/Checkbox';
import './NewsMobileModal.scss'

enum FILTERS_SECTION {
  YEAR = 'year'
}

interface INewsYearSelection {
  year: number;
  isSelected: boolean;
}

interface INewsMobileModalProps {
  t: TFunction<"translation", undefined>
  years: INewsYearSelection[];
  onUpdateYearsCallback: (years: INewsYearSelection[]) => void;
  onCloseCallback: () => void;
}

export default function NewsMobileModal({ t, years, onUpdateYearsCallback, onCloseCallback }: INewsMobileModalProps): JSX.Element {
  const modalRef = useRef<HTMLDivElement>(null);

  const [openedSections, setOpenedSections] = useState<{ key: FILTERS_SECTION, isOpened: boolean }[]>([
    { key: FILTERS_SECTION.YEAR, isOpened: true }
  ]);

  const [filtersYears, setFiltersYears] = useState<INewsYearSelection[]>(years);

  const onSelectYear = (year: number): void => {
    const updatedYears = filtersYears.map((y) => {
      if (y.year === year) {
        return { ...y, isSelected: !y.isSelected };
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
    <div className='newsMobileModal' ref={modalRef}>
      <div className='newsMobileModal-title'>
        <div className='newsMobileModal-title-text'>{t('common.filters.filter')}</div>
        <img className='newsMobileModal-title-close' src={close} alt='Close icon' onClick={onClose} />
      </div>
      <div className='newsMobileModal-filters'>
        <div className='newsMobileModal-filters-years'>
          <div className='newsMobileModal-filters-years-title'>
            <div className='newsMobileModal-filters-years-title-text'>{t('common.filters.years')}</div>
            <img className='newsMobileModal-filters-years-title-caret' src={isOpenedSection(FILTERS_SECTION.YEAR) ? caretUpGrey : caretDownGrey} alt={isOpenedSection(FILTERS_SECTION.YEAR) ? 'Caret up icon' : 'Caret down icon'} onClick={(): void => toggleSection(FILTERS_SECTION.YEAR)} />
          </div>
          <div className={`newsMobileModal-filters-years-list ${isOpenedSection(FILTERS_SECTION.YEAR) && 'newsMobileModal-filters-years-list-opened'}`}>
            {filtersYears.map((y, index) => (
                <div
                  key={index}
                  className='newsMobileModal-filters-years-list-choice'
                >
                  <div className='newsMobileModal-filters-years-list-choice-checkbox'>
                    <Checkbox checked={y.isSelected} onChangeCallback={(): void => onSelectYear(y.year)}/>
                  </div>
                  <span
                    className={`newsMobileModal-filters-years-list-choice-label ${y.isSelected && 'newsMobileModal-filters-years-list-choice-label-selected'}`}
                    onClick={(): void => onSelectYear(y.year)}
                  >
                    {y.year}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className='newsMobileModal-submit'>
        <Button text={t('common.filters.applyFilters')} onClickCallback={(): void => onApplyFilters()} />
      </div>
    </div>
  )
}