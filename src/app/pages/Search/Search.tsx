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

  useEffect(() => {
    if (!search) {
      navigate(PATHS.home);
    }
  }, [search, navigate])

  // TODO: translate
  return (
    <main className="search">
      <Breadcrumb parent={{ path: 'home', label: `${t('pages.home.title')} >` }} crumbLabel={t('pages.search.title')} />
      <div className='search-title'>
        <h1>Search</h1>
        <div className='search-title-count'>{`58 results for "${search}"`}</div>
      </div>
    </main>
  )
}