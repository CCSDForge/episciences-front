import { useState } from "react";

import { IAuthor } from "../../../types/author";
import { useAppSelector } from "../../../hooks/store";
import { useFetchAuthorsQuery } from "../../../store/features/author/author.query";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import AuthorCard, { IAuthorCardProps } from "../../components/Cards/AuthorCard/AuthorCard";
import AuthorsSidebar from "../../components/Sidebars/AuthorsSidebar/AuthorsSidebar";
import AuthorDetailsSidebar from "../../components/Sidebars/AuthorDetailsSidebar/AuthorDetailsSidebar";
import Loader from '../../components/Loader/Loader';
import Pagination from "../../components/Pagination/Pagination";
import './Authors.scss';

export default function Authors(): JSX.Element {
  const AUTHORS_PER_PAGE = 10;

  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code)

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeLetter, setActiveLetter] = useState('');
  const [expandedAuthorIndex, setExpandedAuthorIndex] = useState(-1);

  const onSearch = (newSearch: string): void => setSearch(newSearch)
  const onSetActiveLetter = (newActiveLetter: string): void => setActiveLetter(newActiveLetter !== activeLetter ? newActiveLetter : '')

  const { data: authors, isFetching } = useFetchAuthorsQuery({ rvcode: rvcode!, page: currentPage, itemsPerPage: AUTHORS_PER_PAGE, search, letter: activeLetter }, { skip: !rvcode })

  const getExpandedAuthor = (): IAuthor | undefined => {
    if (expandedAuthorIndex === -1) {
      return
    }

    return authors?.data.find((_, index) => expandedAuthorIndex === index)
  }

  const onCloseDetails = (): void => {
    setExpandedAuthorIndex(-1)
  }

  const handlePageClick = (selectedItem: { selected: number }): void => {
    setCurrentPage(selectedItem.selected + 1);
  };

  return (
    <main className='authors'>
      <Breadcrumb />
      <h1 className='authors-title'>Authors</h1>
      <div className='authors-count'>17 Authors for B</div>
      <div className='authors-content'>
        <AuthorsSidebar onSearchCallback={onSearch} activeLetter={activeLetter} onSetActiveLetterCallback={onSetActiveLetter} />
        <div className='authors-content-results'>
          <div className='authors-content-results-paginationTop'>
          <Pagination
            currentPage={currentPage}
            itemsPerPage={AUTHORS_PER_PAGE}
            totalItems={authors?.totalItems}
            onPageChange={handlePageClick}
          />
          </div>
          {isFetching ? (
            <Loader />
          ) : (
            <div className='authors-content-results-cards'>
              {authors?.data.map((author, index) => (
                <AuthorCard
                  key={index}
                  {...author as IAuthorCardProps}
                  expandedCard={expandedAuthorIndex === index}
                  setExpandedAuthorIndexCallback={(): void => expandedAuthorIndex !== index ? setExpandedAuthorIndex(index) : setExpandedAuthorIndex(-1)}
                />
              ))}
            </div>
          )}
          <div className='authors-content-results-paginationBottom'>
            <Pagination
              currentPage={currentPage}
              itemsPerPage={AUTHORS_PER_PAGE}
              totalItems={authors?.totalItems}
              onPageChange={handlePageClick}
            />
          </div>
        </div>
      </div>
      {expandedAuthorIndex >= 0 && <AuthorDetailsSidebar {...getExpandedAuthor() as IAuthorCardProps} onCloseDetailsCallback={onCloseDetails} />}
    </main>
  )
}