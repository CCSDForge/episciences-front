import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

import { PATHS } from '../../../config/paths';
import { useAppSelector } from '../../../hooks/store';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import './Publish.scss';

export default function Publish(): JSX.Element {
  const { t } = useTranslation();
  const location = useLocation();
  const journalName = useAppSelector(state => state.journalReducer.currentJournal?.name);

  const getActiveTab = (): string => {
    if (location.pathname.includes('for-reviewers')) return 'reviewers';
    if (location.pathname.includes('for-conference-organisers')) return 'organisers';
    return 'authors';
  };

  const [activeTab] = useState<string>(getActiveTab());

  return (
    <main className='publish'>
      <Helmet>
        <title>{t('pages.publish.title')} | {journalName ?? ''}</title>
      </Helmet>

      <Breadcrumb
        parents={[{ path: 'home', label: `${t('pages.home.title')} >` }]}
        crumbLabel={t('pages.publish.title')}
      />

      <h1 className='publish-title'>{t('pages.publish.title')}</h1>

      <nav className='publish-navigation'>
        <Link
          to={PATHS.forAuthors}
          className={`publish-navigation-item ${activeTab === 'authors' ? 'publish-navigation-item-active' : ''}`}
        >
          <span>{t('pages.publish.forAuthors')}</span>
        </Link>
        <Link
          to={PATHS.forReviewers}
          className={`publish-navigation-item ${activeTab === 'reviewers' ? 'publish-navigation-item-active' : ''}`}
        >
          <span>{t('pages.publish.forReviewers')}</span>
        </Link>
        <Link
          to={PATHS.forConferenceOrganisers}
          className={`publish-navigation-item ${activeTab === 'organisers' ? 'publish-navigation-item-active' : ''}`}
        >
          <span>{t('pages.publish.forConferenceOrganisers')}</span>
        </Link>
      </nav>

      <div className='publish-content'>
        <p>{t('pages.publish.description')}</p>
      </div>
    </main>
  );
}