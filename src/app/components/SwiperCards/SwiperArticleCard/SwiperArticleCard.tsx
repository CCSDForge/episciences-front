import { Link } from 'react-router-dom';
import { TFunction } from 'i18next';

import { PATHS } from '../../../../config/paths';
import { FetchedArticle } from '../../../../utils/article';
import { articleTypes } from '../../../../utils/article';
import { formatDate } from '../../../../utils/date';
import { AvailableLanguage } from '../../../../utils/i18n';
import './SwiperArticleCard.scss'

export type SwiperArticleCardProps = FetchedArticle;

interface ISwiperArticleCardProps {
  language: AvailableLanguage;
  t: TFunction<"translation", undefined>
  article: FetchedArticle;
}

export default function SwiperArticleCard({ language, t, article }: ISwiperArticleCardProps): JSX.Element {
  return (
    <div className='swiperArticleCard'>
      {article?.tag && <div className='swiperArticleCard-tag'>{t(articleTypes.find((tag) => tag.value === article.tag)?.labelPath!)}</div>}
      <Link to={`/${PATHS.articles}/${article?.id}`}>
        <div className='swiperArticleCard-title'>{article?.title}</div>
      </Link>
      <div className='swiperArticleCard-authors'>{article?.authors}</div>
      <div className='swiperArticleCard-publicationDate'>{formatDate(article?.publicationDate!, language)}</div>
    </div>
  )
}