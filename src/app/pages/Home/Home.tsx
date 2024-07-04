import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import caretRight from '/icons/caret-right-grey.svg';
import { PATHS } from '../../../config/paths';
import { useAppSelector } from "../../../hooks/store";
import { useFetchAboutPageQuery } from '../../../store/features/about/about.query';
import { useFetchArticlesQuery } from '../../../store/features/article/article.query';
import { useFetchBoardMembersQuery } from '../../../store/features/board/board.query';
import { useFetchIndexationPageQuery } from '../../../store/features/indexation/indexation.query';
import { useFetchNewsQuery } from '../../../store/features/news/news.query';
import { IStat } from '../../../types/stat';
import IssuesSection from '../../components/HomeSections/IssuesSection/IssuesSection';
import JournalSection from '../../components/HomeSections/JournalSection/JournalSection';
import NewsSection from '../../components/HomeSections/NewsSection/NewsSection';
import PresentationSection from '../../components/HomeSections/PresentationSection/PresentationSection';
import StatisticsSection from '../../components/HomeSections/StatisticsSection/StatisticsSection';
import Swiper from '../../components/Swiper/Swiper';
import './Home.scss';

export default function Home(): JSX.Element {
  const { t } = useTranslation();

  const language = useAppSelector(state => state.i18nReducer.language)
  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code)

  const { data: aboutPage } = useFetchAboutPageQuery(rvcode!, { skip: !rvcode })
  const { data: articles } = useFetchArticlesQuery({ rvcode: rvcode!, page: 1, itemsPerPage: 20 }, { skip: !rvcode })
  const { data: news } = useFetchNewsQuery({ rvcode: rvcode!, page: 1, itemsPerPage: 3 }, { skip: !rvcode })
  const { data: members } = useFetchBoardMembersQuery(rvcode!, { skip: !rvcode })
  const { data: indexation } = useFetchIndexationPageQuery(rvcode!, { skip: !rvcode })

  // TODO : remove mocks
  const stats: IStat[] = [
    { stat: '62.07%', title: 'Acceptance rate' },
    { stat: '29', title: 'Published articles' },
    { stat: '2 weeks', title: 'Submission-publication time' }
  ]

  // TODO : remove mocks
  // TODO: type hint ?
  const issues = [
    { volume: 'Volume 16 - Issue 1', title: "D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000" },
    { volume: 'Volume 16 - Issue 1', title: "D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000" }
  ]

  return (
    <main className='home'>
      <h1 className='home-title'>{t('pages.home.title')}</h1>
      <PresentationSection language={language} aboutContent={aboutPage?.content} lastNews={news?.data[0]} />
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
      <StatisticsSection stats={stats} />
      <h2 className='home-subtitle'>Journal indexation</h2>
      <JournalSection language={language} content={indexation?.content} />
      <h2 className='home-subtitle'>Special issues</h2>
      <IssuesSection issues={issues} />
    </main>
  )
}