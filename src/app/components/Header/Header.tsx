import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isMobileOnly } from 'react-device-detect';

import arrowRight from '/icons/arrow-right-blue.svg';
import burger from '/icons/burger.svg';
import logoText from '/icons/logo-text.svg';
import logoJpeBig from '/icons/logo-jpe-big.svg';
import logoJpeSmall from '/icons/logo-jpe-small.svg';
import { PATHS } from '../../../config/paths'
import { useAppDispatch, useAppSelector } from '../../../hooks/store';
import { setSearch } from '../../../store/features/search/search.slice';
import { availableLanguages } from '../../../utils/i18n';
import { VOLUME_TYPE } from '../../../utils/volume';
import Button from '../Button/Button';
import LanguageDropdown from '../LanguageDropdown/LanguageDropdown';
import SearchInput from '../SearchInput/SearchInput';
import './Header.scss'

export default function Header(): JSX.Element {
  const { t } = useTranslation();

  const reducedScrollPosition = 100;

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const search = useAppSelector(state => state.searchReducer.search);
  const language = useAppSelector(state => state.i18nReducer.language);
  const journalName = useAppSelector(state => state.journalReducer.currentJournal?.name);
  const lastVolume = useAppSelector(state => state.volumeReducer.lastVolume);

  const [isReduced, setIsReduced] = useState(false);
  const [showDropdown, setShowDropdown] = useState({ content: false, about: false });
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleScroll = () => {
    const position = window.scrollY;
    setIsReduced(position > reducedScrollPosition);
  };

  const toggleDropdown = (menu: string, opened: boolean): void => {
    setShowDropdown(prev => ({ ...prev, [menu]: opened }));
  };

  const updateSearch = (updatedSearch: string): void => {
    dispatch(setSearch(updatedSearch))
  }

  const submitSearch = (): void => {
    if (!search) {
      return;
    }

    navigate(PATHS.search);
  }

  const getJournalAccessLink = (): string => language === 'fr' ? import.meta.env.VITE_EPISCIENCES_JOURNALS_PAGE_FR : import.meta.env.VITE_EPISCIENCES_JOURNALS_PAGE_EN

  const isMobileReduced = (): boolean => isReduced && isMobileOnly;

  const getPostHeaderLinks = (): JSX.Element => {
    return (
      <>
        <div className='header-postheader-links'>
          <div className='header-postheader-links-dropdown' onMouseEnter={(): void => toggleDropdown('content', true)}>
            <div>{t('components.header.content')}</div>
            {showDropdown.content && (
                <div className='header-postheader-links-dropdown-content' onMouseLeave={(): void => toggleDropdown('content', false)}>
                  <div className='header-postheader-links-dropdown-content-links'>
                    <Link to={PATHS.articles}>{t('components.header.links.articles')}</Link>
                    <Link to={PATHS.articlesAccepted}>{t('components.header.links.articlesAccepted')}</Link>
                    <Link to={PATHS.volumes}>{t('components.header.links.volumes')}</Link>
                    <Link to={`${PATHS.volumes}/${lastVolume?.id}`}>{t('components.header.links.lastVolume')}</Link>
                    <Link to={PATHS.sections}>{t('components.header.links.sections')}</Link>
                    <Link to={`${PATHS.volumes}?type=${VOLUME_TYPE.SPECIAL_ISSUE}`}>{t('components.header.links.specialIssues')}</Link>
                    <Link to={`${PATHS.volumes}?type=${VOLUME_TYPE.PROCEEDINGS}`}>{t('components.header.links.proceedings')}</Link>
                    <Link to={PATHS.authors}>{t('components.header.links.authors')}</Link>
                  </div>
                </div>
              )}
          </div>
          <div className='header-postheader-links-dropdown' onMouseEnter={(): void => toggleDropdown('about', true)}>
            <div>{t('components.header.about')}</div>
            {showDropdown.about && (
                <div className='header-postheader-links-dropdown-content' onMouseLeave={(): void => toggleDropdown('about', false)}>
                  <div className='header-postheader-links-dropdown-content-links'>
                    <Link to={PATHS.about}>{t('components.header.links.about')}</Link>
                    <Link to={PATHS.news}>{t('components.header.links.news')}</Link>
                    <Link to={PATHS.statistics}>{t('components.header.links.statistics')}</Link>
                  </div>
                </div>
              )}
          </div>
          <Link to={PATHS.boards}>{t('components.header.links.boards')}</Link>
          <Link to={PATHS.forAuthors}>{t('components.header.links.forAuthors')}</Link>
        </div>
        <div className={`header-postheader-search ${isReduced && 'header-postheader-search-reduced'}`}>
          <div className='header-postheader-search-delimiter'></div>
          <div className='header-postheader-search-search'>
            <SearchInput value={search ?? ''} placeholder={t('components.header.search')} onChangeCallback={updateSearch} onSubmitCallback={submitSearch} />
          </div>
          <div className='header-postheader-search-submit'>
            <Button text={t('components.header.submit')} onClickCallback={(): void => {}}/>
          </div>
        </div>
      </>
    )
  }

  const getPostHeaderBurgerLinks = (): JSX.Element => {
    if (showMobileMenu) {
      return (
        <div className='header-postheader-burger-content' onMouseLeave={(): void => setShowMobileMenu(false)}>
          <div className='header-postheader-burger-content-links' onClick={(): void => setShowMobileMenu(false)}>
            <div className='header-postheader-burger-content-links-section header-postheader-burger-content-links-section-bordered'>
              <div className='header-postheader-burger-content-links-section-links'>
                <Link to={PATHS.articles}>{t('components.header.links.articles')}</Link>
                <Link to={PATHS.articlesAccepted}>{t('components.header.links.articlesAccepted')}</Link>
                <Link to={PATHS.volumes}>{t('components.header.links.volumes')}</Link>
                <Link to={`${PATHS.volumes}/${lastVolume?.id}`}>{t('components.header.links.lastVolume')}</Link>
                <Link to={PATHS.sections}>{t('components.header.links.sections')}</Link>
                <Link to={`${PATHS.volumes}?type=${VOLUME_TYPE.SPECIAL_ISSUE}`}>{t('components.header.links.specialIssues')}</Link>
                <Link to={`${PATHS.volumes}?type=${VOLUME_TYPE.PROCEEDINGS}`}>{t('components.header.links.proceedings')}</Link>
                <Link to={PATHS.authors}>{t('components.header.links.authors')}</Link>
              </div>
            </div>
            <div className='header-postheader-burger-content-links-section header-postheader-burger-content-links-section-bordered'>
              <div className='header-postheader-burger-content-links-section-links'>
                <Link to={PATHS.about}>{t('components.header.links.about')}</Link>
                <Link to={PATHS.news}>{t('components.header.links.news')}</Link>
                <Link to={PATHS.statistics}>{t('components.header.links.statistics')}</Link>
              </div>
            </div>
            <div className='header-postheader-burger-content-links-section'>
              <div className='header-postheader-burger-content-links-section-links'>
                <Link to={PATHS.boards}>{t('components.header.links.boards')}</Link>
                <Link to={PATHS.forAuthors}>{t('components.header.links.forAuthors')}</Link>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return <></>
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setShowDropdown({ content: false, about: false });
  }, [location]);

  if (isReduced) {
    return (
      <header className='header header-reduced'>
        <div className='header-reduced-journal'>
          <div className='header-reduced-journal-logo'>
            <Link to={PATHS.home}>
              <img src={logoJpeSmall} alt='Reduced journal logo' />
            </Link>
          </div>
          <div className='header-reduced-journal-blank'></div>
          {availableLanguages.length > 1 && (
            <div className='header-reduced-journal-dropdown'>
              <LanguageDropdown withWhiteCaret={isMobileReduced()} />
            </div>
          )}
        </div>
        <div className='header-postheader'>
          <div className='header-postheader-burger'>
            <img className='header-postheader-burger-icon' src={burger} alt='Burger menu icon' onMouseEnter={(): void => setShowMobileMenu(true)}/>
            {getPostHeaderBurgerLinks()}
          </div>
          {getPostHeaderLinks()}
        </div>
      </header>
    )
  }

  return (
    <header className='header'>
      <div className='header-preheader'>
        <div className='header-preheader-logo'>
          <Link to={import.meta.env.VITE_EPISCIENCES_HOMEPAGE} target='_blank'>
            <img src={logoText} alt='Episciences logo' />
          </Link>
        </div>
        <div className='header-preheader-links'>
          <div className='header-preheader-links-access'>
            <Link to={getJournalAccessLink()} target='_blank'>{t('components.header.journal')}</Link>
          </div>
          <div className='header-preheader-links-access-mobile'>
            <Link to={getJournalAccessLink()} target='_blank'>
              <img src={arrowRight} alt='Arrow right icon' />
            </Link>
          </div>
          {availableLanguages.length > 1 && (
            <LanguageDropdown />
          )}
        </div>
      </div>
      <div className='header-journal'>
        <div className='header-journal-logo'>
          <Link to={PATHS.home}>
            <img src={logoJpeBig} alt='Journal logo' />
          </Link>
        </div>
        <div className='header-journal-title'>{journalName}</div>
      </div>
      <div className='header-postheader'>
        <div className='header-postheader-burger'>
          <img className='header-postheader-burger-icon' src={burger} alt='Burger menu icon' onMouseEnter={(): void => setShowMobileMenu(true)}/>
          {getPostHeaderBurgerLinks()}
        </div>
        {getPostHeaderLinks()}
      </div>
    </header>
  )
}