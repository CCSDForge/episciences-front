import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import caretRight from '/icons/caret-right-grey.svg';
import { HOMEPAGE_BLOCK, blocksConfiguration } from '../../../config/homepage';
import { PATHS } from '../../../config/paths';
import { useAppSelector } from "../../../hooks/store";
import { useFetchAboutPageQuery } from '../../../store/features/about/about.query';
import { useFetchArticlesQuery } from '../../../store/features/article/article.query';
import { useFetchBoardMembersQuery } from '../../../store/features/board/board.query';
import { useFetchIndexationPageQuery } from '../../../store/features/indexation/indexation.query';
import { useFetchNewsQuery } from '../../../store/features/news/news.query';
import IssuesSection from '../../components/HomeSections/IssuesSection/IssuesSection';
import JournalSection from '../../components/HomeSections/JournalSection/JournalSection';
import NewsSection from '../../components/HomeSections/NewsSection/NewsSection';
import PresentationSection from '../../components/HomeSections/PresentationSection/PresentationSection';
import StatisticsSection from '../../components/HomeSections/StatisticsSection/StatisticsSection';
import Swiper from '../../components/Swiper/Swiper';
import './Home.scss';
import { useFetchVolumesQuery } from '../../../store/features/volume/volume.query';
import { VOLUME_TYPE } from '../../../utils/volume';

export default function Home(): JSX.Element {
  const { t } = useTranslation();

  const language = useAppSelector(state => state.i18nReducer.language)
  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code)
  const currentJournal = useAppSelector(state => state.journalReducer.currentJournal)

  const { data: aboutPage } = useFetchAboutPageQuery(rvcode!, { skip: !rvcode })
  const { data: articles } = useFetchArticlesQuery({ rvcode: rvcode!, page: 1, itemsPerPage: 20 }, { skip: !rvcode })
  const { data: news } = useFetchNewsQuery({ rvcode: rvcode!, page: 1, itemsPerPage: 3 }, { skip: !rvcode })
  const { data: members } = useFetchBoardMembersQuery(rvcode!, { skip: !rvcode })
  const { data: indexation } = useFetchIndexationPageQuery(rvcode!, { skip: !rvcode })
  const { data: issues } = useFetchVolumesQuery({ rvcode: rvcode!, page: 1, itemsPerPage: 2, types: [VOLUME_TYPE.SPECIAL_ISSUE] }, { skip: !rvcode })

  const getBlockRendering = (blockKey: HOMEPAGE_BLOCK) => blocksConfiguration().find((config) => config.key === blockKey)

  return (
    <main className='home'>
      <h1 className='home-title'>{t('pages.home.title')}</h1>
      <PresentationSection language={language} aboutContent={aboutPage?.content} lastNews={getBlockRendering(HOMEPAGE_BLOCK.LAST_NEWS)?.render && news?.data && news.data.length ? news.data[0] : undefined} />
      {getBlockRendering(HOMEPAGE_BLOCK.LATEST_ARTICLES_CAROUSEL)?.render && (
        <>
          <div className='home-subtitle'>
            <h2>Latest articles</h2>
            <Link to={PATHS.articles}>
              <div className='home-subtitle-all'>
                <div className='home-subtitle-all-text'>See all articles</div>
                <img src={caretRight} alt='Caret right icon' />
              </div>
            </Link>
          </div>
          <Swiper id='articles-swiper' type='article' language={language} slidesPerView={3} cards={articles?.data.filter(article => article?.title) ?? []}/>
        </>
      )}
      {getBlockRendering(HOMEPAGE_BLOCK.LATEST_NEWS_CAROUSEL)?.render && (
        <>
          <div className='home-subtitle'>
            <h2>News</h2>
            <Link to={PATHS.news}>
              <div className='home-subtitle-all'>
                <div className='home-subtitle-all-text'>See all news</div>
                <img src={caretRight} alt='Caret right icon' />
              </div>
            </Link>
          </div>
          <NewsSection language={language} news={news?.data ?? []} />
        </>
      )}
      {getBlockRendering(HOMEPAGE_BLOCK.MEMBERS_CAROUSEL)?.render && (
        <>
          <div className='home-subtitle'>
            <h2>Members</h2>
            <Link to={PATHS.boards}>
              <div className='home-subtitle-all'>
                <div className='home-subtitle-all-text'>See all members</div>
                <img src={caretRight} alt='Caret right icon' />
              </div>
            </Link>
          </div>
        <Swiper id='boards-swiper' type='board' language={language} slidesPerView={4} cards={members ?? []}/>
        </>
      )}
      {getBlockRendering(HOMEPAGE_BLOCK.STATS)?.render && (
        <StatisticsSection stats={getBlockRendering(HOMEPAGE_BLOCK.STATS)?.stats ?? []} />
      )}
      {getBlockRendering(HOMEPAGE_BLOCK.JOURNAL_INDEXATION)?.render && (
        <>
          <h2 className='home-subtitle'>Journal indexation</h2>
          <JournalSection language={language} content={indexation?.content} />
        </>
      )}
      {getBlockRendering(HOMEPAGE_BLOCK.SPECIAL_ISSUES)?.render && (
        <>
          <div className='home-subtitle'>
            <h2>Special issues</h2>
            <Link to={`${PATHS.volumes}?type=${VOLUME_TYPE.SPECIAL_ISSUE}`}>
              <div className='home-subtitle-all'>
                <div className='home-subtitle-all-text'>See all issues</div>
                <img src={caretRight} alt='Caret right icon' />
              </div>
            </Link>
          </div>
          <IssuesSection language={language} issues={issues?.data ?? []} currentJournal={currentJournal} />
        </>
      )}
    </main>
  )
}