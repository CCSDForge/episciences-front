import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { isMobileOnly } from "react-device-detect";

import caretDown from '/icons/caret-down-grey.svg';
import caretUp from '/icons/caret-up-grey.svg';
import caretDownLight from '/icons/caret-down-grey-light.svg';
import caretUpLight from '/icons/caret-up-grey-light.svg';
import download from '/icons/download-red.svg';
import { PATHS } from '../../../config/paths'
import { useAppSelector } from "../../../hooks/store";
import { formatArticle, FetchedArticle } from "../../../utils/article";
import { useFetchVolumesQuery, useFetchVolumeQuery } from "../../../store/features/volume/volume.query";
import { RawArticle, IArticle } from "../../../types/article";
import { IVolumeMetadata } from "../../../types/volume";
import { formatDate } from "../../../utils/date";
import { VOLUME_TYPE } from "../../../utils/volume";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Loader from "../../components/Loader/Loader";
import VolumeArticleCard from "../../components/Cards/VolumeArticleCard/VolumeArticleCard";
import VolumeDetailsMobileModal from "../../components/Modals/VolumeDetailsMobileModal/VolumeDetailsMobileModal";
import VolumeDetailsSidebar from "../../components/Sidebars/VolumeDetailsSidebar/VolumeDetailsSidebar";
import './VolumeDetails.scss';

