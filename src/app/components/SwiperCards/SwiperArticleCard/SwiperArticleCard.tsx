import { Link } from 'react-router-dom';
import { TFunction } from 'i18next';

import { PATHS } from '../../../../config/paths';
import { FetchedArticle } from '../../../../utils/article';
import { articleTypes } from '../../../../utils/article';
import { formatDate } from '../../../../utils/date';
import { AvailableLanguage } from '../../../../utils/i18n';
import { SwiperCardType } from '../SwiperCard';
import './SwiperArticleCard.scss'

export type SwiperArticleCardProps = FetchedArticle;

interface ISwiperArticleCardProps {
  language: AvailableLanguage;
  t: TFunction<"translation", undefined>
  type: SwiperCardType
  article: FetchedArticle;
}

export default function SwiperArticleCard({ language, t, type, article }: ISwiperArticleCardProps): JSX.Element {
  const authors = (): string => {
    const splitAuthors = article?.authors.split(',') ?? []

    if (splitAuthors.length > 3) {
      return `${splitAuthors.splice(0, 3).join(',')} et al`
    }

    return splitAuthors.join(',')
  }

  return (
    <div className='swiperArticleCard'>
      {article?.tag && <div className='swiperArticleCard-tag'>{t(articleTypes.find((tag) => tag.value === article.tag)?.labelPath!)}</div>}
      {type === 'article-accepted' ? (
        article?.docLink ? (
          <Link to={article?.docLink} target='_blank'>
            <div className='swiperArticleCard-title'>{article?.title}</div>
          </Link>
        ) : (
          <div className='swiperArticleCard-title'>{article?.title}</div>
        )
      ) : (
        <Link to={`/${PATHS.articles}/${article?.id}`}>
          <div className='swiperArticleCard-title'>{article?.title}</div>
        </Link>
      )}
      <div className='swiperArticleCard-authors'>{authors()}</div>
      <div className='swiperArticleCard-publicationDate'>{formatDate(article?.publicationDate!, language)}</div>
    </div>
  )
}