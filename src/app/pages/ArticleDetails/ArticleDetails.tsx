import { useState, useEffect, ReactNode, Fragment } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MathJax } from 'better-react-mathjax';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { isMobileOnly } from "react-device-detect";

import caretUpGrey from '/icons/caret-up-grey.svg';
import caretDownGrey from '/icons/caret-down-grey.svg';
import caretUpRed from '/icons/caret-up-red.svg';
import caretDownRed from '/icons/caret-down-red.svg';
import orcid from '/icons/orcid.svg';
import { PATHS } from '../../../config/paths'
import { useAppSelector } from "../../../hooks/store";
import { useFetchArticleMetadataQuery, useFetchArticleQuery } from "../../../store/features/article/article.query";
import { useFetchVolumeQuery } from "../../../store/features/volume/volume.query";
import { IArticle, IArticleAuthor, IArticleRelatedItem } from "../../../types/article";
import { articleTypes, CITATION_TEMPLATE, getCitations, ICitation, INTER_WORK_RELATIONSHIP, interworkRelationShipTypes, LINKED_PUBLICATION_IDENTIFIER_TYPE, METADATA_TYPE } from '../../../utils/article';
import { AvailableLanguage, availableLanguages } from '../../../utils/i18n';
import { decodeText } from "../../../utils/markdown";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Loader from "../../components/Loader/Loader";
import ArticleMeta from "../../components/Meta/ArticleMeta/ArticleMeta";
import ArticleDetailsSidebar from "../../components/Sidebars/ArticleDetailsSidebar/ArticleDetailsSidebar";
import DisplayAbstract from '../../components/Cards/DisplayAbstract/DisplayAbstract';
import PDFViewer from '../../components/PDFViewer/PDFViewer';
import './ArticleDetails.scss'


enum ARTICLE_SECTION {
  GRAPHICAL_ABSTRACT = 'graphicalAbstract',
  ABSTRACT = 'abstract',
  KEYWORDS = 'keywords',
  REFERENCES = 'references',
  LINKED_PUBLICATIONS = 'linkedPublications',
  CITED_BY = 'citedBy',
  PREVIEW = 'preview'
}

interface EnhancedArticleAuthor extends IArticleAuthor {
  institutionsKeys: number[];
}

const MAX_BREADCRUMB_TITLE = 20;

