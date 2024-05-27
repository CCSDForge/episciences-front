import { useState } from 'react';

import listRed from '/icons/list-red.svg';
import listGrey from '/icons/list-grey.svg';
import tileRed from '/icons/tile-red.svg';
import tileGrey from '/icons/tile-grey.svg';
import usePagination, { PaginatedResults } from "../../../hooks/pagination";
import { INews } from '../../../types/news';
import { MODE } from '../../../utils/common';
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import NewsCard from '../../components/Cards/NewsCard/NewsCard';
import NewsSidebar from '../../components/Sidebars/NewsSidebar/NewsSidebar';
import Pagination from "../../components/Pagination/Pagination";
import './News.scss'

export default function News(): JSX.Element {
  const [mode, setMode] = useState(MODE.LIST);

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

  const [news, setNews] = useState<INews[]>([
    { 
      id: 1,
      title: 'Open-access reformers launch next bold publishing plan',
      publicationDate: 'August 18, 2023',
      author: 'Ilona Sinzelle-Poňavičová',
      description: 'The group behind Plan S has already accelerated the open-access movement. Now it is proposing a more radical revolution for science publishing. In case you missed the article, click on the link below.'
    },
    { 
      id: 2,
      title: 'Open-access reformers launch next bold publishing plan',
      publicationDate: 'August 18, 2023',
      author: 'Ilona Sinzelle-Poňavičová',
      description: 'The group behind Plan S has already accelerated the open-access movement. Now it is proposing a more radical revolution for science publishing. In case you missed the article, click on the link below.'
    },
    { 
      id: 3,
      title: 'Open-access reformers launch next bold publishing plan',
      publicationDate: 'August 18, 2023',
      author: 'Ilona Sinzelle-Poňavičová',
      description: 'The group behind Plan S has already accelerated the open-access movement. Now it is proposing a more radical revolution for science publishing. In case you missed the article, click on the link below.'
    },
    { 
      id: 4,
      title: 'Open-access reformers launch next bold publishing plan',
      publicationDate: 'August 18, 2023',
      author: 'Ilona Sinzelle-Poňavičová',
      description: 'The group behind Plan S has already accelerated the open-access movement. Now it is proposing a more radical revolution for science publishing. In case you missed the article, click on the link below.'
    },
    { 
      id: 5,
      title: 'Open-access reformers launch next bold publishing plan',
      publicationDate: 'August 18, 2023',
      author: 'Ilona Sinzelle-Poňavičová',
      description: 'The group behind Plan S has already accelerated the open-access movement. Now it is proposing a more radical revolution for science publishing. In case you missed the article, click on the link below.'
    },
    { 
      id: 6,
      title: 'Open-access reformers launch next bold publishing plan',
      publicationDate: 'August 18, 2023',
      author: 'Ilona Sinzelle-Poňavičová',
      description: 'The group behind Plan S has already accelerated the open-access movement. Now it is proposing a more radical revolution for science publishing. In case you missed the article, click on the link below.'
    },
  ]);

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

  const fetchPaginatedNews = async (currentPage: number): Promise<PaginatedResults> => {
    // TODO : fetch call
    
    return {
      data: news,
      totalPages: 20
    }
  }

  const { paginatedItems, handlePageClick, pageCount } = usePagination(fetchPaginatedNews);

  return (
    <main className='news'>
      <Breadcrumb />
      <div className='news-title'>
        <h1>News</h1>
        <div className='news-title-icons'>
          <div className='news-title-icons-icon' onClick={(): void => setMode(MODE.TILE)}>
            {mode === MODE.TILE ? (
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
          <div className='news-title-icons-icon' onClick={(): void =>setMode(MODE.LIST)}>
            {mode === MODE.LIST ? (
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
      <div className='news-content'>
        <div className='news-content-results'>
          <NewsSidebar filters={filters} onSelectFilterChoiceCallback={onSelectFilterChoice} />
          <div className='news-content-results-cards'>
            {paginatedItems.map((news, index) => (
              <NewsCard key={index} {...news} />
            ))}
          </div>
        </div>
        <Pagination pageCount={pageCount} onPageChange={handlePageClick} />
      </div>
    </main>
  )
}