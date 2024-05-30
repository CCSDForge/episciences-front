import { Link } from 'react-router-dom';

import externalLink from '/icons/external-link-red.svg';
import { INews } from '../../../../types/news';
import { formatDate } from '../../../../utils/date';
import { AvailableLanguage } from '../../../../utils/i18n';
import './NewsCard.scss'

interface INewsCardProps {
  language: AvailableLanguage;
  news: INews;
}

export default function NewsCard({ language, news }: INewsCardProps): JSX.Element {
  return (
    <div className='newsCard'>
      <div className='newsCard-publicationDate'>{formatDate(news.publicationDate, language)}</div>
      <div className='newsCard-content'>
        <div className='newsCard-content-title'>{news.title[language]}</div>
        <div className='newsCard-content-author'>{news.author}</div>
        {news.content && <div className='newsCard-content-content'>{news.content[language]}</div>}
        {news.link && (
          <div className='newsCard-content-read'>
            <Link to={news.link} target='_blank'>
              <img src={externalLink} alt='External link icon' />
              <div className='newsCard-content-read-text'>Read</div>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}