export default function VolumeDetails(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const RELATED_VOLUMES = 20;
  const MAX_MOBILE_DESCRIPTION_LENGTH = 200;
  
  const language = useAppSelector(state => state.i18nReducer.language)
  const [searchParams] = useSearchParams();
  const rvcodeFromUrl = searchParams.get('rvcode');
  const currentJournal = useAppSelector(state => state.journalReducer.currentJournal)
  const rvcode =  rvcodeFromUrl || currentJournal?.code || import.meta.env.VITE_JOURNAL_RVCODE;

  const [isFetchingArticles, setIsFetchingArticles] = useState(false);
  const [articles, setArticles] = useState<FetchedArticle[]>([]);
  const [showFullMobileDescription, setShowFullMobileDescription] = useState(false);
  const [openedRelatedVolumesMobileModal, setOpenedRelatedVolumesMobileModal] = useState(false)

  const { id } = useParams();
  const { data: volume, isFetching: isFetchingVolume, isError, error } = useFetchVolumeQuery({ rvcode: rvcode!, vid: id!, language: language }, { skip: !id || !rvcode });
  const { data: relatedVolumes, isFetching: isFetchingRelatedVolumes } = useFetchVolumesQuery({ rvcode: rvcode!, language: language, page: 1, itemsPerPage: RELATED_VOLUMES, types: volume?.types }, { skip: !rvcode })

  useEffect(() => {
    if (volume && volume.articles.length > 0) {
      setIsFetchingArticles(true);

      const paperIds = volume.articles.map(article => article['@id'].replace(/\D/g, ''));
      fetchArticles(paperIds);
    }
  }, [volume]);

  const fetchArticles = async (paperIds: string[]): Promise<void> => {
    const articlesRequests: Promise<FetchedArticle>[] = paperIds.map(async (docid) => {
      const article: RawArticle = await (await fetch(`${import.meta.env.VITE_API_ROOT_ENDPOINT}/papers/${docid}`)).json()

      return formatArticle(article)
    });

    const fetchedArticles = await Promise.all(articlesRequests);

    setArticles(fetchedArticles);
    setIsFetchingArticles(false);
  };

  const renderVolumeType = (): JSX.Element => {
    if (volume?.types && volume.types.length) {
      if (volume.types.includes(VOLUME_TYPE.PROCEEDINGS)) {
        return <h1 className='volumeDetails-id-text'>{t('pages.volumeDetails.titleProceeding')} {volume?.num}</h1>
      }

      if (volume.types.includes(VOLUME_TYPE.SPECIAL_ISSUE)) {
        return <h1 className='volumeDetails-id-text'>{t('pages.volumeDetails.titleSpecialIssue')} {volume?.num}</h1>
      }
    }

    return <h1 className='volumeDetails-id-text'>{t('pages.volumeDetails.title')} {volume?.num}</h1>
  }

  const renderVolumeMobileRelatedVolumes = (): JSX.Element | null => {
    if (!isMobileOnly) return null

    const caretIcon = <img className='volumeDetails-id-mobileRelatedList-icon' src={openedRelatedVolumesMobileModal ? caretUp : caretDown} />

    if (volume?.types && volume.types.length) {
      if (volume.types.includes(VOLUME_TYPE.PROCEEDINGS)) {
        return <div className='volumeDetails-id-mobileRelatedList' onClick={(): void => setOpenedRelatedVolumesMobileModal(true)}>
          <div>{t('pages.volumeDetails.relatedVolumes.proceedings')}</div>
          {caretIcon}
        </div>
      }

      if (volume.types.includes(VOLUME_TYPE.SPECIAL_ISSUE)) {
        return <div className='volumeDetails-id-mobileRelatedList' onClick={(): void => setOpenedRelatedVolumesMobileModal(true)}>
          <div>{t('pages.volumeDetails.relatedVolumes.specialIssues')}</div>
          {caretIcon}
        </div>
      }
    }

    return <div className='volumeDetails-id-mobileRelatedList' onClick={(): void => setOpenedRelatedVolumesMobileModal(true)}>
      <div>{t('pages.volumeDetails.relatedVolumes.volumes')}</div>
      {caretIcon}
    </div>
  }

  const renderVolumeTitle = (isMobile: boolean): JSX.Element => {
    const className = isMobile ? 'volumeDetails-content-results-content-title volumeDetails-content-results-content-title-mobile' : 'volumeDetails-content-results-content-title'

    if (volume?.types && volume.types.length && volume.types.includes(VOLUME_TYPE.PROCEEDINGS) && volume.settingsProceeding && volume.settingsProceeding.length) {
      const conferenceName = volume.settingsProceeding.find((setting) => setting.setting === "conference_name")

      if (conferenceName && conferenceName.value) {
        return <div className={className}>{volume?.title ? `${volume?.title[language]} (${conferenceName.value})` : ''}</div>
      }
    }

    return <div className={className}>{volume?.title ? volume?.title[language] : ''}</div>
  }

  const renderVolumeCommittee = (isMobile: boolean): JSX.Element | null => {
    const className = isMobile ? 'volumeDetails-content-results-content-committee volumeDetails-content-results-content-committee-mobile' : 'volumeDetails-content-results-content-committee'

    if (volume?.committee && volume.committee.length > 0) {
      return (
        <div className={className}>
          {(!volume?.types || !volume?.types.includes(VOLUME_TYPE.PROCEEDINGS)) && (
            <span className="volumeDetails-content-results-content-committee-note">{t('common.volumeCommittee')}</span>
          )}
          {volume?.committee.map((member) => member.screenName).join(', ')}
        </div>
      )
    }

    return null;
  }

  const renderVolumeDescription = (): JSX.Element => {
    if (volume?.description && volume.description[language]) {
      if (isMobileOnly) {
        if (volume.description[language].length <= MAX_MOBILE_DESCRIPTION_LENGTH) {
          return (
            <div className='volumeDetails-content-results-content-description'>
              <ReactMarkdown>{volume.description[language]}</ReactMarkdown>
            </div>
          )
        }

        return (
          <div className='volumeDetails-content-results-content-description'>
            {showFullMobileDescription ? (
              <ReactMarkdown>{volume?.description[language]}</ReactMarkdown>
            ) : (
              <ReactMarkdown>{`${volume?.description[language].substring(0, MAX_MOBILE_DESCRIPTION_LENGTH)}...`}</ReactMarkdown>
            )}
            <div onClick={(): void => setShowFullMobileDescription(!showFullMobileDescription)} className='volumeDetails-content-results-content-description-toggleMobile'>
              {showFullMobileDescription ? t('common.seeLess') : t('common.seeMore')}
              {showFullMobileDescription ? <img src={caretUpLight} /> : <img src={caretDownLight} />}
            </div>
          </div>
        )
      }

      return (
        <div className='volumeDetails-content-results-content-description'>
          <ReactMarkdown>{volume?.description[language]}</ReactMarkdown>
        </div>
      )
    }

    return <div className='volumeDetails-content-results-content-description'>{''}</div>
  }

  const renderProceedingTheme = (): string | null => {
    const proceedingTheme = volume!.settingsProceeding!.find((setting) => setting.setting === "conference_theme")

    return proceedingTheme?.value ? `${t('pages.volumeDetails.proceedingSettings.theme')} : ${proceedingTheme.value}` : null;
  }

  const renderProceedingDOI = (): string | null => {
    const proceedingDOI = volume!.settingsProceeding!.find((setting) => setting.setting === "conference_proceedings_doi")

    return proceedingDOI?.value ?? null;
  }

  const renderProceedingLocation = (): string | null => {
    const conferenceLocation = volume!.settingsProceeding!.find((setting) => setting.setting === "conference_location")

    return conferenceLocation?.value ?? null;
  }

  const renderProceedingDates = (): string | null => {
    const conferenceStart = volume!.settingsProceeding!.find((setting) => setting.setting === "conference_start")
    const conferenceEnd = volume!.settingsProceeding!.find((setting) => setting.setting === "conference_end")

    return conferenceStart?.value && conferenceEnd?.value ? `${formatDate(conferenceStart.value, language)} - ${formatDate(conferenceEnd.value, language)}` : null
  }

  const getEdito = (): IVolumeMetadata | null => {
    if (!volume?.metadatas || !volume.metadatas.length) return null

    const edito = volume.metadatas.find((metadata) => metadata.title && metadata.title[language] && metadata.title[language].replace(/[\u0300-\u036f]/g, '').toLowerCase() === 'edito')

    return edito || null
  }

  useEffect(() => {
    if (!volume && isError && (error as FetchBaseQueryError)?.status) {
      navigate(PATHS.home);
    }
  }, [volume, isError, error])

  return (
    <main className='volumeDetails'>
      {volume && <Breadcrumb parents={[
        { path: 'home', label: `${t('pages.home.title')} > ${t('common.content')} >` },
        { path: 'volumes', label: `${t('pages.volumes.title')} >`}
      ]} crumbLabel={`${t('pages.volumeDetails.title')} ${volume?.num}`} />}
      {openedRelatedVolumesMobileModal && <VolumeDetailsMobileModal language={language} t={t} volume={volume} relatedVolumes={relatedVolumes?.data ?? []} onSelectRelatedVolumeCallback={(volumeId: number): void => navigate(`${PATHS.volumes}/${volumeId}?rvcode=${rvcode}`)} onCloseCallback={(): void => setOpenedRelatedVolumesMobileModal(false)}/>}
      {isFetchingVolume || isFetchingArticles || isFetchingRelatedVolumes ? (
        <Loader />
      ) : (
        <div className="volumeDetails-volume">
          <div className="volumeDetails-id">
            {renderVolumeType()}
            {renderVolumeMobileRelatedVolumes()}
          </div>
          <div className="volumeDetails-content">
            <div className="volumeDetails-content-year">{volume?.year}</div>
            <div className='volumeDetails-content-results'>
              {renderVolumeTitle(true)}
              {renderVolumeCommittee(true)}
              <VolumeDetailsSidebar language={language} t={t} volume={volume} articles={articles as IArticle[]} currentJournal={currentJournal} relatedVolumes={relatedVolumes?.data ?? []} />
              <div className="volumeDetails-content-results-content">
                {renderVolumeTitle(false)}
                {renderVolumeCommittee(false)}
                {volume?.types && volume?.types.includes(VOLUME_TYPE.PROCEEDINGS) && volume.settingsProceeding && volume.settingsProceeding.length && (
                  <div className="volumeDetails-content-results-content-proceedingSettings">
                    <div className='volumeDetails-content-results-content-proceedingSettings-setting'>{renderProceedingTheme()}</div>
                    {renderProceedingDOI() && <Link to={`${import.meta.env.VITE_DOI_HOMEPAGE}/${renderProceedingDOI()}`} className='volumeDetails-content-results-content-proceedingSettings-setting volumeDetails-content-results-content-proceedingSettings-setting-doi' target="_blank" rel="noopener noreferrer">{renderProceedingDOI()}</Link>}
                    <div className='volumeDetails-content-results-content-proceedingSettings-setting'>{renderProceedingLocation()}</div>
                    <div className='volumeDetails-content-results-content-proceedingSettings-setting'>{renderProceedingDates()}</div>
                  </div>
                )}
                {renderVolumeDescription()}
                <div className='volumeDetails-content-results-content-mobileCount'>
                  {articles.length > 1 ? `${articles.length} ${t('common.articles')}` : `${articles.length} ${t('common.article')}`}
                </div>
                {getEdito() && getEdito()!.content && getEdito()!.content![language] && (
                  <div className="volumeDetails-content-results-content-edito">
                    <div className="volumeDetails-content-results-content-edito-title">{getEdito()!.title![language]}</div>
                    <div className="volumeDetails-content-results-content-edito-content">{getEdito()!.content![language]}</div>
                    <div className='volumeDetails-content-results-content-edito-anchor'>
                      {getEdito()?.createdAt ? (
                        <div className="volumeDetails-content-results-content-edito-anchor-publicationDate">{`${t('common.publishedOn')} ${formatDate(getEdito()!.createdAt!, language)}`}</div>
                      ) : getEdito()?.updatedAt && (
                        <div className="volumeDetails-content-results-content-edito-anchor-publicationDate">{`${t('common.publishedOn')} ${formatDate(getEdito()!.updatedAt!, language)}`}</div>
                      )}
                      {getEdito()?.file && (
                        <div className="volumeDetails-content-results-content-edito-anchor-icons">
                          <Link to={`https://${currentJournal?.code}.episciences.org/public/volumes/${volume?.id}/${getEdito()!.file!}`} target='_blank' rel="noopener noreferrer">
                            <div className="volumeDetails-content-results-content-edito-anchor-icons-download">
                              <img className="volumeDetails-content-results-content-edito-anchor-icons-download-download-icon" src={download} alt='Download icon' />
                              <div className="volumeDetails-content-results-content-edito-anchor-icons-download-text">{t('common.pdf')}</div>
                            </div>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className='volumeDetails-content-results-content-cards'>
                  {articles?.filter((article) => article).map((article, index) => (
                    <VolumeArticleCard
                      key={index}
                      language={language}
                      t={t}
                      article={article as IArticle}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
