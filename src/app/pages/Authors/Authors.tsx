import { useState } from "react";

import usePagination, { PaginatedResults } from "../../../hooks/pagination";
import { IAuthor } from "../../../types/author";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import AuthorCard, { IAuthorCardProps } from "../../components/Cards/AuthorCard/AuthorCard";
import AuthorSidebar from "../../components/Sidebars/AuthorSidebar/AuthorSidebar";
import Pagination from "../../components/Pagination/Pagination";
import './Authors.scss';
import AuthorDetails from "../../components/AuthorDetails/AuthorDetails";

export default function Authors(): JSX.Element {
  const [search, setSearch] = useState('');
  const [activeLetter, setActiveLetter] = useState('');
  const [expandedAuthorIndex, setExpandedAuthorIndex] = useState(-1);

  // TODO: remove mocks
  const [authors, setAuthors] = useState<IAuthor[]>([
    { 
      id: 1,
      name: 'Baele Stéphane',
      university: 'University of Oxford, United Kingdom',
      articlesCount: 2,
    },
    { 
      id: 2,
      name: 'Baele Stéphane',
      university: 'University of Oxford, United Kingdom',
      articlesCount: 2,
    },
    { 
      id: 3,
      name: 'Baele Stéphane',
      university: 'University of Oxford, United Kingdom',
      articlesCount: 2,
    },
    { 
      id: 4,
      name: 'Baele Stéphane',
      university: 'University of Oxford, United Kingdom',
      articlesCount: 2,
    },
    { 
      id: 5,
      name: 'Baele Stéphane',
      university: 'University of Oxford, United Kingdom',
      articlesCount: 2,
    },
    { 
      id: 6,
      name: 'Baele Stéphane',
      university: 'University of Oxford, United Kingdom',
      articlesCount: 2,
    },
  ]);

  const fetchPaginatedAuthors = async (currentPage: number): Promise<PaginatedResults> => {
    // TODO : fetch call
    
    return {
      data: authors,
      totalPages: 20
    }
  }

  const onSearch = (newSearch: string): void => {
    setSearch(newSearch)
  }

  const onSetActiveLetter = (newActiveLetter: string): void => {
    setActiveLetter(newActiveLetter !== activeLetter ? newActiveLetter : '')
  }

  const { paginatedItems, handlePageClick, pageCount } = usePagination(fetchPaginatedAuthors);

  const getExpandedAuthor = (): IAuthor | null => {
    if (expandedAuthorIndex === -1) {
      return null
    }

    return paginatedItems.find((_, index) => expandedAuthorIndex === index) as IAuthor
  }

  const onCloseDetails = (): void => {
    setExpandedAuthorIndex(-1)
  }

  return (
    <main className='authors'>
      <Breadcrumb />
      <h1 className='authors-title'>Authors</h1>
      <div className='authors-count'>17 Authors for B</div>
      <div className='authors-content'>
        <AuthorSidebar onSearchCallback={onSearch} activeLetter={activeLetter} onSetActiveLetterCallback={onSetActiveLetter} />
        <div className='authors-content-results'>
          <div className='authors-content-results-paginationTop'>
            <Pagination pageCount={pageCount} onPageChange={handlePageClick} />
          </div>
          <div className='authors-content-results-cards'>
            {paginatedItems.map((author, index) => (
              <AuthorCard
                key={index}
                {...author as IAuthorCardProps}
                expandedCard={expandedAuthorIndex === index}
                setExpandedAuthorIndexCallback={(): void => expandedAuthorIndex !== index ? setExpandedAuthorIndex(index) : setExpandedAuthorIndex(-1)}
              />
            ))}
          </div>
          <div className='authors-content-results-paginationBottom'>
            <Pagination pageCount={pageCount} onPageChange={handlePageClick} />
          </div>
        </div>
      </div>
      {expandedAuthorIndex >= 0 && <AuthorDetails {...getExpandedAuthor() as IAuthorCardProps} onCloseDetailsCallback={onCloseDetails} />}
    </main>
  )
}