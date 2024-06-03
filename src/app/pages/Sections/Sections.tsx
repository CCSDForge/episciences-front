import { useState, useEffect } from "react";

import listRed from '/icons/list-red.svg';
import listGrey from '/icons/list-grey.svg';
import tileRed from '/icons/tile-red.svg';
import tileGrey from '/icons/tile-grey.svg';
import { useAppSelector } from "../../../hooks/store";
import { useFetchSectionsQuery } from '../../../store/features/section/section.query';
import { sectionTypes } from '../../../utils/types';
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Loader from '../../components/Loader/Loader';
import SectionCard from "../../components/Cards/SectionCard/SectionCard";
import SectionsSidebar, { ISectionTypeSelection } from "../../components/Sidebars/SectionsSidebar/SectionsSidebar";
import Pagination from "../../components/Pagination/Pagination";
import Tag from "../../components/Tag/Tag";
import './Sections.scss';

interface ISectionFilter {
  value: string | number;
  label: string | number;
}

export default function Sections(): JSX.Element {
  const SECTIONS_PER_PAGE = 10;

  const language = useAppSelector(state => state.i18nReducer.language)
  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code)

  const [currentPage, setCurrentPage] = useState(1);
  const [types, setTypes] = useState<ISectionTypeSelection[]>([]);
  const [taggedFilters, setTaggedFilters] = useState<ISectionFilter[]>([]);

  useEffect(() => {
    if (types.length === 0) {
      const initTypes = sectionTypes.map((s) => ({
        label: s.label,
        value: s.value,
        isChecked: false
      }))

      setTypes(initTypes)
    }
  }, [types])

  const { data: sections, isFetching } = useFetchSectionsQuery({ rvcode: rvcode!, page: currentPage, itemsPerPage: SECTIONS_PER_PAGE, type: types.find(t => t.isChecked)?.value }, { skip: !rvcode })

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

  const setAllTaggedFilters = (): void => {
    const initFilters: ISectionFilter[] = []

    types.filter((t) => t.isChecked).forEach((t) => {
      initFilters.push({
        value: t.value,
        label: t.label
      })
    })

    setTaggedFilters(initFilters)
  }

  const onCloseTaggedFilter = (value: string | number) => {
    const updatedTypes = types.map((t) => {
      if (t.value === value) {
        return { ...t, isChecked: false };
      }

      return t;
    });

    setTypes(updatedTypes);
  }

  const clearTaggedFilters = (): void => {
    const updatedTypes = types.map((t) => {
      return { ...t, isChecked: false };
    });

    setTypes(updatedTypes);
    setTaggedFilters([]);
  }

  useEffect(() => {
    setAllTaggedFilters()
  }, [types])

  return (
    <main className='sections'>
      <Breadcrumb />
      <h1 className='sections-title'>Sections</h1>
      <div className="sections-filters">
        <div className="sections-filters-tags">
          {taggedFilters.map((filter, index) => (
            <Tag key={index} text={filter.label.toString()} onCloseCallback={(): void => onCloseTaggedFilter(filter.value)}/>
          ))}
          <div className="sections-filters-tags-clear" onClick={clearTaggedFilters}>Clear all filters</div>
        </div>
      </div>
      <div className='sections-content'>
        <div className='sections-content-results'>
          <SectionsSidebar types={types} onCheckTypeCallback={onCheckType} />
          {isFetching ? (
            <Loader />
          ) : (
            <div className='sections-content-results-cards'>
              {sections?.data.map((section, index) => (
                <SectionCard
                  key={index}
                  language={language}
                  section={section}
                />
              ))}
            </div>
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          itemsPerPage={SECTIONS_PER_PAGE}
          totalItems={sections?.totalItems}
          onPageChange={handlePageClick}
        />
      </div>
    </main>
  )
}