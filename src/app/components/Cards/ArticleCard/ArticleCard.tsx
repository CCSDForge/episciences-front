import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TFunction } from 'i18next';
import { MathJax } from 'better-react-mathjax';

import caretUp from '/icons/caret-up-red.svg';
import caretDown from '/icons/caret-down-red.svg';
import download from '/icons/download-red.svg';
import quote from '/icons/quote-red.svg';
import { PATHS } from '../../../../config/paths';
import { IArticle } from "../../../../types/article";
import { ICitation, articleTypes, copyToClipboardCitation, getCitations } from '../../../../utils/article';
import { formatDate } from '../../../../utils/date';
import { AvailableLanguage } from '../../../../utils/i18n';
import './ArticleCard.scss'

export interface IArticleCard extends IArticle {
  openedAbstract: boolean;
}

interface IArticleCardProps {
  language: AvailableLanguage;
  t: TFunction<"translation", undefined>
  article: IArticleCard;
  toggleAbstractCallback: () => void;
}

export default function ArticleCard({ language, t, article, toggleAbstractCallback }: IArticleCardProps): JSX.Element {
  const [citations, setCitations] = useState<ICitation[]>([]);
  const [showCitationsDropdown, setShowCitationsDropdown] = useState(false)

  useEffect(() => {
    const fetchCitations = async () => {
      const fetchedCitations = await getCitations(article?.doi);
      setCitations(fetchedCitations);
    };

    fetchCitations();
  }, [article, article?.doi]);

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
            <MathJax dynamic>{article.abstract}</MathJax>
          </div>
        </div>
      )}
      <div className='articleCard-anchor'>
        <div className='articleCard-anchor-publicationDate'>{`${t('common.publishedOn')} ${formatDate(article?.publicationDate!, language)}`}</div>
        <div className="articleCard-anchor-icons">
          {article.pdfLink && (
            <Link to={article.pdfLink} target='_blank' onClick={(): Promise<Response> => fetch(`/articles/${article.id}/download`)}>
              <div className="articleCard-anchor-icons-download">
                <img className="articleCard-anchor-icons-download-icon" src={download} alt='Download icon' />
                <div className="articleCard-anchor-icons-download-text">{t('common.pdf')}</div>
              </div>
            </Link>
          )}
          {citations.length > 0 && (
            <div className="articleCard-anchor-icons-cite" onMouseEnter={(): void => setShowCitationsDropdown(true)}>
              <img className="articleCard-anchor-icons-cite-icon" src={quote} alt='Cite icon' />
              <div className="articleCard-anchor-icons-cite-text">{t('common.cite')}</div>
              {showCitationsDropdown && (
                <div className='articleCard-anchor-icons-cite-content' onMouseLeave={(): void => setShowCitationsDropdown(false)}>
                  <div className='articleCard-anchor-icons-cite-content-links'>
                    {citations.map((citation, index) => (
                      <span key={index} onClick={(): void => {
                        copyToClipboardCitation(citation, t)
                        setShowCitationsDropdown(false)
                      }}>{citation.key}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}