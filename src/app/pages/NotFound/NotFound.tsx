import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

import { PATHS } from '../../../config/paths';
import { useAppSelector } from '../../../hooks/store';
import './NotFound.scss';

export default function NotFound(): JSX.Element {
  const { t } = useTranslation();
  const journalName = useAppSelector(state => state.journalReducer.currentJournal?.name);

  return (
    <main className='not-found'>
      <Helmet>
        <title>{t('pages.notFound.title')} | {journalName ?? ''}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className='not-found-content'>
        <h1 className='not-found-code'>{t('pages.notFound.code')}</h1>
        <h2 className='not-found-title'>{t('pages.notFound.title')}</h2>
        <p className='not-found-message'>{t('pages.notFound.message')}</p>
        <Link to={PATHS.home} className='not-found-button'>
          {t('pages.notFound.backToHome')}
        </Link>
      </div>
    </main>
  );
}
