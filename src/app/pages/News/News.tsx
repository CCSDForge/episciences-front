import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
import NewsSidebar, { INewsYearSelection } from '../../components/Sidebars/NewsSidebar/NewsSidebar';
import Pagination from "../../components/Pagination/Pagination";
import './News.scss'

export default function News(): JSX.Element {
  const { t } = useTranslation();

  const NEWS_PER_PAGE = 10;

  const language = useAppSelector(state => state.i18nReducer.language)
  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code)

  const [currentPage, setCurrentPage] = useState(1);
  const [mode, setMode] = useState(RENDERING_MODE.LIST);
  const [years, setYears] = useState<INewsYearSelection[]>([]);
  const [fullNewsIndex, setFullNewsIndex] = useState(-1);

  const getSelectedYears = (): number[] => years.filter(y => y.isSelected).map(y => y.year);

  const { data: news, isFetching } = useFetchNewsQuery({ rvcode: rvcode!, page: currentPage, itemsPerPage: NEWS_PER_PAGE, years: getSelectedYears() }, { skip: !rvcode, refetchOnMountOrArgChange: true })

  useEffect(() => {
    if (news?.range && news.range.years && years.length === 0) {
      const initYears = news.range.years.map((y) => ({
        year: y,
        isSelected: false
      }))

      setYears(initYears)
    }
  }, [news?.range, news?.range?.years, years])

  const handlePageClick = (selectedItem: { selected: number }): void => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const onSelectYear = (year: number): void => {
    const updatedYears = years.map((y) => {
      if (y.year === year) {
        return { ...y, isSelected: !y.isSelected };
      }

      return { ...y };
    });

    setYears(updatedYears);
  }

  return (
    <main className='news'>
      <Breadcrumb parents={[
        { path: 'home', label: `${t('pages.home.title')} > ${t('common.about')} >` }
      ]} crumbLabel={t('pages.news.title')} />
      <div className='news-title'>
        <h1>{t('pages.news.title')}</h1>
        <div className='news-title-icons'>
          <div className='news-title-icons-icon' onClick={(): void => setMode(RENDERING_MODE.TILE)}>
            <div className={`${mode === RENDERING_MODE.TILE ? 'news-title-icons-icon-row-red' : 'news-title-icons-icon-row'}`}>
              <img src={mode === RENDERING_MODE.TILE ? tileRed : tileGrey} alt='Tile icon' />
              <span>{t('common.renderingMode.tile')}</span>
            </div>
          </div>
          <div className='news-title-icons-icon' onClick={(): void => setMode(RENDERING_MODE.LIST)}>
            <div className={`${mode === RENDERING_MODE.LIST ? 'news-title-icons-icon-row-red' : 'news-title-icons-icon-row'}`}>
              <img src={mode === RENDERING_MODE.LIST ? listRed : listGrey} alt='List icon' />
              <span>{t('common.renderingMode.list')}</span>
            </div>
          </div>
        </div>
      </div>
      <div className='news-content'>
        <div className='news-content-results'>
          <NewsSidebar t={t} years={years} onSelectYearCallback={onSelectYear} />
          {isFetching ? (
            <Loader />
          ) : (
            <div className={`news-content-results-cards ${mode === RENDERING_MODE.TILE && 'news-content-results-cards-grid'}`}>
              {news?.data.map((singleNews, index) => (
                <NewsCard
                  key={index}
                  language={language}
                  t={t}
                  mode={mode}
                  fullCard={mode === RENDERING_MODE.TILE && fullNewsIndex === index}
                  blurCard={mode === RENDERING_MODE.TILE && fullNewsIndex !== -1 && fullNewsIndex !== index}
                  setFullNewsIndexCallback={(): void => mode === RENDERING_MODE.TILE ? fullNewsIndex !== index ? setFullNewsIndex(index) : setFullNewsIndex(-1) : void(null)}
                  news={singleNews}
                />
              ))}
            </div>
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          itemsPerPage={NEWS_PER_PAGE}
          totalItems={news?.totalItems}
          onPageChange={handlePageClick}
        />
      </div>
    </main>
  )
}