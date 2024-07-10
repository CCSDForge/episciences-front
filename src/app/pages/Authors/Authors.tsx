import { useState } from "react";
import { useTranslation } from 'react-i18next';

import { IAuthor } from "../../../types/author";
import { useAppSelector } from "../../../hooks/store";
import { useFetchAuthorsQuery } from "../../../store/features/author/author.query";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import AuthorCard from "../../components/Cards/AuthorCard/AuthorCard";
import AuthorsSidebar from "../../components/Sidebars/AuthorsSidebar/AuthorsSidebar";
import AuthorDetailsSidebar from "../../components/Sidebars/AuthorDetailsSidebar/AuthorDetailsSidebar";
import Loader from '../../components/Loader/Loader';
import Pagination from "../../components/Pagination/Pagination";
import './Authors.scss';

export default function Authors(): JSX.Element {
  const { t } = useTranslation();

  const AUTHORS_PER_PAGE = 10;

  const language = useAppSelector(state => state.i18nReducer.language)
  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code)

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeLetter, setActiveLetter] = useState('');
  const [expandedAuthorIndex, setExpandedAuthorIndex] = useState(-1);

  const onSearch = (newSearch: string): void => {
    setExpandedAuthorIndex(-1)
    if (activeLetter) setActiveLetter('')
    setSearch(newSearch)
  }

  const onSetActiveLetter = (newActiveLetter: string): void => {
    setExpandedAuthorIndex(-1)
    if (search) setSearch('')
    setActiveLetter(newActiveLetter !== activeLetter ? newActiveLetter : '')
  }

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
  }

  const getAuthorsCount = (): JSX.Element | null => {
    if (authors) {
      if (authors.totalItems > 1) {
        if (search) return <div className='authors-count'>{authors.totalItems} {t('common.authorsFor')} "{search}"</div>
        if (activeLetter) return <div className='authors-count'>{authors.totalItems} {t('common.authorsFor')} "{activeLetter}"</div>

        return <div className='authors-count'>{authors.totalItems} {t('common.authors')}</div>
      }

      if (search) return <div className='authors-count'>{authors.totalItems} {t('common.authorFor')} "{search}"</div>
      if (activeLetter) return <div className='authors-count'>{authors.totalItems} {t('common.authorFor')} "{activeLetter}"</div>

      return <div className='authors-count'>{authors.totalItems} {t('common.author')}</div>  
    }

    return null;
  }

  const getPagination = (): JSX.Element => {
    return (
      <Pagination
        currentPage={currentPage}
        itemsPerPage={AUTHORS_PER_PAGE}
        totalItems={authors?.totalItems}
        onPageChange={handlePageClick}
      />
    )
  }

  return (
    <main className='authors'>
      <Breadcrumb parent={{ path: 'home', label: `${t('pages.home.title')} > ${t('common.content')} >` }} crumbLabel={t('pages.authors.title')} />
      <h1 className='authors-title'>{t('pages.authors.title')}</h1>
      {getAuthorsCount()}
      <div className='authors-content'>
        <AuthorsSidebar t={t} search={search} onSearchCallback={onSearch} activeLetter={activeLetter} onSetActiveLetterCallback={onSetActiveLetter} />
        <div className='authors-content-results'>
          <div className='authors-content-results-paginationTop'>
            {getPagination()}
          </div>
          {isFetching ? (
            <div className='authors-content-loader'>
              <Loader />
            </div>
          ) : (
            <div className='authors-content-results-cards'>
              {authors?.data.map((author, index) => (
                <AuthorCard
                  key={index}
                  t={t}
                  author={author}
                  expandedCard={expandedAuthorIndex === index}
                  setExpandedAuthorIndexCallback={(): void => expandedAuthorIndex !== index ? setExpandedAuthorIndex(index) : setExpandedAuthorIndex(-1)}
                />
              ))}
            </div>
          )}
          <div className='authors-content-results-paginationBottom'>
            {getPagination()}
          </div>
        </div>
      </div>
      {expandedAuthorIndex >= 0 && <AuthorDetailsSidebar language={language} t={t} rvcode={rvcode} expandedAuthor={getExpandedAuthor()} onCloseDetailsCallback={onCloseDetails} />}
    </main>
  )
}