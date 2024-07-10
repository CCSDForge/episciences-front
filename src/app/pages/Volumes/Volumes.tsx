import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';

import filter from '/icons/filter.svg';
import listRed from '/icons/list-red.svg';
import listGrey from '/icons/list-grey.svg';
import tileRed from '/icons/tile-red.svg';
import tileGrey from '/icons/tile-grey.svg';
import { useAppSelector } from "../../../hooks/store";
import { useFetchVolumesQuery } from '../../../store/features/volume/volume.query';
import { RENDERING_MODE } from '../../../utils/card';
import { volumeTypes } from '../../../utils/volume';
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Loader from '../../components/Loader/Loader';
import VolumeCard from "../../components/Cards/VolumeCard/VolumeCard";
import VolumesSidebar, { IVolumeTypeSelection, IVolumeYearSelection } from "../../components/Sidebars/VolumesSidebar/VolumesSidebar";
import VolumesModal from "../../components/Modals/VolumesModal/VolumesModal";
import Pagination from "../../components/Pagination/Pagination";
import Tag from "../../components/Tag/Tag";
import './Volumes.scss';

type VolumeTypeFilter = 'type' | 'year';

interface IVolumeFilter {
  type: VolumeTypeFilter;
  value: string | number;
  label: string | number;
}

