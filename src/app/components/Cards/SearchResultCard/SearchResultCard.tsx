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
import './SearchResultCard.scss'

export interface ISearchResultCard extends IArticle {
  openedAbstract: boolean;
}

interface ISearchResultCardProps {
  language: AvailableLanguage;
  rvcode?: string;
  t: TFunction<"translation", undefined>
  searchResult: ISearchResultCard;
  toggleAbstractCallback: () => void;
}

export default function SearchResultCard({ language, rvcode, t, searchResult, toggleAbstractCallback }: ISearchResultCardProps): JSX.Element {
  const [citations, setCitations] = useState<ICitation[]>([]);
  const [showCitationsDropdown, setShowCitationsDropdown] = useState(false)

  const { data: metadataCSL } = useFetchArticleMetadataQuery({ rvcode: rvcode!, paperid: searchResult.id.toString(), type: METADATA_TYPE.CSL }, { skip: !searchResult.id || !rvcode });
  const { data: metadataBibTeX } = useFetchArticleMetadataQuery({ rvcode: rvcode!, paperid: searchResult.id.toString(), type: METADATA_TYPE.BIBTEX }, { skip: !searchResult.id || !rvcode });

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
    <div className="searchResultCard">
      {searchResult.tag && <div className='searchResultCard-tag'>{t(articleTypes.find((tag) => tag.value === searchResult.tag)?.labelPath!)}</div>}
      <Link to={`/${PATHS.articles}/${searchResult.id}`}>
        <div className='searchResultCard-title'>
          <MathJax dynamic>{searchResult.title}</MathJax>
        </div>
      </Link>
      <div className='searchResultCard-authors'>{searchResult.authors.map(author => author.fullname).join(', ')}</div>
      {searchResult.abstract && (
        <div className='searchResultCard-abstract'>
          <div className={`searchResultCard-abstract-title ${!searchResult.openedAbstract && 'searchResultCard-abstract-title-closed'}`} onClick={toggleAbstractCallback}>
            <div className='searchResultCard-abstract-title-text'>{t('common.abstract')}</div>
            {searchResult.openedAbstract ? (
              <img className='searchResultCard-abstract-title-caret' src={caretUp} alt='Caret up icon' />
            ) : (
              <img className='searchResultCard-abstract-title-caret' src={caretDown} alt='Caret down icon' />
            )}
          </div>
          <div className={`searchResultCard-abstract-content ${searchResult.openedAbstract && 'searchResultCard-abstract-content-opened'}`}>
            <DisplayAbstract abstract={searchResult.abstract} language={language} />
          </div>
        </div>
      )}
      <div className='searchResultCard-anchor'>
        <div className='searchResultCard-anchor-publicationDate'>{`${t('common.publishedOn')} ${formatDate(searchResult?.publicationDate!, language)}`}</div>
        <div className="searchResultCard-anchor-icons">
          {searchResult.pdfLink && (
            <Link to={`/${PATHS.articles}/${searchResult.id}/download`}>
              <div className="searchResultCard-anchor-icons-download">
                <img className="searchResultCard-anchor-icons-download-icon" src={download} alt='Download icon' />
                <div className="searchResultCard-anchor-icons-download-text">{t('common.pdf')}</div>
              </div>
            </Link>
          )}
          {citations.length > 0 && (
            <div
              ref={citationsDropdownRef}
              className="searchResultCard-anchor-icons-cite"
              onMouseEnter={(): void => setShowCitationsDropdown(true)}
              onMouseLeave={(): void => setShowCitationsDropdown(false)}
              onTouchStart={(): void => setShowCitationsDropdown(!showCitationsDropdown)}
            >
              <img className="searchResultCard-anchor-icons-cite-icon" src={quote} alt='Cite icon' />
              <div className="searchResultCard-anchor-icons-cite-text">{t('common.cite')}</div>
              <div className={`searchResultCard-anchor-icons-cite-content ${showCitationsDropdown && 'searchResultCard-anchor-icons-cite-content-displayed'}`}>
                <div className='searchResultCard-anchor-icons-cite-content-links'>
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