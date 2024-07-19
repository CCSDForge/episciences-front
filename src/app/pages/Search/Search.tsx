import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { PATHS } from '../../../config/paths'
import { useAppSelector } from '../../../hooks/store';
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import './Search.scss';

export default function Search(): JSX.Element {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const search = useAppSelector(state => state.searchReducer.search);
  const results = {
    totalItems: 3,
    data: ['lala', 'lele', 'lili']
  }

  useEffect(() => {
    if (!search) {
      navigate(PATHS.home);
    }
  }, [search, navigate])

  return (
    <main className="search">
      <Breadcrumb parents={[
        { path: 'home', label: `${t('pages.home.title')} >` }
      ]} crumbLabel={t('pages.search.title')} />
      <div className='search-title'>
        <h1>{t('pages.search.title')}</h1>  
        {results && results.totalItems > 1 ? (
            <div className='search-title-count'>{results.totalItems} {t('common.resultsFor')} "{search}"</div>
          ) : (
            <div className='search-title-count'>{results?.totalItems ?? 0} {t('common.resultFor')} "{search}"</div>
        )}
      </div>
    </main>
  )
}