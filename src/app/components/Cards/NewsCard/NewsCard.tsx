import { Link } from 'react-router-dom';

import externalLink from '/icons/external-link-red.svg';
import { INews } from '../../../../types/news';
import './NewsCard.scss'

type INewsCardProps = INews;

export default function NewsCard({ title, publicationDate, author, description }: INewsCardProps): JSX.Element {
  return (
    <div className='newsCard'>
      <div className='newsCard-publicationDate'>{publicationDate}</div>
      <div className='newsCard-content'>
        <div className='newsCard-content-title'>{title}</div>
        <div className='newsCard-content-author'>{author}</div>
        <div className='newsCard-content-description'>{description}</div>
        <div className='newsCard-content-read'>
          <Link to='/'>
            <img src={externalLink} alt='External link icon' />
            <div className='newsCard-content-read-text'>Read</div>
          </Link>
        </div>
      </div>
    </div>
  )
}