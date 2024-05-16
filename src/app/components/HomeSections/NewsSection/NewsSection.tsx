import { INews } from '../../../../types/news';
import './NewsSection.scss'

interface INewsSectionProps {
  news: INews[];
}

export default function NewsSection({ news }: INewsSectionProps): JSX.Element {
  return (
    <div className="newsSection">
      {news.map((singleNews, index) => (
        <div key={index} className={`newsSection-row ${index !== news.length - 1 && 'newsSection-row-bordered'}`}>
          <div className="newsSection-row-title">{singleNews.title}</div>
          <div className="newsSection-row-publicationDate">{singleNews.publicationDate}</div>
        </div>
      ))}
    </div>
  )
}