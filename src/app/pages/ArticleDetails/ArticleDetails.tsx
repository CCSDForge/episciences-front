import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import caretUp from '/icons/caret-up-red.svg';
import caretDown from '/icons/caret-down-red.svg';
import { PATHS } from '../../../config/paths'
import { useAppSelector } from "../../../hooks/store";
import { useFetchArticleQuery } from "../../../store/features/article/article.query";
import { useFetchVolumeQuery } from "../../../store/features/volume/volume.query";
import { IArticle } from "../../../types/article";
import { articleTypes, getCitations, isDOI, ICitation } from '../../../utils/article';
import { AvailableLanguage, availableLanguages } from '../../../utils/i18n';
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Loader from "../../components/Loader/Loader";
import ArticleDetailsSidebar from "../../components/Sidebars/ArticleDetailsSidebar/ArticleDetailsSidebar";
import './ArticleDetails.scss'

enum ARTICLE_SECTION {
  ABSTRACT = 'abstract',
  KEYWORDS = 'keywords',
  LINKED_PUBLICATIONS = 'linkedPublications',
  CITED_BY = 'citedBy',
  PREVIEW = 'preview'
}

export default function ArticleDetails(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const language = useAppSelector(state => state.i18nReducer.language)
  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code)
  
  const { id } = useParams();
  const { data: article, isFetching: isFetchingArticle, isError, error } = useFetchArticleQuery({ paperid: id! }, { skip: !id });
  const { data: relatedVolume, isFetching: isFetchingVolume } = useFetchVolumeQuery({ rvcode: rvcode!, vid: article?.volumeId?.toString(), language: language }, { skip: !article || !article?.volumeId || !rvcode })

  const [openedSections, setOpenedSections] = useState<{ key: ARTICLE_SECTION, isOpened: boolean }[]>([
    { key: ARTICLE_SECTION.ABSTRACT, isOpened: true },
    { key: ARTICLE_SECTION.KEYWORDS, isOpened: true },
    { key: ARTICLE_SECTION.LINKED_PUBLICATIONS, isOpened: true },
    { key: ARTICLE_SECTION.CITED_BY, isOpened: true },
    { key: ARTICLE_SECTION.PREVIEW, isOpened: true }
  ]);
  const [citations, setCitations] = useState<ICitation[]>([]);

  const renderSection = (sectionKey: ARTICLE_SECTION, sectionTitle: string, sectionContent: JSX.Element | null): JSX.Element | null => {
    if (!sectionContent) return null

    const isOpenedSection = openedSections.find(section => section.key === sectionKey)?.isOpened

    return (
      <div className='articleDetails-content-article-section'>
        <div className={`articleDetails-content-article-section-title ${!isOpenedSection && 'articleDetails-content-article-section-closed'}`} onClick={(): void => toggleSection(sectionKey)}>
          <div className='articleDetails-content-article-section-title-text'>{sectionTitle}</div>
          {isOpenedSection ? (
            <img className='articleDetails-content-article-section-title-caret' src={caretUp} alt='Caret up icon' />
          ) : (
            <img className='articleDetails-content-article-section-title-caret' src={caretDown} alt='Caret down icon' />
          )}
        </div>
        <div className={`articleDetails-content-article-section-content ${isOpenedSection && 'articleDetails-content-article-section-content-opened'}`}>{sectionContent}</div>
      </div>
    )
  }

  const toggleSection = (sectionKey: ARTICLE_SECTION) => {
    const updatedSections = openedSections.map((section) => {
      if (section.key === sectionKey) {
        return { ...section, isOpened: !section.isOpened };
      }

      return { ...section };
    });

    setOpenedSections(updatedSections);
  }

  const getKeywordsSection = (): JSX.Element | null => {
    if (!article?.keywords) return null

    const renderedKeywords: string[] = []

    Object.entries(article.keywords).map((keyword) => {
      const key = keyword[0]
      const values = keyword[1]

      if (availableLanguages.includes(key as AvailableLanguage)) {
        if (key === language) {
          renderedKeywords.push(...values)
        }
      } else {
        renderedKeywords.push(values)
      }
    })

    return (
      <ul>
        {renderedKeywords.map((keyword, index) => <li key={index}>{keyword}</li>)}
      </ul>
    )
  }

  const getLinkedPublicationsSection = (): JSX.Element | null => {
    if (!article?.relatedItems || !article.relatedItems.length) return null

    return (
      <ul>
      {article?.relatedItems.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
      </ul>
    )
  }

  const getCitedBySection = (): JSX.Element | null  => {
    if (!article?.citations || !article.citations.length) return null

    return (
      <ul className="articleDetails-content-article-section-content-citations-citation">
      {article?.citations.map((citation, index) => (
        <li key={index} className="articleDetails-content-article-section-content-citations-citation">
          <p>{citation.citation}</p>
          {citation.doi && isDOI(citation.doi) && <Link to={`https://doi.org/${citation.doi}`} className="articleDetails-content-article-section-content-citations-citation-doi" target="_blank">{t('common.doi')} : {citation.doi}</Link>}
        </li>
      ))}
      </ul>
    )
  }

  useEffect(() => {
    if (!article && isError && (error as FetchBaseQueryError)?.status) {
      navigate(PATHS.home);
    }
  }, [article, isError, error])

  useEffect(() => {
    const fetchCitations = async () => {
      const fetchedCitations = await getCitations(article?.doi);
      setCitations(fetchedCitations);
    };

    fetchCitations();
  }, [article, article?.doi]);

  return (
    <main className='articleDetails'>
      <Breadcrumb parents={[
        { path: 'home', label: `${t('pages.home.title')} > ${t('common.content')} >` },
        { path: 'articles', label: `${t('pages.articles.title')} >` }
      ]} crumbLabel={`${t('pages.articleDetails.title')} ${id}`} />
      {(isFetchingArticle || isFetchingVolume) ? (
        <Loader />
      ) : (
        <>
          {article?.tag && <div className='articleDetails-tag'>{t(articleTypes.find((tag) => tag.value === article.tag)?.labelPath!)}</div>}
          <div className="articleDetails-content">
            <ArticleDetailsSidebar language={language} t={t} article={article as IArticle | undefined} relatedVolume={relatedVolume} citations={citations} />
            <div className="articleDetails-content-article">
              <h1 className="articleDetails-content-article-title">{article?.title}</h1>
              <div className="articleDetails-content-article-authors">{article?.authors}</div>
              {renderSection(ARTICLE_SECTION.ABSTRACT, t('pages.articleDetails.sections.abstract'), <>{article?.abstract}</>)}
              {renderSection(ARTICLE_SECTION.KEYWORDS, t('pages.articleDetails.sections.keywords'), getKeywordsSection())}
              {renderSection(ARTICLE_SECTION.LINKED_PUBLICATIONS, t('pages.articleDetails.sections.linkedPublications'), getLinkedPublicationsSection())}
              {renderSection(ARTICLE_SECTION.CITED_BY, t('pages.articleDetails.sections.citedBy'), getCitedBySection())}
              {renderSection(ARTICLE_SECTION.PREVIEW, t('pages.articleDetails.sections.preview'), <iframe src={article?.halLink} className="articleDetails-content-article-section-content-preview" />)}
            </div>
          </div>
        </>
      )}
    </main>
  )
}