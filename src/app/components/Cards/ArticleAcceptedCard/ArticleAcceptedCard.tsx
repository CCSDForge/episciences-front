import { Link } from 'react-router-dom';
import { TFunction } from 'i18next';
import { MathJax } from 'better-react-mathjax';

import caretUp from '/icons/caret-up-red.svg';
import caretDown from '/icons/caret-down-red.svg';
import download from '/icons/download-red.svg';
import { IArticle } from "../../../../types/article";
import { articleTypes } from '../../../../utils/article';
import { formatDate } from '../../../../utils/date';
import { AvailableLanguage } from '../../../../utils/i18n';
import DisplayAbstract from '../DisplayAbstract/DisplayAbstract';
import './ArticleAcceptedCard.scss'

export interface IArticleAcceptedCard extends IArticle {
  openedAbstract: boolean;
}

interface IArticleAcceptedCardProps {
  language: AvailableLanguage;
  t: TFunction<"translation", undefined>
  article: IArticleAcceptedCard;
  toggleAbstractCallback: () => void;
}

export default function ArticleAcceptedCard({ language, t, article, toggleAbstractCallback }: IArticleAcceptedCardProps): JSX.Element {
  return (
    <div className="articleAcceptedCard">
      {article.tag && <div className='articleAcceptedCard-tag'>{t(articleTypes.find((tag) => tag.value === article.tag)?.labelPath!)}</div>}
      {article.docLink && (
        <Link to={article.docLink} target='_blank' rel="noopener noreferrer">
          <div className='articleAcceptedCard-title'>
            <MathJax dynamic>{article.title}</MathJax>
          </div>
        </Link>
      )}
      <div className='articleAcceptedCard-authors'>{article.authors.map(author => author.fullname).join(', ')}</div>
      {article.abstract && (
        <div className='articleAcceptedCard-abstract'>
          <div className={`articleAcceptedCard-abstract-title ${!article.openedAbstract && 'articleAcceptedCard-abstract-title-closed'}`} onClick={toggleAbstractCallback}>
            <div className='articleAcceptedCard-abstract-title-text'>{t('common.abstract')}</div>
            {article.openedAbstract ? (
              <img className='articleAcceptedCard-abstract-title-caret' src={caretUp} alt='Caret up icon' />
            ) : (
              <img className='articleAcceptedCard-abstract-title-caret' src={caretDown} alt='Caret down icon' />
            )}
          </div>
          <div className={`articleAcceptedCard-abstract-content ${article.openedAbstract && 'articleAcceptedCard-abstract-content-opened'}`}>
              <DisplayAbstract abstract={article.abstract} language={language} />
          </div>
        </div>
      )}
      <div className='articleAcceptedCard-anchor'>
        {article.acceptanceDate ? (
          <div className='articleAcceptedCard-anchor-acceptanceDate'>{`${t('common.acceptedOn')} ${formatDate(article.acceptanceDate, language)}`}</div>
        ) : (
          <div className='articleAcceptedCard-anchor-acceptanceDate'></div>
        )}
        <div className="articleAcceptedCard-anchor-icons">
          {article.docLink && (
            <Link to={article.docLink} target='_blank' rel="noopener noreferrer">
              <div className="articleAcceptedCard-anchor-icons-download">
                <img className="articleAcceptedCard-anchor-icons-download-download-icon" src={download} alt='Download icon' />
                <div className="articleAcceptedCard-anchor-icons-download-text">{article.repositoryIdentifier}</div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}