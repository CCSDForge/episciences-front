import { useState } from 'react';

import listRed from '/icons/list-red.svg';
import listGrey from '/icons/list-grey.svg';
import tileRed from '/icons/tile-red.svg';
import tileGrey from '/icons/tile-grey.svg';
import { useAppSelector } from "../../../hooks/store";
import { useFetchNewsQuery } from '../../../store/features/news/news.query';
import { RENDERING_MODE } from '../../../utils/card';
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Loader from '../../components/Loader/Loader';
import NewsCard from '../../components/Cards/NewsCard/NewsCard';
import NewsSidebar from '../../components/Sidebars/NewsSidebar/NewsSidebar';
import Pagination from "../../components/Pagination/Pagination";
import './News.scss'

export default function News(): JSX.Element {
  const language = useAppSelector(state => state.i18nReducer.language)
  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code)

  const [currentPage, setCurrentPage] = useState(1);
  const [mode, setMode] = useState(RENDERING_MODE.LIST);

    // TODO: remove mocks
  // TODO: type hint filters in src/types ?
  const [filters, setFilters] = useState([
    // TODO : years from util
    {
      id: 1,
      title: 'Years',
      choices: [
        { id: 1, label: '2023', isSelected: false },
        { id: 2, label: '2022', isSelected: false },
        { id: 3, label: '2021', isSelected: false }
      ]
    },
  ]);

  const { data: news, isFetching } = useFetchNewsQuery({ rvcode: rvcode!, page: currentPage }, { skip: !rvcode })

  const handlePageClick = (selectedItem: { selected: number }): void => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const onSelectFilterChoice = (filterId: number, choiceId: number): void => {
    const updatedFilters = filters.map((filter) => {
      if (filter.id === filterId) {
        const updatedChoices = filter.choices.map((choice) => {
          if (choice.id === choiceId) {
            return { ...choice, isSelected: !choice.isSelected };
          }

          return { ...choice, isSelected: false };
        });

        return { ...filter, choices: updatedChoices };
      }

      return filter;
    });

    setFilters(updatedFilters);
  }

  return (
    <main className='news'>
      <Breadcrumb />
      <div className='news-title'>
        <h1>News</h1>
        <div className='news-title-icons'>
          <div className='news-title-icons-icon' onClick={(): void => setMode(RENDERING_MODE.TILE)}>
            {mode === RENDERING_MODE.TILE ? (
              <div className='news-title-icons-icon-row-red'>
                <img src={tileRed} alt='Red tile icon' />
                <span>Tile</span>
              </div>
            ) : (
              <div className='news-title-icons-icon-row'>
                <img src={tileGrey} alt='Grey tile icon' />
                <span>Tile</span>
              </div>
            )}
          </div>
          <div className='news-title-icons-icon' onClick={(): void =>setMode(RENDERING_MODE.LIST)}>
            {mode === RENDERING_MODE.LIST ? (
              <div className='news-title-icons-icon-row-red'>
                <img src={listRed} alt='Red list icon' />
                <span>List</span>
              </div>
            ) : (
              <div className='news-title-icons-icon-row'>
                <img src={listGrey} alt='Grey list icon' />
                <span>List</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {isFetching ? (
        <Loader />
      ) : (
        <div className='news-content'>
          <div className='news-content-results'>
            <NewsSidebar filters={filters} onSelectFilterChoiceCallback={onSelectFilterChoice} />
            <div className='news-content-results-cards'>
              {news?.data.map((singleNews, index) => (
                <NewsCard
                  key={index}
                  language={language}
                  news={singleNews}
                />
              ))}
            </div>
          </div>
          <Pagination totalItems={news?.totalItems} onPageChange={handlePageClick} />
        </div>
      )}
    </main>
  )
}