export default function Volumes(): JSX.Element {
  const { t } = useTranslation();

  const VOLUMES_PER_PAGE = 10;

  const location = useLocation();
  const parsedQuery = queryString.parse(location.search);
  const translatedVolumeTypes = volumeTypes();

  const language = useAppSelector(state => state.i18nReducer.language)
  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code)
  const currentJournal = useAppSelector(state => state.journalReducer.currentJournal)

  const [currentPage, setCurrentPage] = useState(1);
  const [mode, setMode] = useState<RENDERING_MODE>(RENDERING_MODE.LIST);
  const [types, setTypes] = useState<IVolumeTypeSelection[]>([]);
  const [years, setYears] = useState<IVolumeYearSelection[]>([]);
  const [taggedFilters, setTaggedFilters] = useState<IVolumeFilter[]>([]);
  const [openedFiltersModal, setOpenedFiltersModal] = useState(false);
  const [initQueryFilters, setInitQueryFilters] = useState(false)

  const getSelectedTypes = (): string[] => types.filter(t => t.isChecked).map(t => t.value);
  const getSelectedYears = (): number[] => years.filter(y => y.isSelected).map(y => y.year);

  const { data: volumes, isFetching: isFetchingVolumes } = useFetchVolumesQuery({ rvcode: rvcode!, page: currentPage, itemsPerPage: VOLUMES_PER_PAGE, types: getSelectedTypes(), years: getSelectedYears() }, { skip: !rvcode, refetchOnMountOrArgChange: true })

  useEffect(() => {
    if (types.length > 0 && !initQueryFilters) {
      setTypes(currentTypes => {
        const newTypes = currentTypes.map(type => ({
            ...type,
            isChecked: parsedQuery.type === type.value
        }));
  
        return newTypes;
    });

      setInitQueryFilters(true)
    }
  }, [types, initQueryFilters])

  useEffect(() => {
    setTypes(currentTypes => {
        const newTypes = currentTypes.map(type => ({
            ...type,
            isChecked: parsedQuery.type === type.value
        }));

        const typesChanged = newTypes.some((type, index) => type.isChecked !== currentTypes[index].isChecked);
        return typesChanged ? newTypes : currentTypes;
    });
  }, [parsedQuery.type]); 

  useEffect(() => {
    if (volumes?.range && volumes.range.types && types.length === 0) {
      const initTypes = volumes.range.types
        .filter((t) => translatedVolumeTypes.find((vt) => vt.value === t))
        .map((t) => {
        const matchingType = translatedVolumeTypes.find((vt) => vt.value === t)

        return {
          label: matchingType!.label,
          value: matchingType!.value,
          isChecked: false
        }
      })

      setTypes(initTypes)
    }
  }, [volumes?.range, volumes?.range?.types, types])

  useEffect(() => {
    if (volumes?.range && volumes.range.years && years.length === 0) {
      const initYears = volumes.range.years.map((y) => ({
        year: y,
        isSelected: false
      }))

      setYears(initYears)
    }
  }, [volumes?.range, volumes?.range?.years, years])
  
  const handlePageClick = (selectedItem: { selected: number }): void => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const getVolumesCount = (mode: RENDERING_MODE): JSX.Element | null => {
    if (volumes) {
      if (volumes.totalItems > 1) {
        return <div className={`volumes-title-count-text volumes-title-count-text-volumes ${mode === RENDERING_MODE.TILE && 'volumes-title-count-text-tiles'}`}>{volumes.totalItems} {t('common.volumes')}</div>
      }
    
      return <div className={`volumes-title-count-text volumes-title-count-text-volumes ${mode === RENDERING_MODE.TILE && 'volumes-title-count-text-tiles'}`}>{volumes?.totalItems ?? 0} {t('common.volume')}</div>
    }

    return null
  }

  const getArticlesCount = (mode: RENDERING_MODE): JSX.Element | null => {
    if (volumes) {
      if (volumes.articlesCount && volumes.articlesCount > 1) {
        return <div className={`volumes-title-count-text volumes-title-count-text-articles ${mode === RENDERING_MODE.TILE && 'volumes-title-count-text-tiles'}`}>{volumes.articlesCount} {t('common.articles')}</div>
      }

      return <div className={`volumes-title-count-text volumes-title-count-text-articles ${mode === RENDERING_MODE.TILE && 'volumes-title-count-text-tiles'}`}>{volumes.articlesCount} {t('common.article')}</div>  
    }

    return null;
  }

  const onCheckType = (value: string): void => {
    const updatedTypes = types.map((t) => {
      if (t.value === value) {
        return { ...t, isChecked: !t.isChecked };
      }

      return { ...t };
    });

    setTypes(updatedTypes);
  }

  const onSelectYear = (year: number): void => {
    const updatedYears = years.map((y) => {
      if (y.year === year) {
        return { ...y, isSelected: !y.isSelected };
      }

      return { ...y };
    });

    setYears(updatedYears);
  }

  const setAllTaggedFilters = (): void => {
    const initFilters: IVolumeFilter[] = []

    types.filter((t) => t.isChecked).forEach((t) => {
      initFilters.push({
        type: 'type',
        value: t.value,
        label: t.label
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

  const onCloseTaggedFilter = (type: VolumeTypeFilter, value: string | number) => {
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

  const toggleFiltersModal = () => {
    if (mode === RENDERING_MODE.LIST) return

    setOpenedFiltersModal(!openedFiltersModal)
  }

  useEffect(() => {
    setAllTaggedFilters()
  }, [types, years])

  return (
    <main className='volumes'>
      <Breadcrumb parent={{ path: 'home', label: `${t('pages.home.title')} > ${t('common.content')} >` }} crumbLabel={t('pages.volumes.title')} />
      <div className='volumes-title'>
        <h1>{t('pages.volumes.title')}</h1>
        <div className='volumes-title-count'>
          {mode === RENDERING_MODE.LIST ? (
            <div className='volumes-title-count-wrapper'>
              {getVolumesCount(RENDERING_MODE.LIST)}
              {getArticlesCount(RENDERING_MODE.LIST)}
            </div>
          ) : <div className='volumes-title-count-text'></div>}
          <div className='volumes-title-count-icons'>
            <div className='volumes-title-count-icons-icon' onClick={(): void => setMode(RENDERING_MODE.TILE)}>
              <div className={`${mode === RENDERING_MODE.TILE ? 'volumes-title-count-icons-icon-row-red' : 'volumes-title-count-icons-icon-row'}`}>
                <img src={mode === RENDERING_MODE.TILE ? tileRed : tileGrey} alt='Tile icon' />
                <span>{t('common.renderingMode.tile')}</span>
              </div>
            </div>
            <div className='volumes-title-count-icons-icon' onClick={(): void => setMode(RENDERING_MODE.LIST)}>
              <div className={`${mode === RENDERING_MODE.LIST ? 'volumes-title-count-icons-icon-row-red' : 'volumes-title-count-icons-icon-row'}`}>
                <img src={mode === RENDERING_MODE.LIST ? listRed : listGrey} alt='List icon' />
                <span>{t('common.renderingMode.list')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {mode === RENDERING_MODE.TILE && (
        <div className='volumes-title-count-wrapper'>
          {getVolumesCount(RENDERING_MODE.TILE)}
          {getArticlesCount(RENDERING_MODE.TILE)}
        </div>
      )}
      {mode === RENDERING_MODE.LIST ? (
        <div className='volumes-filters'>
          <div className="volumes-filters-tags">
            {taggedFilters.map((filter, index) => (
              <Tag key={index} text={filter.label.toString()} onCloseCallback={(): void => onCloseTaggedFilter(filter.type, filter.value)}/>
            ))}
            <div className="volumes-filters-tags-clear" onClick={clearTaggedFilters}>{t('common.filters.clearAll')}</div>
          </div>
        </div>
      ) : (
        <div className='volumes-filters volumes-filters-tiles'>
          <div className="volumes-filters-tags">
            <div className="volumes-filters-tags-filterTile" onClick={(): void => toggleFiltersModal()}>
              <img className="volumes-filters-tags-filterTile-icon" src={filter} alt='List icon' />
              <div className="volumes-filters-tags-filterTile-text">{taggedFilters.length > 0 ? `${t('common.filters.editFilters')} (${taggedFilters.length})` : `${t('common.filters.filter')}`}</div>
            </div>
            {taggedFilters.map((filter, index) => (
              <Tag key={index} text={filter.label.toString()} onCloseCallback={(): void => onCloseTaggedFilter(filter.type, filter.value)}/>
            ))}
          </div>
          <div className="volumes-filters-modal">
            {openedFiltersModal && <VolumesModal types={types} onCheckTypeCallback={onCheckType} years={years} onSelectYearCallback={onSelectYear} onCloseCallback={(): void => setOpenedFiltersModal(false)}/>}
          </div>
        </div>
      )}
      <div className='volumes-content'>
        <div className='volumes-content-results'>
          {mode === RENDERING_MODE.LIST && (
            <VolumesSidebar types={types} onCheckTypeCallback={onCheckType} years={years} onSelectYearCallback={onSelectYear} />
          )}
          {isFetchingVolumes ? (
            <Loader />
          ) : (
            <div className={`volumes-content-results-cards ${mode === RENDERING_MODE.TILE && 'volumes-content-results-cards-tiles'}`}>
              {volumes?.data.map((volume, index) => (
                <VolumeCard
                  key={index}
                  language={language}
                  mode={mode}
                  volume={volume}
                  currentJournal={currentJournal}
                />
              ))}
            </div>
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          itemsPerPage={VOLUMES_PER_PAGE}
          totalItems={volumes?.totalItems}
          onPageChange={handlePageClick}
        />
      </div>
    </main>
  )
}