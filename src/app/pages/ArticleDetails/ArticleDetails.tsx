import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MathJax } from 'better-react-mathjax';

import caretUpGrey from '/icons/caret-up-grey.svg';
import caretDownGrey from '/icons/caret-down-grey.svg';
import caretUpRed from '/icons/caret-up-red.svg';
import caretDownRed from '/icons/caret-down-red.svg';
import orcid from '/icons/orcid.svg';
import { PATHS } from '../../../config/paths'
import { useAppSelector } from "../../../hooks/store";
import { useFetchArticleQuery } from "../../../store/features/article/article.query";
import { useFetchVolumeQuery } from "../../../store/features/volume/volume.query";
import { IArticle, IArticleAuthor, IArticleRelatedItem } from "../../../types/article";
import { articleTypes, getCitations, isDOI, ICitation, LINKED_PUBLICATION_IDENTIFIER_TYPE } from '../../../utils/article';
import { AvailableLanguage, availableLanguages } from '../../../utils/i18n';
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Loader from "../../components/Loader/Loader";
import ArticleMeta from "../../components/Meta/ArticleMeta/ArticleMeta";
import ArticleDetailsSidebar from "../../components/Sidebars/ArticleDetailsSidebar/ArticleDetailsSidebar";
import './ArticleDetails.scss'

enum ARTICLE_SECTION {
  GRAPHICAL_ABSTRACT = 'graphicalAbstract',
  ABSTRACT = 'abstract',
  KEYWORDS = 'keywords',
  LINKED_PUBLICATIONS = 'linkedPublications',
  CITED_BY = 'citedBy',
  PREVIEW = 'preview'
}

interface EnhancedArticleAuthor extends IArticleAuthor {
  institutionsKeys: number[];
}

