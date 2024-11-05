import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import caretRight from '/icons/caret-right-grey.svg';
import { HOMEPAGE_BLOCK, HOMEPAGE_LAST_INFORMATION_BLOCK, blocksConfiguration, lastInformationBlockConfiguration } from '../../../config/homepage';
import { PATHS } from '../../../config/paths';
import { useAppSelector } from "../../../hooks/store";
import { useFetchAboutPageQuery } from '../../../store/features/about/about.query';
import { useFetchArticlesQuery } from '../../../store/features/article/article.query';
import { useFetchBoardMembersQuery } from '../../../store/features/board/board.query';
import { useFetchIndexationPageQuery } from '../../../store/features/indexation/indexation.query';
import { useFetchNewsQuery } from '../../../store/features/news/news.query';
import { useFetchStatsQuery } from '../../../store/features/stat/stat.query';
import { useFetchVolumesQuery } from '../../../store/features/volume/volume.query';
import { IVolume } from '../../../types/volume';
import { INews } from '../../../types/news';
import { VOLUME_TYPE } from '../../../utils/volume';
import IssuesSection from '../../components/HomeSections/IssuesSection/IssuesSection';
import JournalSection from '../../components/HomeSections/JournalSection/JournalSection';
import NewsSection from '../../components/HomeSections/NewsSection/NewsSection';
import PresentationSection from '../../components/HomeSections/PresentationSection/PresentationSection';
import StatisticsSection from '../../components/HomeSections/StatisticsSection/StatisticsSection';
import Swiper from '../../components/Swiper/Swiper';
import './Home.scss';
import {Helmet} from "react-helmet-async";

