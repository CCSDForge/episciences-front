import { useState, useEffect } from "react";

import listRed from '/icons/list-red.svg';
import listGrey from '/icons/list-grey.svg';
import tileRed from '/icons/tile-red.svg';
import tileGrey from '/icons/tile-grey.svg';
import { useAppSelector } from "../../../hooks/store";
import { useFetchVolumesQuery } from '../../../store/features/volume/volume.query';
import { RENDERING_MODE } from '../../../utils/card';
import { allYears, volumeTypes } from '../../../utils/filter';
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Loader from '../../components/Loader/Loader';
import VolumeCard, { IVolumeCard } from "../../components/Cards/VolumeCard/VolumeCard";
import VolumesSidebar, { IVolumeTypeSelection, IVolumeYearSelection } from "../../components/Sidebars/VolumesSidebar/VolumesSidebar";
import Pagination from "../../components/Pagination/Pagination";
import Tag from "../../components/Tag/Tag";
import './Volumes.scss';

interface IVolumeFilter {
  type: 'type' | 'year',
  value: string | number;
  label: string | number;
}

export default function Volumes(): JSX.Element {
  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code)

  const [currentPage, setCurrentPage] = useState(1);
  const [mode, setMode] = useState(RENDERING_MODE.LIST);
  const [types, setTypes] = useState<IVolumeTypeSelection[]>([]);
  const [years, setYears] = useState<IVolumeYearSelection[]>([]);
  const [taggedFilters, setTaggedFilters] = useState<IVolumeFilter[]>([]);

  useEffect(() => {
    if (types.length === 0) {
      const initTypes = volumeTypes.map((v) => ({
        label: v.label,
        value: v.value,
        isChecked: false
      }))

      setTypes(initTypes)
    }
  }, [years])

  useEffect(() => {
    if (years.length === 0) {
      const initYears = allYears().map((y) => ({
        year: y,
        isSelected: false
      }))

      setYears(initYears)
    }
  }, [years])

  const { data: volumes, isFetching } = useFetchVolumesQuery({ rvcode: rvcode!, page: currentPage, year: years.find(y => y.isSelected)?.year, type: types.find(t => t.isChecked)?.value }, { skip: !rvcode })

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

  const onCloseTaggedFilter = (type: 'type' | 'year', value: string | number) => {
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

  const toggleAbstract = (volumeId: number): void => {
    // const updatedVolumes = volumes.map((volume) => {
    //   if (volume.id === volumeId) {
    //     return { ...volume, openedAbstract: !volume.openedAbstract };
    //   }

    //   return volume;
    // });

    // setVolumes(updatedVolumes);
  }

  useEffect(() => {
    setAllTaggedFilters()
  }, [types, years, taggedFilters])

  return (
    <main className='volumes'>
      <Breadcrumb />
      <div className='volumes-title'>
        <h1>Volumes</h1>
        <div className='volumes-title-count'>
          {volumes && volumes.totalItems > 1 ? (
            <div className='volumes-title-count-text'>{volumes.totalItems} volumes</div>
          ) : (
            <div className='volumes-title-count-text'>{volumes?.totalItems ?? 0} volume</div>
          )}
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
      <div className="volumes-filters">
        <div className="volumes-filters-tags">
          {taggedFilters.map((filter, index) => (
            <Tag key={index} text={filter.label.toString()} onCloseCallback={(): void => onCloseTaggedFilter(filter.type, filter.value)}/>
          ))}
          <div className="volumes-filters-tags-clear" onClick={clearTaggedFilters}>Clear all filters</div>
        </div>
      </div>
      <div className='volumes-content'>
        <div className='volumes-content-results'>
          <VolumesSidebar types={types} onCheckTypeCallback={onCheckType} years={years} onSelectYearCallback={onSelectYear} />
          {isFetching ? (
            <Loader />
          ) : (
            <div className='volumes-content-results-cards'>
              {volumes?.data.map((volume, index) => (
                <VolumeCard key={index} {...volume as IVolumeCard} toggleAbstractCallback={(): void => toggleAbstract(volume.id)} />
              ))}
            </div>
          )}
        </div>
        <Pagination totalItems={volumes?.totalItems} onPageChange={handlePageClick} />
      </div>
    </main>
  )
}