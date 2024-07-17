import { TFunction } from 'i18next';

import { INews } from '../../../../types/news';
import { formatDate } from '../../../../utils/date';
import { AvailableLanguage } from '../../../../utils/i18n';
import './NewsSection.scss'

interface INewsSectionProps {
  language: AvailableLanguage;
  t: TFunction<"translation", undefined>
  news: INews[];
}

export default function NewsSection({ language, t, news }: INewsSectionProps): JSX.Element {
  return (
    <div className="newsSection">
      {news.map((singleNews, index) => (
        <div key={index} className={`newsSection-row ${index !== news.length - 1 && 'newsSection-row-bordered'}`}>
          <div className="newsSection-row-title">{singleNews.title[language]}</div>
          <div className="newsSection-row-publicationDate">{`${t('common.publishedOn')} ${formatDate(singleNews.publicationDate, language, { month: 'short' })}`}</div>
        </div>
      ))}
    </div>
  )
}