export default function Home(): JSX.Element {
  const { t, i18n } = useTranslation();

  const language = useAppSelector(state => state.i18nReducer.language)
  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code)
  const currentJournal = useAppSelector(state => state.journalReducer.currentJournal)
  const journalName = useAppSelector(state => state.journalReducer.currentJournal?.name)

  const { data: aboutPage } = useFetchAboutPageQuery(rvcode!, { skip: !rvcode })
  const { data: articles } = useFetchArticlesQuery({ rvcode: rvcode!, page: 1, itemsPerPage: 20 }, { skip: !rvcode })
  const { data: news } = useFetchNewsQuery({ rvcode: rvcode!, page: 1, itemsPerPage: 3 }, { skip: !rvcode })
  const { data: members } = useFetchBoardMembersQuery(rvcode!, { skip: !rvcode })
  const { data: stats } = useFetchStatsQuery({ rvcode: rvcode!, page: 1, itemsPerPage: 3 }, { skip: !rvcode })
  const { data: indexation } = useFetchIndexationPageQuery(rvcode!, { skip: !rvcode })
  const { data: volumes } = useFetchVolumesQuery({ rvcode: rvcode!, language: language, page: 1, itemsPerPage: 2 }, { skip: !rvcode })
  const { data: issues } = useFetchVolumesQuery({ rvcode: rvcode!, language: language, page: 1, itemsPerPage: 2, types: [VOLUME_TYPE.SPECIAL_ISSUE] }, { skip: !rvcode })
  const { data: acceptedArticles } = useFetchArticlesQuery({ rvcode: rvcode!, page: 1, itemsPerPage: 20, onlyAccepted: true }, { skip: !rvcode })

  const getBlockRendering = (blockKey: HOMEPAGE_BLOCK) => blocksConfiguration().find((config) => config.key === blockKey)

  const getLastInformation = (): { type: HOMEPAGE_LAST_INFORMATION_BLOCK, information: IVolume | INews | undefined } | undefined => {
    if (!lastInformationBlockConfiguration().render) return;

    if (lastInformationBlockConfiguration().key === HOMEPAGE_LAST_INFORMATION_BLOCK.LAST_VOLUME) {
      return {
        type: HOMEPAGE_LAST_INFORMATION_BLOCK.LAST_VOLUME,
        information: volumes?.data[0]
      }
    }

    if (lastInformationBlockConfiguration().key === HOMEPAGE_LAST_INFORMATION_BLOCK.LAST_SPECIAL_ISSUE) {
      return {
        type: HOMEPAGE_LAST_INFORMATION_BLOCK.LAST_SPECIAL_ISSUE,
        information: issues?.data[0]
      }
    }

    return {
      type: HOMEPAGE_LAST_INFORMATION_BLOCK.LAST_NEWS,
      information: news?.data[0]
    }
  }

  return (
    <main className='home'>

      <Helmet>
        <title>{t('pages.home.title')} | {journalName ?? ''}</title>
      </Helmet>

      <h1 className='home-title'>{t('pages.home.title')}</h1>
      <PresentationSection
        language={language}
        t={t}
        aboutContent={aboutPage?.content}
        lastInformation={getLastInformation()} />
      {getBlockRendering(HOMEPAGE_BLOCK.LATEST_ARTICLES_CAROUSEL)?.render && (
        <>
          <div className='home-subtitle'>
            <h2>{t('pages.home.blocks.articles.subtitle')}</h2>
            <Link to={PATHS.articles}>
              <div className='home-subtitle-all'>
                <div className='home-subtitle-all-text'>{t('pages.home.blocks.articles.see')}</div>
                <img src={caretRight} alt='Caret right icon' />
              </div>
            </Link>
          </div>
          <Swiper id='articles-swiper' type='article' language={language} t={t} slidesPerView={3} slidesPerGroup={3} cards={articles?.data.filter(article => article?.title) ?? []}/>
        </>
      )}
      {getBlockRendering(HOMEPAGE_BLOCK.LATEST_NEWS_CAROUSEL)?.render && (
        <>
          <div className='home-subtitle'>
            <h2>{t('pages.home.blocks.news.subtitle')}</h2>
            <Link to={PATHS.news}>
              <div className='home-subtitle-all'>
                <div className='home-subtitle-all-text'>{t('pages.home.blocks.news.see')}</div>
                <img src={caretRight} alt='Caret right icon' />
              </div>
            </Link>
          </div>
          <NewsSection language={language} t={t} news={news?.data ?? []} />
        </>
      )}
      {getBlockRendering(HOMEPAGE_BLOCK.MEMBERS_CAROUSEL)?.render && (
        <>
          <div className='home-subtitle'>
            <h2>{t('pages.home.blocks.members.subtitle')}</h2>
            <Link to={PATHS.boards}>
              <div className='home-subtitle-all'>
                <div className='home-subtitle-all-text'>{t('pages.home.blocks.members.see')}</div>
                <img src={caretRight} alt='Caret right icon' />
              </div>
            </Link>
          </div>
        <Swiper id='boards-swiper' type='board' language={language} t={t} slidesPerView={4} slidesPerGroup={3} cards={members ?? []}/>
        </>
      )}
      {getBlockRendering(HOMEPAGE_BLOCK.STATS)?.render && (
        <StatisticsSection t={t} i18n={i18n} stats={stats?.data ?? []} />
      )}
      {getBlockRendering(HOMEPAGE_BLOCK.JOURNAL_INDEXATION)?.render && (
        <>
          <h2 className='home-subtitle'>{t('pages.home.blocks.indexation.subtitle')}</h2>
          <JournalSection language={language} content={indexation?.content} />
        </>
      )}
      {getBlockRendering(HOMEPAGE_BLOCK.SPECIAL_ISSUES)?.render && (
        <>
          <div className='home-subtitle'>
            <h2>{t('pages.home.blocks.specialIssues.subtitle')}</h2>
            <Link to={`${PATHS.volumes}?type=${VOLUME_TYPE.SPECIAL_ISSUE}`}>
              <div className='home-subtitle-all'>
                <div className='home-subtitle-all-text'>{t('pages.home.blocks.specialIssues.see')}</div>
                <img src={caretRight} alt='Caret right icon' />
              </div>
            </Link>
          </div>
          <IssuesSection language={language} t={t} issues={issues?.data ?? []} currentJournal={currentJournal} />
        </>
      )}
      {getBlockRendering(HOMEPAGE_BLOCK.LATEST_ACCEPTED_ARTICLES_CAROUSEL)?.render && (
        <>
          <div className='home-subtitle'>
            <h2>{t('pages.home.blocks.articlesAccepted.subtitle')}</h2>
            <Link to={PATHS.articlesAccepted}>
              <div className='home-subtitle-all'>
                <div className='home-subtitle-all-text'>{t('pages.home.blocks.articlesAccepted.see')}</div>
                <img src={caretRight} alt='Caret right icon' />
              </div>
            </Link>
          </div>
          <Swiper id='articles-accepted-swiper' type='article-accepted' language={language} t={t} slidesPerView={3} slidesPerGroup={3} cards={acceptedArticles?.data.filter(article => article?.title) ?? []}/>
        </>
      )}
    </main>
  )
}