import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { TFunction } from 'i18next';
import { MathJax } from 'better-react-mathjax';

import caretUp from '/icons/caret-up-red.svg';
import caretDown from '/icons/caret-down-red.svg';
import download from '/icons/download-red.svg';
import quote from '/icons/quote-red.svg';
import { PATHS } from '../../../../config/paths';
import { useFetchArticleMetadataQuery } from '../../../../store/features/article/article.query';
import { IArticle } from "../../../../types/article";
import { CITATION_TEMPLATE, ICitation, METADATA_TYPE, articleTypes, copyToClipboardCitation, getCitations } from '../../../../utils/article';
import { formatDate } from '../../../../utils/date';
import { AvailableLanguage } from '../../../../utils/i18n';
import DisplayAbstract from '../DisplayAbstract/DisplayAbstract';
import './ArticleCard.scss'


export interface IArticleCard extends IArticle {
  openedAbstract: boolean;
}

interface IArticleCardProps {
  language: AvailableLanguage;
  rvcode?: string;
  t: TFunction<"translation", undefined>
  article: IArticleCard;
  toggleAbstractCallback: () => void;
}

export default function ArticleCard({ language, rvcode, t, article, toggleAbstractCallback }: IArticleCardProps): JSX.Element {
  const [citations, setCitations] = useState<ICitation[]>([]);
  const [showCitationsDropdown, setShowCitationsDropdown] = useState(false);

  const { data: metadataCSL } = useFetchArticleMetadataQuery({ rvcode: rvcode!, paperid: article.id.toString(), type: METADATA_TYPE.CSL }, { skip: !article.id || !rvcode });
  const { data: metadataBibTeX } = useFetchArticleMetadataQuery({ rvcode: rvcode!, paperid: article.id.toString(), type: METADATA_TYPE.BIBTEX }, { skip: !article.id || !rvcode });

  const citationsDropdownRef = useRef<HTMLDivElement | null>(null);



  useEffect(() => {
    const handleTouchOutside = (event: TouchEvent): void => {
      if (citationsDropdownRef.current && !citationsDropdownRef.current.contains(event.target as Node)) {
        setShowCitationsDropdown(false);
      }
    };
    
    document.addEventListener('touchstart', handleTouchOutside);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchOutside);
    };
  }, [citationsDropdownRef]);

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

  const copyCitation = (citation: ICitation): void => {
    copyToClipboardCitation(citation, t)
    setShowCitationsDropdown(false)
  }

  return (
    <div className="articleCard">
      {article.tag && <div className='articleCard-tag'>{t(articleTypes.find((tag) => tag.value === article.tag)?.labelPath!)}</div>}
      <Link to={`/${PATHS.articles}/${article.id}`}>
        <div className='articleCard-title'>
          <MathJax dynamic>{article.title}</MathJax>
        </div>
      </Link>
      <div className='articleCard-authors'>{article.authors.map(author => author.fullname).join(', ')}</div>
      {article.abstract && (
        <div className='articleCard-abstract'>
          <div className={`articleCard-abstract-title ${!article.openedAbstract && 'articleCard-abstract-title-closed'}`} onClick={toggleAbstractCallback}>
            <div className='articleCard-abstract-title-text'>{t('common.abstract')}</div>
            {article.openedAbstract ? (
              <img className='articleCard-abstract-title-caret' src={caretUp} alt='Caret up icon' />
            ) : (
              <img className='articleCard-abstract-title-caret' src={caretDown} alt='Caret down icon' />
            )}
          </div>
          <div className={`articleCard-abstract-content ${article.openedAbstract && 'articleCard-abstract-content-opened'}`}>
            <DisplayAbstract abstract={article.abstract} language={language} />
          </div>
        </div>
      )}
      <div className='articleCard-anchor'>
        <div className='articleCard-anchor-publicationDate'>{`${t('common.publishedOn')} ${formatDate(article?.publicationDate!, language)}`}</div>
        <div className="articleCard-anchor-icons">
          {article.pdfLink && (
            <Link to={`/${PATHS.articles}/${article.id}/download`}>
              <div className="articleCard-anchor-icons-download">
                <img className="articleCard-anchor-icons-download-icon" src={download} alt='Download icon' />
                <div className="articleCard-anchor-icons-download-text">{t('common.pdf')}</div>
              </div>
            </Link>
          )}
          {citations.length > 0 && (
            <div
              ref={citationsDropdownRef}
              className="articleCard-anchor-icons-cite"
              onMouseEnter={(): void => setShowCitationsDropdown(true)}
              onMouseLeave={(): void => setShowCitationsDropdown(false)}
              onTouchStart={(): void => setShowCitationsDropdown(!showCitationsDropdown)}
            >
              <img className="articleCard-anchor-icons-cite-icon" src={quote} alt='Cite icon' />
              <div className="articleCard-anchor-icons-cite-text">{t('common.cite')}</div>
              <div className={`articleCard-anchor-icons-cite-content ${showCitationsDropdown && 'articleCard-anchor-icons-cite-content-displayed'}`}>
                <div className='articleCard-anchor-icons-cite-content-links'>
                  {citations.map((citation, index) => (
                    <span key={index} onClick={(): void => copyCitation(citation)} onTouchEnd={(): void => copyCitation(citation)}>{citation.key}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}