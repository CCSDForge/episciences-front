import './SwiperArticleCard.scss'

export interface ISwiperArticleCardProps {
  title: string;
  authors: string;
  publicationDate: string;
  tag: string;
}

export default function SwiperArticleCard({ title, authors, publicationDate, tag }: ISwiperArticleCardProps): JSX.Element {
  return (
    <div className='swiperSwiperArticleCard'>
      <div className='swiperSwiperArticleCard-tag'>{tag}</div>
      <div className='swiperSwiperArticleCard-title'>{title}</div>
      <div className='swiperSwiperArticleCard-authors'>{authors}</div>
      <div className='swiperSwiperArticleCard-publicationDate'>{publicationDate}</div>
    </div>
  )
}