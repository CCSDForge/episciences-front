import { useState, useEffect } from "react";

import filter from '/icons/filter.svg';
import listRed from '/icons/list-red.svg';
import listGrey from '/icons/list-grey.svg';
import tileRed from '/icons/tile-red.svg';
import tileGrey from '/icons/tile-grey.svg';
import { useAppSelector } from "../../../hooks/store";
import { useFetchVolumesQuery, useFetchVolumesRangeQuery } from '../../../store/features/volume/volume.query';
import { RENDERING_MODE } from '../../../utils/card';
import { volumeTypes } from '../../../utils/types';
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
  const VOLUMES_PER_PAGE = 10;

  const language = useAppSelector(state => state.i18nReducer.language)
  const rvid = useAppSelector(state => state.journalReducer.currentJournal?.id)
  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code)

  const [currentPage, setCurrentPage] = useState(1);
  const [mode, setMode] = useState<RENDERING_MODE>(RENDERING_MODE.LIST);
  const [types, setTypes] = useState<IVolumeTypeSelection[]>([]);
  const [years, setYears] = useState<IVolumeYearSelection[]>([]);
  const [taggedFilters, setTaggedFilters] = useState<IVolumeFilter[]>([]);
  const [openedFiltersModal, setOpenedFiltersModal] = useState(false);

  const { data: volumes, isFetching: isFetchingVolumes } = useFetchVolumesQuery({ rvid: rvid!, page: currentPage, itemsPerPage: VOLUMES_PER_PAGE, year: years.find(y => y.isSelected)?.year, type: types.find(t => t.isChecked)?.value }, { skip: !rvid })
  const { data: range, isFetching: isFetchingRange } = useFetchVolumesRangeQuery({ rvcode: rvcode! }, { skip: !rvcode })

  useEffect(() => {
    if (range && types.length === 0) {
      const initTypes = range.types
        .filter((t) => volumeTypes.find((vt) => vt.value === t))
        .map((t) => {
        const matchingType = volumeTypes.find((vt) => vt.value === t)

        return {
          label: matchingType!.label,
          value: matchingType!.value,
          isChecked: false
        }
      })

      setTypes(initTypes)
    }
  }, [range, types])

  useEffect(() => {
    if (range && years.length === 0) {
      const initYears = range.years.map((y) => ({
        year: y,
        isSelected: false
      }))

      setYears(initYears)
    }
  }, [range, years])

  const handlePageClick = (selectedItem: { selected: number }): void => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const onCheckType = (value: string): void => {
    const updatedTypes = types.map((t) => {
      if (t.value === value) {
        return { ...t, isChecked: !t.isChecked };
      }

      return { ...t, isChecked: false };
    });

    setTypes(updatedTypes);
  }

  const onSelectYear = (year: number): void => {
    const updatedYears = years.map((y) => {
      if (y.year === year) {
        return { ...y, isSelected: !y.isSelected };
      }

      return { ...y, isSelected: false };
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
      <Breadcrumb />
      <div className='volumes-title'>
        <h1>Volumes</h1>
        <div className='volumes-title-count'>
          {mode === RENDERING_MODE.LIST ? (
            volumes && volumes.totalItems > 1 ? (
              <div className='volumes-title-count-text'>{volumes.totalItems} volumes</div>
            ) : (
              <div className='volumes-title-count-text'>{volumes?.totalItems ?? 0} volume</div>
            )
          ) : <div className='volumes-title-count-text'></div>}
          <div className='volumes-title-count-icons'>
            <div className='volumes-title-count-icons-icon' onClick={(): void => setMode(RENDERING_MODE.TILE)}>
              <div className={`${mode === RENDERING_MODE.TILE ? 'volumes-title-count-icons-icon-row-red' : 'volumes-title-count-icons-icon-row'}`}>
                <img src={mode === RENDERING_MODE.TILE ? tileRed : tileGrey} alt='Tile icon' />
                <span>Tile</span>
              </div>
            </div>
            <div className='volumes-title-count-icons-icon' onClick={(): void => setMode(RENDERING_MODE.LIST)}>
              <div className={`${mode === RENDERING_MODE.LIST ? 'volumes-title-count-icons-icon-row-red' : 'volumes-title-count-icons-icon-row'}`}>
                <img src={mode === RENDERING_MODE.LIST ? listRed : listGrey} alt='List icon' />
                <span>List</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {mode === RENDERING_MODE.TILE && (
        volumes && volumes.totalItems > 1 ? (
          <div className='volumes-title-count-text volumes-title-count-text-tiles'>{volumes.totalItems} volumes</div>
        ) : (
          <div className='volumes-title-count-text volumes-title-count-text-tiles'>{volumes?.totalItems ?? 0} volume</div>
        )
      )}
      {mode === RENDERING_MODE.LIST ? (
        <div className='volumes-filters'>
          <div className="volumes-filters-tags">
            {taggedFilters.map((filter, index) => (
              <Tag key={index} text={filter.label.toString()} onCloseCallback={(): void => onCloseTaggedFilter(filter.type, filter.value)}/>
            ))}
            <div className="volumes-filters-tags-clear" onClick={clearTaggedFilters}>Clear all filters</div>
          </div>
        </div>
      ) : (
        <div className='volumes-filters volumes-filters-tiles'>
          <div className="volumes-filters-tags">
            <div className="volumes-filters-tags-filterTile" onClick={(): void => toggleFiltersModal()}>
              <img className="volumes-filters-tags-filterTile-icon" src={filter} alt='List icon' />
              <div className="volumes-filters-tags-filterTile-text">{taggedFilters.length > 0 ? `Editer les filtres (${taggedFilters.length})` : 'Filtrer'}</div>
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
          {(isFetchingVolumes || isFetchingRange) ? (
            <Loader />
          ) : (
            <div className={`volumes-content-results-cards ${mode === RENDERING_MODE.TILE && 'volumes-content-results-cards-tiles'}`}>
              {volumes?.data.map((volume, index) => (
                <VolumeCard
                  key={index}
                  language={language}
                  mode={mode}
                  volume={volume}
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