import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '../../../hooks/store';
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import './Search.scss';

export default function Search(): JSX.Element {
  const navigate = useNavigate();

  const search = useAppSelector(state => state.searchReducer.search);

  useEffect(() => {
    if (!search) {
      navigate('/');
    }
  }, [search, navigate])

  return (
    <main className="search">
      <Breadcrumb />
      <div className='search-title'>
        <h1>Search</h1>
        <div className='search-title-count'>{`58 results for "${search}"`}</div>
      </div>
    </main>
  )
}