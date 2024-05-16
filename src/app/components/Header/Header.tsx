import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import logo from '/logo.svg';
import { useAppDispatch, useAppSelector } from '../../../hooks/store';
import { setSearch } from '../../../store/features/search/search.slice';
import Button from '../Button/Button';
import SearchInput from '../SearchInput/SearchInput';
import './Header.scss'

export default function Header(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const search = useAppSelector(state => state.searchReducer.search);

  const [showDropdown, setShowDropdown] = useState({ content: false, about: false });

  const toggleDropdown = (menu: string) => {
    setShowDropdown(prev => ({ ...prev, [menu]: !prev[menu as keyof typeof prev] }));
  };

  const updateSearch = (updatedSearch: string) => {
    dispatch(setSearch(updatedSearch))
  }

  const submitSearch = (): void => {
    if (!search) {
      return;
    }

    navigate('/search');
  }

  return (
    <header className='header'>
      <div className='header-preheader'>
        <div className='header-preheader-logo'>
          <img src={logo} alt='Episciences logo'/>
        </div>
        <div className='header-preheader-links'>
          <div className='header-preheader-links-access'>Open Access journals</div>
          <div className='header-preheader-links-buttons'>
            <div className='header-preheader-links-buttons-switch'>EN</div>
            <div>|</div>
            <div className='header-preheader-links-buttons-connect'>Connect</div>
          </div>
        </div>
      </div>
      <div className='header-journal'>
        <div className='header-journal-logo'>
          <img src={logo} alt='Journal logo' onClick={(): void => navigate('/')} />
        </div>
        <div className='header-journal-title'>Journal of Philosophical Economics</div>
      </div>
      <div className='header-postheader'>
        <div className='header-postheader-links'>
          <div className='header-postheader-links-dropdown' onMouseEnter={() => toggleDropdown('content')} onMouseLeave={() => toggleDropdown('content')}>
            <div>Content</div>
            {showDropdown.content && (
                <div className='header-postheader-links-dropdown-content'>
                  <div className='header-postheader-links-dropdown-content-links'>
                    <Link to='/browse/latest'>All articles</Link>
                    <Link to='/'>All volumes</Link>
                    <Link to='/'>Last volume</Link>
                    <Link to='/'>Sections</Link>
                    <Link to='/'>Special issues</Link>
                    <Link to='/'>Proceedings</Link>
                    <Link to='/'>Authors</Link>
                  </div>
                </div>
              )}
          </div>
          <div className='header-postheader-links-dropdown' onMouseEnter={() => toggleDropdown('about')} onMouseLeave={() => toggleDropdown('about')}>
            <div>About</div>
            {showDropdown.about && (
                <div className='header-postheader-links-dropdown-content'>
                  <div className='header-postheader-links-dropdown-content-links'>
                    <Link to='/'>The journal</Link>
                    <Link to='/'>News</Link>
                    <Link to='/'>Statistics</Link>
                  </div>
                </div>
              )}
          </div>
          <Link to='/boards'>Boards</Link>
          <Link to='/'>For authors</Link>
        </div>
        <div className='header-postheader-search'>
          <div className='header-postheader-search-delimiter'></div>
          <div className='header-postheader-search-search'>
            <SearchInput placeholder='search' onChangeCallback={updateSearch}/>
          </div>
          <div className='header-postheader-search-submit'>
            <Button text='Submit' onClickCallback={submitSearch}/>
          </div>
        </div>
      </div>
    </header>
  )
}