export default function ArticleDetails(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const language = useAppSelector(state => state.i18nReducer.language)
  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code)
  const currentJournal = useAppSelector(state => state.journalReducer.currentJournal);
  
  const { id } = useParams();
  const { data: article, isFetching: isFetchingArticle, isError, error } = useFetchArticleQuery({ paperid: id! }, { skip: !id });
  const { data: relatedVolume, isFetching: isFetchingVolume } = useFetchVolumeQuery({ rvcode: rvcode!, vid: (article && article.volumeId ? article.volumeId.toString() : ''), language: language }, { skip: !article || !article?.volumeId || !rvcode })


  const [openedSections, setOpenedSections] = useState<{ key: ARTICLE_SECTION, isOpened: boolean }[]>([
    { key: ARTICLE_SECTION.GRAPHICAL_ABSTRACT, isOpened: true },
    { key: ARTICLE_SECTION.ABSTRACT, isOpened: true },
    { key: ARTICLE_SECTION.KEYWORDS, isOpened: true },
    { key: ARTICLE_SECTION.LINKED_PUBLICATIONS, isOpened: true },
    { key: ARTICLE_SECTION.CITED_BY, isOpened: true },
    { key: ARTICLE_SECTION.PREVIEW, isOpened: true }
  ]);

  const [authors, setAuthors] = useState<EnhancedArticleAuthor[]>([]);
  const [institutions, setInstitutions] = useState<string[]>([]);
  const [openedInstitutions, setOpenedInstitutions] = useState(true);

  useEffect(() => {
    const previewDebounce = 1000

    const timer = setTimeout(() => {
      if (id) {
        fetch(`/articles/${id}/preview`);
      }
    }, previewDebounce);
  
    return () => clearTimeout(timer);
  }, [id]);
  

  useEffect(() => {
    if (article && !authors.length && !institutions.length) {
      const allAuthors: EnhancedArticleAuthor[] = [];
      const allInstitutionsSet = new Set<string>();

      article.authors.forEach((author) => {
        const enhancedAuthor: EnhancedArticleAuthor = { ...author, institutionsKeys: [] };
  
        author.institutions?.forEach((institution) => {
          if (!allInstitutionsSet.has(institution)) {
            allInstitutionsSet.add(institution);
          }
  
          const institutionIndex = Array.from(allInstitutionsSet).indexOf(institution);
          enhancedAuthor.institutionsKeys.push(institutionIndex);
        });
  
        allAuthors.push(enhancedAuthor);
      });

      setAuthors(allAuthors)
      setInstitutions(Array.from(allInstitutionsSet))
    }
  }, [article, authors, institutions])

  const [citations, setCitations] = useState<ICitation[]>([]);

  const renderArticleAuthors = (): JSX.Element => {
    if (!authors || !authors.length) return <></>;
  
    const formattedAuthors = authors.map((author, index) => {
      const authorName = (
        <>
          {author.fullname}
          {author.orcid && (
            <Link to={`${author.orcid}`} title={author.orcid} target='_blank'>
              {' '}
              <img className='articleDetails-content-article-authors-author-orcid' src={orcid} alt='Orcid icon' />
            </Link>
          )}
        </>
      );
  
      const authorInstitutions = author.institutionsKeys.map((key, i) => (
        <sup key={i} className="articleDetails-content-article-authors-institution-key">{' '}({key + 1})</sup>
      ));
  
      return (
        <span key={index} className="articleDetails-content-article-authors-author">
          {authorName}
          {authorInstitutions}
          {index < authors.length - 1 && ', '}
        </span>
      );
    });

    return institutions.length > 0 ? (
      <div className='articleDetails-content-article-authors articleDetails-content-article-authors-withInstitutions'>
        <div>{formattedAuthors}</div>
        <img className='articleDetails-content-article-authors-withInstitutions-caret' src={openedInstitutions ? caretUpGrey : caretDownGrey} alt={openedInstitutions ? 'Caret up icon' : 'Caret down icon'} onClick={(): void => setOpenedInstitutions(!openedInstitutions)} />
      </div>
    ) : (
      <div className='articleDetails-content-article-authors'>{formattedAuthors}</div>
    )
  };
  
  const renderArticleAuthorsInstitutions = (): JSX.Element => {
    if (!institutions || !institutions.length) return <></>;

    if (!openedInstitutions) return <></>

    return (
      <>
        {institutions.map((institution, index) => (
          <div key={index}>({index + 1}) {institution}</div>
        ))}
      </>
    )
  }

  const renderSection = (sectionKey: ARTICLE_SECTION, sectionTitle: string, sectionContent: JSX.Element | null): JSX.Element | null => {
    if (!sectionContent) return null

    const isOpenedSection = openedSections.find(section => section.key === sectionKey)?.isOpened

    return (
      <div className='articleDetails-content-article-section'>
        <div className={`articleDetails-content-article-section-title ${!isOpenedSection && 'articleDetails-content-article-section-closed'}`} onClick={(): void => toggleSection(sectionKey)}>
          <div className='articleDetails-content-article-section-title-text'>{sectionTitle}</div>
          {isOpenedSection ? (
            <img className='articleDetails-content-article-section-title-caret' src={caretUpRed} alt='Caret up icon' />
          ) : (
            <img className='articleDetails-content-article-section-title-caret' src={caretDownRed} alt='Caret down icon' />
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

  const getGraphicalAbstractSection = (): JSX.Element | null => {
    const graphicalAbstractURL = (rvcode && article?.graphicalAbstract) ? `https://${rvcode}.episciences.org/public/documents/${article.id}/${article?.graphicalAbstract}` : null
    
    return graphicalAbstractURL ? <img src={graphicalAbstractURL} className="articleDetails-content-article-section-content-graphicalAbstract" /> : null
  }

  const getAbstractSection = (): JSX.Element | null => {
    return article?.abstract ? <MathJax dynamic>{article.abstract}</MathJax> : null
  }

  const getKeywords = (): string[] => {
    const keywords: string[] = []

    if (!article?.keywords) return keywords

    Object.entries(article.keywords).map((keyword) => {
      const key = keyword[0]
      const values = keyword[1]

      if (availableLanguages.includes(key as AvailableLanguage)) {
        if (key === language) {
          keywords.push(...values)
        }
      } else {
        keywords.push(values)
      }
    })

    return keywords
  }

  const getKeywordsSection = (): JSX.Element | null => {
    const keywords = getKeywords()

    if (!keywords) return null

    return (
      <ul>
        {keywords.map((keyword, index) => <li key={index}>{keyword}</li>)}
      </ul>
    )
  }

  const getLinkedPublicationsSection = (): JSX.Element | null => {
    if (!article?.relatedItems || !article.relatedItems.length) return null

    return (
      <ul>
        {article?.relatedItems.map((relatedItem, index) => <li key={index}>{getLinkedPublicationRow(relatedItem)}</li>)}
      </ul>
    )
  }

  const getLinkedPublicationRow = (relatedItem: IArticleRelatedItem): JSX.Element => {
    if (relatedItem.identifierType === LINKED_PUBLICATION_IDENTIFIER_TYPE.URI) {
      return <Link to={relatedItem.value} className="articleDetails-content-article-section-content-linkedPublications-uri" target="_blank">{relatedItem.value}</Link>
    }

    if (relatedItem.identifierType === LINKED_PUBLICATION_IDENTIFIER_TYPE.DOI && isDOI(relatedItem.value)) {
      return <Link to={`${import.meta.env.VITE_DOI_HOMEPAGE}/${relatedItem.value}`} className="articleDetails-content-article-section-content-linkedPublications-doi" target="_blank">{relatedItem.value}</Link>
    }

    if (relatedItem.identifierType === LINKED_PUBLICATION_IDENTIFIER_TYPE.ARXIV) {
      return <Link to={`${import.meta.env.VITE_ARXIV_HOMEPAGE}/abs/${relatedItem.value}`} className="articleDetails-content-article-section-content-linkedPublications-arxiv" target="_blank">{relatedItem.value}</Link>
    }

    if (relatedItem.identifierType === LINKED_PUBLICATION_IDENTIFIER_TYPE.HAL) {
      return <Link to={`${import.meta.env.VITE_HAL_HOMEPAGE}/${relatedItem.value}`} className="articleDetails-content-article-section-content-linkedPublications-hal" target="_blank">{relatedItem.value}</Link>
    }

    if (relatedItem.identifierType === LINKED_PUBLICATION_IDENTIFIER_TYPE.OTHER && relatedItem.value.includes('swh')) {
      return (
        <div className="articleDetails-content-article-section-content-linkedPublications-swh">
          <Link to={`${import.meta.env.VITE_ARCHIVE_SOFTWARE_HERITAGE_HOMEPAGE}/${relatedItem.value}`} target='_blank'>
            <img src={`${import.meta.env.VITE_ARCHIVE_SOFTWARE_HERITAGE_HOMEPAGE}/badge/${relatedItem.value}`} alt={relatedItem.value} />
          </Link>
          <iframe className="articleDetails-content-article-section-content-linkedPublications-swh-embed" src={`${import.meta.env.VITE_ARCHIVE_SOFTWARE_HERITAGE_HOMEPAGE}/browse/embed/${relatedItem.value}`}></iframe>
        </div>
      )
    }

    if (relatedItem.identifierType === LINKED_PUBLICATION_IDENTIFIER_TYPE.OTHER && relatedItem.value.includes('https')) {
      return <Link to={relatedItem.value} className="articleDetails-content-article-section-content-linkedPublications-uri" target="_blank">{relatedItem.value}</Link>
    }

    return <>{relatedItem.value}</>
  }

  const getCitedBySection = (): JSX.Element | null  => {
    if (!article?.citations || !article.citations.length) return null

    return (
      <ul className="articleDetails-content-article-section-content-citations-citation">
      {article?.citations.map((citation, index) => (
        <li key={index} className="articleDetails-content-article-section-content-citations-citation">
          <p>{citation.citation}</p>
          {citation.doi && isDOI(citation.doi) && <Link to={`${import.meta.env.VITE_DOI_HOMEPAGE}/${citation.doi}`} className="articleDetails-content-article-section-content-citations-citation-doi" target="_blank">{t('common.doi')} : {citation.doi}</Link>}
        </li>
      ))}
      </ul>
    )
  }

  const getPreviewSection = (): JSX.Element | null => {
    return article?.docLink ? <iframe src={article.docLink} className="articleDetails-content-article-section-content-preview" /> : null
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
          <ArticleMeta language={language} article={article as IArticle | undefined} currentJournal={currentJournal} keywords={getKeywords()} authors={authors} />
          {article?.tag && <div className='articleDetails-tag'>{t(articleTypes.find((tag) => tag.value === article.tag)?.labelPath!)}</div>}
          <div className="articleDetails-content">
            <ArticleDetailsSidebar language={language} t={t} article={article as IArticle | undefined} relatedVolume={relatedVolume} citations={citations} />
            <div className="articleDetails-content-article">
              <h1 className="articleDetails-content-article-title">
                <MathJax dynamic>{article?.title}</MathJax>
              </h1>
              {authors.length > 0 && <>{renderArticleAuthors()}</>}
              {institutions.length > 0 && <div className="articleDetails-content-article-institutions">{renderArticleAuthorsInstitutions()}</div>}
              {renderSection(ARTICLE_SECTION.GRAPHICAL_ABSTRACT, t('pages.articleDetails.sections.graphicalAbstract'), getGraphicalAbstractSection())}
              {renderSection(ARTICLE_SECTION.ABSTRACT, t('pages.articleDetails.sections.abstract'), getAbstractSection())}
              {renderSection(ARTICLE_SECTION.KEYWORDS, t('pages.articleDetails.sections.keywords'), getKeywordsSection())}
              {renderSection(ARTICLE_SECTION.LINKED_PUBLICATIONS, t('pages.articleDetails.sections.linkedPublications'), getLinkedPublicationsSection())}
              {renderSection(ARTICLE_SECTION.CITED_BY, t('pages.articleDetails.sections.citedBy'), getCitedBySection())}
              {renderSection(ARTICLE_SECTION.PREVIEW, t('pages.articleDetails.sections.preview'), getPreviewSection())}
            </div>
          </div>
        </>
      )}
    </main>
  )
}