export default function ArticleDetails(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const language = useAppSelector(state => state.i18nReducer.language)
  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code)
  const currentJournal = useAppSelector(state => state.journalReducer.currentJournal);
  
  const { id } = useParams();
  const { data: article, isFetching: isFetchingArticle, isError, error } = useFetchArticleQuery({ paperid: id! }, { skip: !id });
  const { data: relatedVolume, isFetching: isFetchingVolume } = useFetchVolumeQuery({ rvcode: rvcode!, vid: (article && article.volumeId ? article.volumeId.toString() : ''), language: language }, { skip: !article || !article?.volumeId || !rvcode })
  const { data: metadataCSL, isFetching: isFetchingMetadataCSL } = useFetchArticleMetadataQuery({ rvcode: rvcode!, paperid: id!, type: METADATA_TYPE.CSL }, { skip: !id || !rvcode });
  const { data: metadataBibTeX, isFetching: isFetchingMetadataBibTeX } = useFetchArticleMetadataQuery({ rvcode: rvcode!, paperid: id!, type: METADATA_TYPE.BIBTEX }, { skip: !id || !rvcode });


  const [openedSections, setOpenedSections] = useState<{ key: ARTICLE_SECTION, isOpened: boolean }[]>([
    { key: ARTICLE_SECTION.GRAPHICAL_ABSTRACT, isOpened: true },
    { key: ARTICLE_SECTION.ABSTRACT, isOpened: true },
    { key: ARTICLE_SECTION.KEYWORDS, isOpened: true },
    { key: ARTICLE_SECTION.REFERENCES, isOpened: true },
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

  const renderArticleAuthors = (isMobile: boolean): JSX.Element => {
    if (!authors || !authors.length) return <></>;
  
    const formattedAuthors = authors.map((author, index) => {
      const authorName = (
        <>
          {author.fullname}
          {author.orcid && (
            <Link to={`${author.orcid}`} title={author.orcid} target='_blank' rel="noopener noreferrer">
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
      <div className={`articleDetails-content-article-authors articleDetails-content-article-authors-withInstitutions ${isMobile && 'articleDetails-content-article-authors-withInstitutions-mobile'}`}>
        <div>{formattedAuthors}</div>
        <img className='articleDetails-content-article-authors-withInstitutions-caret' src={openedInstitutions ? caretUpGrey : caretDownGrey} alt={openedInstitutions ? 'Caret up icon' : 'Caret down icon'} onClick={(): void => setOpenedInstitutions(!openedInstitutions)} />
      </div>
    ) : (
      <div className={`articleDetails-content-article-authors ${isMobile && 'articleDetails-content-article-authors-mobile'}`}>{formattedAuthors}</div>
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

  const renderArticleTitleAndAuthors = (isMobile: boolean): JSX.Element => {
    return (
      <>
        <h1 className={`articleDetails-content-article-title ${isMobile && 'articleDetails-content-article-title-mobile'}`}>
          <MathJax dynamic>{article?.title}</MathJax>
        </h1>
        {authors.length > 0 && <>{renderArticleAuthors(isMobile)}</>}
        {institutions.length > 0 && <div className={`articleDetails-content-article-institutions ${isMobile && 'articleDetails-content-article-institutions-mobile'}`}>{renderArticleAuthorsInstitutions()}</div>}
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
    
    return graphicalAbstractURL ? <img src={graphicalAbstractURL} className="articleDetails-content-article-section-content-graphicalAbstract" alt="Graphical abstract" /> : null
  }

  const getAbstractSection = (): JSX.Element | null => {
    return article?.abstract ?
        <DisplayAbstract abstract={article.abstract} language={language} /> :
        null;
  }

  const [selectedKeywordsLanguage, setSelectedKeywordsLanguage] = useState<AvailableLanguage>(language as AvailableLanguage);

  const getAvailableKeywordsLanguages = (): AvailableLanguage[] => {
    if (!article?.keywords) return [];

    if (Array.isArray(article.keywords)) return [];

    return Object.keys(article.keywords)
        .filter(key => !key.match(/^\d+$/)) as AvailableLanguage[];
  };

  const availableKeywordsLanguages = getAvailableKeywordsLanguages();

  useEffect(() => {
    if (availableKeywordsLanguages.length > 0 && !availableKeywordsLanguages.includes(selectedKeywordsLanguage)) {
      setSelectedKeywordsLanguage(availableKeywordsLanguages[0]);
    }
  }, [availableKeywordsLanguages]);

  const getKeywordsByLanguage = (lang: AvailableLanguage): string[] => {

    if (!article?.keywords || Array.isArray(article.keywords) || !article.keywords[lang]) return [];

    return Array.isArray(article.keywords[lang])
        ? article.keywords[lang]
        : [article.keywords[lang]];
  };

  const getKeywords = (): string[] => {
    const keywords: string[] = []

    if (!article?.keywords) return keywords

    if (Array.isArray(article.keywords)) {
      return article.keywords;
    }

    Object.entries(article.keywords).forEach(([key, values]) => {
      if (key === language) {
        keywords.push(...(Array.isArray(values) ? values : [values]));
      } else if (!availableLanguages.includes(key as AvailableLanguage) && !key.match(/^\d+$/)) {
        // Ajouter les valeurs qui ne sont ni des langues ni des indices numériques
        keywords.push(...(Array.isArray(values) ? values : [values]));
      }
    });

    return keywords
  }


  const getKeywordsSection = (): JSX.Element | null => {

    if (!article?.keywords) return null;

    //CASE 1: Keywords is a direct array
    if (Array.isArray(article.keywords)) {
      return (
          <div className="articleDetails-content-article-section-content-keywords-container">
            <div className="keywords-list">
              {article.keywords.map((keyword, index) => (
                  <div
                      key={`keyword-${index}`}
                      className="articleDetails-content-article-section-content-keywords-tag"
                  >
                    {keyword}
                  </div>
              ))}
            </div>
          </div>
      );
    }

    //  CASE 2: Keywords is an object with different languages
    const availableKeywordsLanguages = getAvailableKeywordsLanguages();
    if (availableKeywordsLanguages.length === 0) return null;
    const keywords = getKeywordsByLanguage(selectedKeywordsLanguage);

    return (
        <div className="articleDetails-content-article-section-content-keywords-container">
              {availableKeywordsLanguages.length > 1 && (
                  <div className="keywords-header">
                    <div className="language-selector">
                      <div className="language-buttons">
                    {availableKeywordsLanguages.map(lang => (
                        <button
                            key={lang}
                            type="button"
                            className={`language-button ${lang === selectedKeywordsLanguage ? 'active' : ''}`}
                            onClick={() => setSelectedKeywordsLanguage(lang)}
                        >
                          {lang.toUpperCase()}
                        </button>
                    ))}
                  </div>
                    </div>
                    </div>
              )}

          {keywords.length > 0 && (
              <div className="keywords-list">
                {keywords.map((keyword, index) => (
                    <div
                        key={`keyword-${index}`}
                        className="articleDetails-content-article-section-content-keywords-tag"
                    >
                      {keyword}
                    </div>
                ))}
              </div>
          )}
        </div>
    );
  }

  const getLinkedPublicationsSection = (): JSX.Element | null => {
    if (!article?.relatedItems || !article.relatedItems.length) return null

    const filteredItems = article.relatedItems.filter(
        (relatedItem) =>
            relatedItem.relationshipType !== INTER_WORK_RELATIONSHIP.IS_SAME_AS &&
            relatedItem.relationshipType !== INTER_WORK_RELATIONSHIP.HAS_PREPRINT
    )

    if (!filteredItems.length) return null

    return (
        <ul>
          {filteredItems.map((relatedItem, index) => (
              <li key={index}>{getLinkedPublicationRow(relatedItem)}</li>
          ))}
        </ul>
    )
  }

  const getLinkedPublicationRow = (relatedItem: IArticleRelatedItem): JSX.Element => {
    const relationship = interworkRelationShipTypes.find(relationship => relationship.value === relatedItem.relationshipType)?.labelPath

    if (relatedItem.citation) {
      return (
          <div className="articleDetails-content-article-section-content-linkedPublications-publication">
          {relationship && <div className="articleDetails-content-article-section-content-linkedPublications-publication-badge">{t(relationship)}</div>}
          <ReactMarkdown remarkPlugins={[remarkGfm]}
            components={{
              a: ({ ...props }) => <Link to={props.href!} target='_blank' rel="noopener noreferrer" className="articleDetails-content-article-section-content-linkedPublications-publication-markdown-link">{props.children?.toString()}</Link>
            }}
          >
            {decodeText(relatedItem.citation)}
          </ReactMarkdown>
        </div>
      )
    }

    if (relatedItem.identifierType === LINKED_PUBLICATION_IDENTIFIER_TYPE.URI) {
      return (
        <div className="articleDetails-content-article-section-content-linkedPublications-publication">
          {relationship && <div className="articleDetails-content-article-section-content-linkedPublications-publication-badge">{t(relationship)}</div>}
          <Link to={relatedItem.value} className="articleDetails-content-article-section-content-linkedPublications-publication-uri" target="_blank" rel="noopener noreferrer">{relatedItem.value}</Link>
        </div>
      )
    }

    if (relatedItem.identifierType === LINKED_PUBLICATION_IDENTIFIER_TYPE.DOI) {
      return (
        <div className="articleDetails-content-article-section-content-linkedPublications-publication">
          {relationship && <div className="articleDetails-content-article-section-content-linkedPublications-publication-badge">{t(relationship)}</div>}
          <Link to={`${import.meta.env.VITE_DOI_HOMEPAGE}/${relatedItem.value}`} className="articleDetails-content-article-section-content-linkedPublications-publication-doi" target="_blank" rel="noopener noreferrer">{relatedItem.value}</Link>
        </div>
      )
    }

    if (relatedItem.identifierType === LINKED_PUBLICATION_IDENTIFIER_TYPE.ARXIV) {
      return (
        <div className="articleDetails-content-article-section-content-linkedPublications-publication">
          {relationship && <div className="articleDetails-content-article-section-content-linkedPublications-publication-badge">{t(relationship)}</div>}
          <Link to={`${import.meta.env.VITE_ARXIV_HOMEPAGE}/abs/${relatedItem.value}`} className="articleDetails-content-article-section-content-linkedPublications-publication-arxiv" target="_blank" rel="noopener noreferrer">{relatedItem.value}</Link>
        </div>
      )
    }

    if (relatedItem.identifierType === LINKED_PUBLICATION_IDENTIFIER_TYPE.HAL) {
      return (
        <div className="articleDetails-content-article-section-content-linkedPublications-publication">
          {relationship && <div className="articleDetails-content-article-section-content-linkedPublications-publication-badge">{t(relationship)}</div>}
          <Link to={`${import.meta.env.VITE_HAL_HOMEPAGE}/${relatedItem.value}`} className="articleDetails-content-article-section-content-linkedPublications-publication-hal" target="_blank" rel="noopener noreferrer">{relatedItem.value}</Link>
        </div>
      )
    }

    if (relatedItem.identifierType === LINKED_PUBLICATION_IDENTIFIER_TYPE.OTHER && relatedItem.value.includes('swh')) {
      return (
        <div className="articleDetails-content-article-section-content-linkedPublications-publication">
          {relationship && <div className="articleDetails-content-article-section-content-linkedPublications-publication-badge">{t(relationship)}</div>}
          <Link to={`${import.meta.env.VITE_ARCHIVE_SOFTWARE_HERITAGE_HOMEPAGE}/${relatedItem.value}`} target='_blank' rel="noopener noreferrer">
            <img className="articleDetails-content-article-section-content-linkedPublications-publication-img" src={`${import.meta.env.VITE_ARCHIVE_SOFTWARE_HERITAGE_HOMEPAGE}/badge/${relatedItem.value}`} alt={relatedItem.value} />
          </Link>
          <iframe title="Software preview" loading={"lazy"} className="articleDetails-content-article-section-content-linkedPublications-publication-embed" src={`${import.meta.env.VITE_ARCHIVE_SOFTWARE_HERITAGE_HOMEPAGE}/browse/embed/${relatedItem.value}`}></iframe>
        </div>
      )
    }

    if (relatedItem.identifierType === LINKED_PUBLICATION_IDENTIFIER_TYPE.OTHER && relatedItem.value.includes('https')) {
      return (
        <div className="articleDetails-content-article-section-content-linkedPublications-publication">
          {relationship && <div className="articleDetails-content-article-section-content-linkedPublications-publication-badge">{t(relationship)}</div>}
          <Link to={relatedItem.value} className="articleDetails-content-article-section-content-linkedPublications-publication-uri" target="_blank" rel="noopener noreferrer">{relatedItem.value}</Link>
        </div>
      )
    }

    return (
      <div className="articleDetails-content-article-section-content-linkedPublications-publication">
        {relationship && <div className="articleDetails-content-article-section-content-linkedPublications-publication-badge">{t(relationship)}</div>}
        <div>{relatedItem.value}</div>
      </div>
    )
  }

  const getReferencesSection = (): JSX.Element | null  => {
    if (!article?.references || !article.references.length) return null

    return (
      <ol className="articleDetails-content-article-section-content-references">
      {article?.references.map((reference, index) => (
        <li key={index} className="articleDetails-content-article-section-content-references-reference">
          <p>{reference.citation}</p>
          {reference.doi && <Link to={`${import.meta.env.VITE_DOI_HOMEPAGE}/${reference.doi}`} className="articleDetails-content-article-section-content-references-reference-doi" target="_blank" rel="noopener noreferrer">{t('common.doi')} : {reference.doi}</Link>}
        </li>
      ))}
      </ol>
    )
  }

  const getCitedBySection = (): JSX.Element | null  => {
    if (!article?.citedBy || !article.citedBy.length) return null

    return (
      <div className="articleDetails-content-article-section-content-citedBy">
      {article?.citedBy.map((cb, index) => (
        <div key={index} className="articleDetails-content-article-section-content-citedBy-row">
          <p className="articleDetails-content-article-section-content-citedBy-row-source">
            {t('pages.articleDetails.citedBySection.source')}{cb.source}
          </p>
          <ul className="articleDetails-content-article-section-content-citedBy-row-citations">
            {cb.citations.map((citation, index) => (
              <li key={index} className="articleDetails-content-article-section-content-citedBy-row-citations-citation">
                <p className="articleDetails-content-article-section-content-citedBy-row-citations-citation-title">{citation.title}</p>
                <p className="articleDetails-content-article-section-content-citedBy-row-citations-citation-source">
                  {citation.sourceTitle}
                </p>
                <p className="articleDetails-content-article-section-content-citedBy-row-citations-citation-authors">
                  {t('pages.articleDetails.citedBySection.authors')} : {citation.authors.map<ReactNode>((author, index) => (
                      <Fragment key={index}>
                        <span>{author.fullname}</span>
                        {author.orcid && (
                          <Link to={`${import.meta.env.VITE_ORCID_HOMEPAGE}/${author.orcid}`} title={author.orcid} target='_blank' rel="noopener noreferrer">
                            {' '}
                            <img src={orcid} alt='ORCID icon' />
                          </Link>
                        )}
                      </Fragment>
                  )).reduce((prev, curr) => [prev, ', ', curr])}
                  </p>
                <p className="articleDetails-content-article-section-content-citedBy-row-citations-citation-reference">
                  {t('pages.articleDetails.citedBySection.reference')} : {t('pages.articleDetails.citedBySection.volume')} {citation.reference.volume}, {citation.reference.year}, {t('pages.articleDetails.citedBySection.page')} {citation.reference.page}
                </p>
                <Link to={`${import.meta.env.VITE_DOI_HOMEPAGE}/${article.doi}`} className="articleDetails-content-article-section-content-citedBy-row-citations-citation-doi" target="_blank" rel="noopener noreferrer">{t('pages.articleDetails.citedBySection.doi')} : {citation.doi}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      </div>
    )
  }

  const getPreviewSection = (): JSX.Element | null => {
    return article?.pdfLink ? (
      <div className="articleDetails-content-article-section-content-preview">
        <PDFViewer pdfUrl={article.pdfLink} />
      </div>
    ) : null
  }

  const renderMetrics = (): JSX.Element | undefined => {
    if (article?.metrics && (article.metrics.views > 0 || article.metrics.downloads > 0)) {
      return (
        <div className='articleDetailsSidebar-metrics'>
          <div className='articleDetailsSidebar-metrics-title'>{t('pages.articleDetails.metrics.title')}</div>
          <div className='articleDetailsSidebar-metrics-data'>
            <div className='articleDetailsSidebar-metrics-data-row'>
              <div className='articleDetailsSidebar-metrics-data-row-number'>{article.metrics.views}</div>
              <div className='articleDetailsSidebar-metrics-data-row-text'>{t('pages.articleDetails.metrics.views')}</div>
            </div>
            <div className='articleDetailsSidebar-metrics-data-divider'></div>
            <div className='articleDetailsSidebar-metrics-data-row'>
              <div className='articleDetailsSidebar-metrics-data-row-number'>{article.metrics.downloads}</div>
              <div className='articleDetailsSidebar-metrics-data-row-text'>{t('pages.articleDetails.metrics.downloads')}</div>
            </div>
          </div>
        </div>
      )
    }

    return;
  }

  useEffect(() => {
    if (!article && isError && (error as FetchBaseQueryError)?.status) {
      navigate(PATHS.home);
    }
  }, [article, isError, error])

  useEffect(() => {
    const fetchCitations = async () => {
      const fetchedCitations = await getCitations(metadataCSL as string);
      fetchedCitations.push({
        key: CITATION_TEMPLATE.BIBTEX,
        citation: metadataBibTeX as string
      })

      setCitations(fetchedCitations);
    };

    fetchCitations();
  }, [metadataCSL, metadataBibTeX]);

  return (
    <main className='articleDetails'>
      <Breadcrumb parents={[
        { path: 'home', label: `${t('pages.home.title')} > ${t('common.content')} >` },
        { path: 'articles', label: `${t('pages.articles.title')} >` }
      ]} crumbLabel={article ? article.title.length > MAX_BREADCRUMB_TITLE ? `${article.title.substring(0, MAX_BREADCRUMB_TITLE)} ...` : `${article?.title}` : ''} />
      {(isFetchingArticle || isFetchingVolume || isFetchingMetadataCSL || isFetchingMetadataBibTeX) ? (
        <Loader />
      ) : (
        <>
          <ArticleMeta language={language} article={article as IArticle | undefined} currentJournal={currentJournal} keywords={getKeywords()} authors={authors} />
          {article?.tag && <div className='articleDetails-tag'>{t(articleTypes.find((tag) => tag.value === article.tag)?.labelPath!)}</div>}
          <div className="articleDetails-content">
            {renderArticleTitleAndAuthors(true)}
            <ArticleDetailsSidebar language={language} t={t} article={article as IArticle | undefined} relatedVolume={relatedVolume} citations={citations} metrics={renderMetrics()} />
            <div className="articleDetails-content-article">
              {renderArticleTitleAndAuthors(false)}
              {renderSection(ARTICLE_SECTION.GRAPHICAL_ABSTRACT, t('pages.articleDetails.sections.graphicalAbstract'), getGraphicalAbstractSection())}
              {renderSection(ARTICLE_SECTION.ABSTRACT, t('pages.articleDetails.sections.abstract'), getAbstractSection())}
              {renderSection(ARTICLE_SECTION.KEYWORDS, t('pages.articleDetails.sections.keywords'), getKeywordsSection())}
              {renderSection(ARTICLE_SECTION.LINKED_PUBLICATIONS, t('pages.articleDetails.sections.linkedPublications'), getLinkedPublicationsSection())}
              {renderSection(ARTICLE_SECTION.CITED_BY, t('pages.articleDetails.sections.citedBy'), getCitedBySection())}
              {renderSection(ARTICLE_SECTION.REFERENCES, t('pages.articleDetails.sections.references'), getReferencesSection())}
              {renderSection(ARTICLE_SECTION.PREVIEW, t('pages.articleDetails.sections.preview'), getPreviewSection())}
              {isMobileOnly && renderMetrics()}
            </div>
          </div>
        </>
      )}
    </main>
  )
}