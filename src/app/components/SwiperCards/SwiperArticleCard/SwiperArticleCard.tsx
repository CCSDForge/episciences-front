import { IArticle } from '../../../../types/article'
import './SwiperArticleCard.scss'

export type ISwiperArticleCardProps = IArticle;

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