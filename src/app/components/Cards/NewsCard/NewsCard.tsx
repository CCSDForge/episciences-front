import { Link } from 'react-router-dom';

import externalLink from '/icons/external-link-red.svg';
import { INews } from '../../../../types/news';
import { formatDate } from '../../../../utils/date';
import { RENDERING_MODE } from '../../../../utils/card';
import { AvailableLanguage } from '../../../../utils/i18n';
import './NewsCard.scss'

interface INewsCardTile {
  fullCard: boolean;
  blurCard: boolean;
  setFullNewsIndexCallback: () => void;
}

interface INewsCardProps extends INewsCardTile {
  language: AvailableLanguage;
  mode: RENDERING_MODE;
  news: INews;
}

export default function NewsCard({ language, mode, fullCard, blurCard, setFullNewsIndexCallback, news }: INewsCardProps): JSX.Element {
  if (mode === RENDERING_MODE.TILE) {
    if (fullCard) {
      return (
        <div className='newsCard newsCard-tile newsCard-tile-full' onClick={setFullNewsIndexCallback}>
          <div className='newsCard-tile-full-initial'>
            <div className='newsCard-content'>
              <div className='newsCard-content-title'>{news.title[language]}</div>
              <div className='newsCard-content-author newsCard-content-author-tile'>{news.author}</div>
              <div className='newsCard-tile-anchor'>
                <div className='newsCard-publicationDate newsCard-publicationDate-tile'>{formatDate(news.publicationDate, language)}</div>
              </div>
            </div>
          </div>
          <div className='newsCard-tile-full-expanded'>
            {news.content && <div className='newsCard-content-content'>{news.content[language]}</div>}
            {news.link && (
              <div className='newsCard-content-read newsCard-content-read-full'>
                <Link to={news.link} target='_blank' onClick={(e) => e.stopPropagation()}>
                  <img src={externalLink} alt='External link icon' />
                  <div className='newsCard-content-read-text'>Read</div>
                </Link>
              </div>
            )}
          </div>
        </div>
      )
    }

    return (
      <div className={blurCard ? 'newsCard newsCard-tile newsCard-tile-blur' : 'newsCard newsCard-tile'} onClick={setFullNewsIndexCallback}>
        <div className='newsCard-content'>
          <div className='newsCard-content-title'>{news.title[language]}</div>
          <div className='newsCard-content-author newsCard-content-author-tile'>{news.author}</div>
          <div className='newsCard-tile-anchor'>
            <div className='newsCard-publicationDate newsCard-publicationDate-tile'>{formatDate(news.publicationDate, language)}</div>
            {news.link && (
              <div className='newsCard-content-read'>
                <Link to={news.link} target='_blank' onClick={(e) => e.stopPropagation()}>
                  <img src={externalLink} alt='External link icon' />
                  <div className='newsCard-content-read-text'>Read</div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='newsCard'>
      <div className='newsCard-publicationDate'>{formatDate(news.publicationDate, language)}</div>
      <div className='newsCard-content'>
        <div className='newsCard-content-title'>{news.title[language]}</div>
        <div className='newsCard-content-author'>{news.author}</div>
        {news.content && <div className='newsCard-content-content'>{news.content[language]}</div>}
        {news.link && (
          <div className='newsCard-content-read'>
            <Link to={news.link} target='_blank' onClick={(e) => e.stopPropagation()}>
              <img src={externalLink} alt='External link icon' />
              <div className='newsCard-content-read-text'>Read</div>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}