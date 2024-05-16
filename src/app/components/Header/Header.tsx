import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import logo from '/logo.svg';
import { useAppDispatch, useAppSelector } from '../../../hooks/store';
import { setSearch } from '../../../store/features/search/search.slice';
import Button from '../Button/Button';
import LanguageDropdown from '../LanguageDropdown/LanguageDropdown';
import SearchInput from '../SearchInput/SearchInput';
import './Header.scss'

export default function Header(): JSX.Element {
  const reducedScrollPosition = 100;

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const search = useAppSelector(state => state.searchReducer.search);
  const language = useAppSelector(state => state.i18nReducer.language);

  const [isReduced, setIsReduced] = useState(false);
  const [showDropdown, setShowDropdown] = useState({ content: false, about: false });

  const handleScroll = () => {
    const position = window.scrollY;
    setIsReduced(position > reducedScrollPosition);
  };

  const toggleDropdown = (menu: string): void => {
    setShowDropdown(prev => ({ ...prev, [menu]: !prev[menu as keyof typeof prev] }));
  };

  const updateSearch = (updatedSearch: string): void => {
    dispatch(setSearch(updatedSearch))
  }

  const submitSearch = (): void => {
    if (!search) {
      return;
    }

    navigate('/search');
  }

  const getPostHeaderLinks = (): JSX.Element => {
    return (
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
        <div className={`header-postheader-search ${isReduced && 'header-postheader-search-reduced'}`}>
          <div className='header-postheader-search-delimiter'></div>
          <div className='header-postheader-search-search'>
            <SearchInput placeholder='search' onChangeCallback={updateSearch}/>
          </div>
          <div className='header-postheader-search-submit'>
            <Button text='Submit' onClickCallback={submitSearch}/>
          </div>
        </div>
      </div>
    )
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isReduced) {
    return (
      <header className='header header-reduced'>
        <div className='header-reduced-journal'>
          <div className='header-reduced-journal-logo'>
            <img src={logo} alt='Reduced journal logo' onClick={(): void => navigate('/')} />
          </div>
          <div className='header-reduced-journal-blank'></div>
          <div className='header-reduced-journal-dropdown'>
            <LanguageDropdown />
          </div>
        </div>
        {getPostHeaderLinks()}
      </header>
    )
  }

  return (
    <header className='header'>
      <div className='header-preheader'>
        <div className='header-preheader-logo'>
          <a href={import.meta.env.VITE_EPISCIENCES_HOMEPAGE} target='_blank'>
            <img src={logo} alt='Episciences logo' />
          </a>
        </div>
        <div className='header-preheader-links'>
          <div className='header-preheader-links-access'>
            <a href={language === 'fr' ? import.meta.env.VITE_EPISCIENCES_JOURNALS_PAGE_FR : import.meta.env.VITE_EPISCIENCES_JOURNALS_PAGE_EN} target='_blank'>Open Access journals</a>
          </div>
          <LanguageDropdown />
        </div>
      </div>
      <div className='header-journal'>
        <div className='header-journal-logo'>
          <img src={logo} alt='Journal logo' onClick={(): void => navigate('/')} />
        </div>
        <div className='header-journal-title'>Journal of Philosophical Economics</div>
      </div>
      {getPostHeaderLinks()}
    </header>
  )
}