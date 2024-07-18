import { Link } from 'react-router-dom';
import { TFunction } from 'i18next';

import { FetchedArticle, formatArticleAuthors } from '../../../../utils/article';
import { articleTypes } from '../../../../utils/article';
import { formatDate } from '../../../../utils/date';
import { AvailableLanguage } from '../../../../utils/i18n';
import './SwiperArticleAcceptedCard.scss'

export type SwiperArticleAcceptedCardProps = FetchedArticle;

interface ISwiperArticleAcceptedCardProps {
  language: AvailableLanguage;
  t: TFunction<"translation", undefined>
  article: FetchedArticle;
}

export default function SwiperArticleAcceptedCard({ language, t, article }: ISwiperArticleAcceptedCardProps): JSX.Element {
  return (
    <div className='swiperArticleAcceptedCard'>
      {article?.tag && <div className='swiperArticleAcceptedCard-tag'>{t(articleTypes.find((tag) => tag.value === article.tag)?.labelPath!)}</div>}
      <Link to={article?.docLink!} target='_blank'>
        <div className='swiperArticleAcceptedCard-title'>{article?.title}</div>
      </Link>
      <div className='swiperArticleAcceptedCard-authors'>{formatArticleAuthors(article)}</div>
      {article?.acceptanceDate ? (
        <div className='swiperArticleAcceptedCard-acceptanceDate'>{`${t('common.acceptedOn')} ${formatDate(article?.acceptanceDate, language, { month: 'short' })}`}</div>
      ) : (
        <div className='swiperArticleAcceptedCard-acceptanceDate'></div>
      )}
    </div>
  )
}