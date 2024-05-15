import './ArticleCard.scss'

export interface IArticleCardProps {
  title: string;
  authors: string;
  publicationDate: string;
  tag: string;
}

export default function ArticleCard({ title, authors, publicationDate, tag }: IArticleCardProps): JSX.Element {
  return (
    <div className='articleCard'>
      <div className='articleCard-tag'>{tag}</div>
      <div className='articleCard-title'>{title}</div>
      <div className='articleCard-authors'>{authors}</div>
      <div className='articleCard-publicationDate'>{publicationDate}</div>
    </div>
  )
}