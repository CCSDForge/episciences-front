import { useState } from 'react';
import { Link } from 'react-router-dom';

import caretUp from '/icons/caret-up-red.svg';
import caretDown from '/icons/caret-down-red.svg';
import download from '/icons/download-red.svg';
import { PATHS } from '../../../../config/paths';
import { IArticle } from '../../../../types/article';
import { formatDate } from '../../../../utils/date';
import { AvailableLanguage } from '../../../../utils/i18n';
import './VolumeArticleCard.scss'

interface IVolumeArticleCardProps {
  language: AvailableLanguage;
  article: IArticle;
}

export default function VolumeArticleCard({ language, article }: IVolumeArticleCardProps): JSX.Element {
  const [openedAbstract, setOpenedAbstract] = useState(false)

  const toggleAbstract = (): void => setOpenedAbstract(!openedAbstract)

  return (
    <div className="volumeArticleCard">
      {/* TODO */}
      {/* <div className='volumeArticleCard-tag'>{tag}</div> */}
      <Link to={`/${PATHS.articles}/${article.id}`}>
        <div className='volumeArticleCard-title'>{article.title}</div>
      </Link>
      <div className='volumeArticleCard-authors'>{article.authors}</div>
      <div className='volumeArticleCard-abstract'>
        <div className={`volumeArticleCard-abstract-title ${!openedAbstract && 'volumeArticleCard-abstract-title-closed'}`} onClick={toggleAbstract}>
          <div className='volumeArticleCard-abstract-title-text'>Abstract</div>
          {openedAbstract ? (
            <img className='volumeArticleCard-abstract-title-caret' src={caretUp} alt='Caret up icon' />
          ) : (
            <img className='volumeArticleCard-abstract-title-caret' src={caretDown} alt='Caret down icon' />
          )}
        </div>
        <div className={`volumeArticleCard-abstract-content ${openedAbstract && 'volumeArticleCard-abstract-content-opened'}`}>{article.abstract}</div>
      </div>
      <div className='volumeArticleCard-anchor'>
        <div className='volumeArticleCard-anchor-publicationDate'>{formatDate(article.publicationDate, language)}</div>
        <div className="volumeArticleCard-anchor-icons">
          <Link to={article.pdfLink} target='_blank'>
            <div className="volumeArticleCard-anchor-icons-download">
              <img className="volumeArticleCard-anchor-icons-download-download-icon" src={download} alt='Download icon' />
              <div className="volumeArticleCard-anchor-icons-download-text">PDF</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}