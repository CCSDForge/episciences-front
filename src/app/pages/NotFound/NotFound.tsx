import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

import { PATHS } from '../../../config/paths';
import { useAppSelector } from '../../../hooks/store';
import { NotFoundState } from '../../../types/notFound';
import './NotFound.scss';

export default function NotFound(): JSX.Element {
  const { t } = useTranslation();
  const location = useLocation();
  const journalName = useAppSelector(state => state.journalReducer.currentJournal?.name);

  const state = location.state as NotFoundState | undefined;
  const reason = state?.reason || 'not-found';

  const getMessage = () => {
    switch (reason) {
      case 'section-wrong-journal':
        return t('pages.notFound.sectionWrongJournal');
      case 'article-wrong-journal':
        return t('pages.notFound.articleWrongJournal');
      case 'volume-wrong-journal':
        return t('pages.notFound.volumeWrongJournal');
      default:
        return t('pages.notFound.message');
    }
  };

  return (
    <main className='not-found'>
      <Helmet>
        <title>{t('pages.notFound.title')} | {journalName ?? ''}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className='not-found-content'>
        <h1 className='not-found-code'>{t('pages.notFound.code')}</h1>
        <h2 className='not-found-title'>{t('pages.notFound.title')}</h2>
        <p className='not-found-message'>{getMessage()}</p>
        <Link to={PATHS.home} className='not-found-button'>
          {t('pages.notFound.backToHome')}
        </Link>
      </div>
    </main>
  );
}
