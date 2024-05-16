import './SwiperArticleCard.scss'

export interface ISwiperArticleCardProps {
  title: string;
  authors: string;
  publicationDate: string;
  tag: string;
}

export default function SwiperArticleCard({ title, authors, publicationDate, tag }: ISwiperArticleCardProps): JSX.Element {
  return (
    <div className='swiperArticleCard'>
      <div className='swiperArticleCard-tag'>{tag}</div>
      <div className='swiperArticleCard-title'>{title}</div>
      <div className='swiperArticleCard-authors'>{authors}</div>
      <div className='swiperArticleCard-publicationDate'>{publicationDate}</div>
    </div>
  )
}