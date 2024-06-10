import { useState } from "react";

import { IAuthor } from "../../../types/author";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import AuthorCard, { IAuthorCardProps } from "../../components/Cards/AuthorCard/AuthorCard";
import AuthorsSidebar from "../../components/Sidebars/AuthorsSidebar/AuthorsSidebar";
import Pagination from "../../components/Pagination/Pagination";
import './Authors.scss';
import AuthorDetailsSidebar from "../../components/Sidebars/AuthorDetailsSidebar/AuthorDetailsSidebar";

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

  const paginatedItems = authors

  const onSearch = (newSearch: string): void => {
    setSearch(newSearch)
  }

  const onSetActiveLetter = (newActiveLetter: string): void => {
    setActiveLetter(newActiveLetter !== activeLetter ? newActiveLetter : '')
  }

  const getExpandedAuthor = (): IAuthor | null => {
    if (expandedAuthorIndex === -1) {
      return null
    }

    return paginatedItems.find((_, index) => expandedAuthorIndex === index) as IAuthor
  }

  const onCloseDetails = (): void => {
    setExpandedAuthorIndex(-1)
  }

  const handlePageClick = (): void => {

  }

  return (
    <main className='authors'>
      <Breadcrumb />
      <h1 className='authors-title'>Authors</h1>
      <div className='authors-count'>17 Authors for B</div>
      <div className='authors-content'>
        <AuthorsSidebar onSearchCallback={onSearch} activeLetter={activeLetter} onSetActiveLetterCallback={onSetActiveLetter} />
        <div className='authors-content-results'>
          <div className='authors-content-results-paginationTop'>
            <Pagination itemsPerPage={10} onPageChange={handlePageClick} />
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
            <Pagination itemsPerPage={10} onPageChange={handlePageClick} />
          </div>
        </div>
      </div>
      {expandedAuthorIndex >= 0 && <AuthorDetailsSidebar {...getExpandedAuthor() as IAuthorCardProps} onCloseDetailsCallback={onCloseDetails} />}
    </main>
  )
}