import { Link } from 'react-router-dom';

import caretUp from '/icons/caret-up-red.svg';
import caretDown from '/icons/caret-down-red.svg';
import download from '/icons/download-red.svg';
import { PATHS } from '../../../../config/paths';
import { IArticle } from "../../../../types/article";
import { articleTypes } from '../../../../utils/article';
import { formatDate } from '../../../../utils/date';
import { AvailableLanguage } from '../../../../utils/i18n';
import './ArticleCard.scss'

export interface IArticleCard extends IArticle {
  openedAbstract: boolean;
}

interface IArticleCardProps {
  language: AvailableLanguage;
  article: IArticleCard;
  toggleAbstractCallback: () => void;
}

export default function ArticleCard({ language, article, toggleAbstractCallback }: IArticleCardProps): JSX.Element {
  return (
    <div className="articleCard">
      {article.tag && <div className='articleCard-tag'>{articleTypes.find((tag) => tag.value === article.tag)?.label}</div>}
      <Link to={`/${PATHS.articles}/${article.id}`}>
        <div className='articleCard-title'>{article.title}</div>
      </Link>
      <div className='articleCard-authors'>{article.authors}</div>
      {article.abstract && (
        <div className='articleCard-abstract'>
          <div className={`articleCard-abstract-title ${!article.openedAbstract && 'articleCard-abstract-title-closed'}`} onClick={toggleAbstractCallback}>
            <div className='articleCard-abstract-title-text'>Abstract</div>
            {article.openedAbstract ? (
              <img className='articleCard-abstract-title-caret' src={caretUp} alt='Caret up icon' />
            ) : (
              <img className='articleCard-abstract-title-caret' src={caretDown} alt='Caret down icon' />
            )}
          </div>
          <div className={`articleCard-abstract-content ${article.openedAbstract && 'articleCard-abstract-content-opened'}`}>{article.abstract}</div>
        </div>
      )}
      <div className='articleCard-anchor'>
        <div className='articleCard-anchor-publicationDate'>{formatDate(article.publicationDate, language)}</div>
        <div className="articleCard-anchor-icons">
          <Link to={article.pdfLink} target='_blank'>
            <div className="articleCard-anchor-icons-download">
              <img className="articleCard-anchor-icons-download-download-icon" src={download} alt='Download icon' />
              <div className="articleCard-anchor-icons-download-text">PDF</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}