import { useState } from "react";

import { useAppSelector } from "../../../hooks/store";
import { useFetchSectionsQuery } from '../../../store/features/section/section.query';
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Loader from '../../components/Loader/Loader';
import SectionCard from "../../components/Cards/SectionCard/SectionCard";
import SectionsSidebar from '../../components/Sidebars/SectionsSidebar/SectionsSidebar'
import Pagination from "../../components/Pagination/Pagination";
import './Sections.scss';

export default function Sections(): JSX.Element {
  const SECTIONS_PER_PAGE = 10;

  const language = useAppSelector(state => state.i18nReducer.language)
  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code)

  const [currentPage, setCurrentPage] = useState(1);

  const { data: sections, isFetching } = useFetchSectionsQuery({ rvcode: rvcode!, page: currentPage, itemsPerPage: SECTIONS_PER_PAGE }, { skip: !rvcode })

  const handlePageClick = (selectedItem: { selected: number }): void => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const getSectionsCount = (): JSX.Element | null => {
    if (sections) {
      if (sections.totalItems > 1) {
        return <div className='sections-title-count-text sections-title-count-text-sections'>{sections.totalItems} sections</div>
      }

      return <div className='sections-title-count-text sections-title-count-text-sections'>{sections.totalItems} section</div>  
    }

    return null;
  }

  const getArticlesCount = (): JSX.Element | null => {
    if (sections && sections.articlesCount) {
      if (sections.articlesCount > 1) {

        return <div className='sections-title-count-text sections-title-count-text-articles'>{sections.articlesCount} articles</div>
      }

      return <div className='sections-title-count-text sections-title-count-text-articles'>{sections.articlesCount} article</div>  
    }

    return null;
  }

  return (
    <main className='sections'>
      <Breadcrumb />
      <div className='sections-title'>
        <h1>Sections</h1>
        <div className='sections-title-count'>
          {getSectionsCount()}
          {getArticlesCount()}
        </div>
      </div>
      <div className="sections-filters"></div>
      <div className='sections-content'>
        <div className='sections-content-results'>
          <SectionsSidebar />
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