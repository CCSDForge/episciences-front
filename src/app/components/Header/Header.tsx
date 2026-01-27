import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isMobileOnly } from 'react-device-detect';

import arrowRight from '/icons/arrow-right-blue.svg';
import burger from '/icons/burger.svg';
import externalLink from '/icons/external-link-white.svg';
import logoText from '/icons/logo-text.svg';
import userCircle from '/icons/user-circle.svg';

import { PATHS } from '../../../config/paths';
import { blocksConfiguration } from '../../../config/statistics';
import { useAppDispatch, useAppSelector } from '../../../hooks/store';
import { setSearch } from '../../../store/features/search/search.slice';
import { availableLanguages } from '../../../utils/i18n';
import { VOLUME_TYPE } from '../../../utils/volume';
import { getPublishSections } from '../../../utils/publish';
import { getAboutSections } from '../../../utils/about';
import Button from '../Button/Button';
import LanguageDropdown from '../LanguageDropdown/LanguageDropdown';
import HeaderSearchInput from '../SearchInput/HeaderSearchInput/HeaderSearchInput';
import './Header.scss';

export default function Header(): JSX.Element {
  const { t } = useTranslation();

  const reducedScrollPosition = 100;

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const search = useAppSelector(state => state.searchReducer.search);
  const language = useAppSelector(state => state.i18nReducer.language);
  const journalName = useAppSelector(
    state => state.journalReducer.currentJournal?.name
  );
  const journalSubtitle = useAppSelector(
    state => state.journalReducer.currentJournal?.subtitle
  );
  const lastVolume = useAppSelector(state => state.volumeReducer.lastVolume);
  const currentJournal = useAppSelector(
    state => state.journalReducer.currentJournal
  );

  const [isSearching, setIsSearching] = useState(false);
  const [isReduced, setIsReduced] = useState(false);
  const [showDropdown, setShowDropdown] = useState<{
    content: boolean;
    about: boolean;
    publish: boolean;
  }>({ content: false, about: false, publish: false });
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const mobileMenuDropdownRef = useRef<HTMLDivElement | null>(null);

  const getLogoOfJournal = (size: 'small' | 'big'): string => {
    const code = currentJournal?.code;
    if (!code) return 'default';
    return `/logos/logo-${code}-${size}.svg`;
  };

  useEffect(() => {
    const handleTouchOutside = (event: TouchEvent): void => {
      if (
        mobileMenuDropdownRef.current &&
        !mobileMenuDropdownRef.current.contains(event.target as Node)
      ) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('touchstart', handleTouchOutside);

    return () => {
      document.removeEventListener('touchstart', handleTouchOutside);
    };
  }, [mobileMenuDropdownRef]);

  const handleScroll = () => {
    const position = window.scrollY;
    setIsReduced(position > reducedScrollPosition);
  };

  const toggleDropdown = (menu: string, opened: boolean): void => {
    setShowDropdown(prev => ({ ...prev, [menu]: opened }));
  };

  const updateSearch = (updatedSearch: string): void => {
    dispatch(setSearch(updatedSearch));
  };

  const submitSearch = (): void => {
    if (!search) {
      return;
    }

    setIsSearching(false);
    navigate(PATHS.search);
  };

  const getEpisciencesHomePageLink = (): string =>
    language === 'fr'
      ? import.meta.env.VITE_EPISCIENCES_HOMEPAGE_FR
      : import.meta.env.VITE_EPISCIENCES_HOMEPAGE;

  const getJournalAccessLink = (): string =>
    language === 'fr'
      ? import.meta.env.VITE_EPISCIENCES_JOURNALS_PAGE_FR
      : import.meta.env.VITE_EPISCIENCES_JOURNALS_PAGE;

  const isMobileReduced = (): boolean => isReduced && isMobileOnly;

  const shouldRenderStatistics: boolean = blocksConfiguration().some(
    config => config.render
  );

  const shouldRenderMenuItem = (key: string): boolean => {
    const envValue = import.meta.env[`VITE_JOURNAL_MENU_${key}_RENDER`];
    return envValue !== 'false';
  };

  const getSubmitManagerLink = (): string | null => {
    const managerUrl = import.meta.env.VITE_EPISCIENCES_MANAGER;
    const code = currentJournal?.code;

    if (!managerUrl) return null; // Return null if VITE_EPISCIENCES_MANAGER is empty or undefined
    return code ? `${managerUrl}/${code}` : managerUrl;
  };

  const submitManagerLink = getSubmitManagerLink();

  const getPostHeaderLinks = (): JSX.Element => {
    return (
      <>
        <div className="header-postheader-links">
          <div
            className="header-postheader-links-dropdown"
            onMouseEnter={(): void => toggleDropdown('content', true)}
          >
            <div>{t('components.header.content')}</div>
            {showDropdown.content && (
              <div
                className="header-postheader-links-dropdown-content"
                onMouseLeave={(): void => toggleDropdown('content', false)}
              >
                <div
                  className={`header-postheader-links-dropdown-content-links header-postheader-links-dropdown-content-links-large ${language === 'fr' && 'header-postheader-links-dropdown-content-links-large-fr'}`}
                >
                  <Link to={PATHS.articles}>
                    {t('components.header.links.articles')}
                  </Link>
                  {shouldRenderMenuItem('ACCEPTED_ARTICLES') && (
                    <Link to={PATHS.articlesAccepted}>
                      {t('components.header.links.articlesAccepted')}
                    </Link>
                  )}

                  {shouldRenderMenuItem('VOLUMES') && (
                    <Link to={PATHS.volumes}>
                      {t('components.header.links.volumes')}
                    </Link>
                  )}

                  {shouldRenderMenuItem('LAST_VOLUME') && (
                    <Link to={`${PATHS.volumes}/${lastVolume?.id}`}>
                      {t('components.header.links.lastVolume')}
                    </Link>
                  )}

                  {shouldRenderMenuItem('SECTIONS') && (
                    <Link to={PATHS.sections}>
                      {t('components.header.links.sections')}
                    </Link>
                  )}
                  {shouldRenderMenuItem('SPECIAL_ISSUES') && (
                    <Link
                      to={`${PATHS.volumes}?type=${VOLUME_TYPE.SPECIAL_ISSUE}`}
                    >
                      {t('components.header.links.specialIssues')}
                    </Link>
                  )}
                  {shouldRenderMenuItem('VOLUME_TYPE_PROCEEDINGS') && (
                    <Link
                      to={`${PATHS.volumes}?type=${VOLUME_TYPE.PROCEEDINGS}`}
                    >
                      {t('components.header.links.proceedings')}
                    </Link>
                  )}

                  {shouldRenderMenuItem('AUTHORS') && (
                    <Link to={PATHS.authors}>
                      {t('components.header.links.authors')}
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
          <div
            className="header-postheader-links-dropdown"
            onMouseEnter={(): void => toggleDropdown('about', true)}
          >
            <div>{t('components.header.about')}</div>
            {showDropdown.about && (
              <div
                className="header-postheader-links-dropdown-content"
                onMouseLeave={(): void => toggleDropdown('about', false)}
              >
                <div className="header-postheader-links-dropdown-content-links">
                  {getAboutSections(shouldRenderStatistics).map(section => (
                    <Link key={section.type} to={section.path}>
                      {t(section.translationKey)}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link to={PATHS.boards}>{t('components.header.links.boards')}</Link>
          {getPublishSections().length > 0 && (
            <div
              className="header-postheader-links-dropdown"
              onMouseEnter={(): void => toggleDropdown('publish', true)}
            >
              <div>{t('pages.publish.title')}</div>
              {showDropdown.publish && (
                <div
                  className="header-postheader-links-dropdown-content"
                  onMouseLeave={(): void => toggleDropdown('publish', false)}
                >
                  <div className="header-postheader-links-dropdown-content-links header-postheader-links-dropdown-content-links-publish">
                    {getPublishSections().map(section => (
                      <Link key={section.type} to={section.path}>
                        {t(section.translationKey)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div
          className={`header-postheader-search ${isReduced && 'header-postheader-search-reduced'}`}
        >
          <div className="header-postheader-search-delimiter"></div>
          <div className="header-postheader-search-search">
            <HeaderSearchInput
              value={search ?? ''}
              placeholder={t('components.header.searchPlaceholder')}
              isSearching={isSearching}
              setIsSearchingCallback={setIsSearching}
              onChangeCallback={updateSearch}
              onSubmitCallback={submitSearch}
            />
          </div>
          {isSearching ? (
            <div className="header-postheader-search-submit header-postheader-search-submit-search">
              <Button
                text={t('components.header.search')}
                onClickCallback={(): void => submitSearch()}
              />
            </div>
          ) : (
            <div className="header-postheader-search-submit header-postheader-search-submit-article">
              {submitManagerLink && (
                <Link
                  to={submitManagerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    text={t('components.header.submit')}
                    onClickCallback={(): void => {}}
                    icon={externalLink}
                  />
                </Link>
              )}
            </div>
          )}
        </div>
      </>
    );
  };

  const getPostHeaderBurgerLinks = (): JSX.Element => {
    if (showMobileMenu) {
      return (
        <div
          className={`header-postheader-burger-content ${showDropdown && 'header-postheader-burger-content-displayed'}`}
        >
          <div className="header-postheader-burger-content-links">
            <div className="header-postheader-burger-content-links-section header-postheader-burger-content-links-section-bordered">
              <div className="header-postheader-burger-content-links-section-links">
                <span onTouchEnd={(): void => navigate(PATHS.articles)}>
                  {t('components.header.links.articles')}
                </span>
                {shouldRenderMenuItem('ACCEPTED_ARTICLES') && (
                  <span
                    onTouchEnd={(): void => navigate(PATHS.articlesAccepted)}
                  >
                    {t('components.header.links.articlesAccepted')}
                  </span>
                )}
                {shouldRenderMenuItem('VOLUMES') && (
                  <span onTouchEnd={(): void => navigate(PATHS.volumes)}>
                    {t('components.header.links.volumes')}
                  </span>
                )}
                {shouldRenderMenuItem('LAST_VOLUME') && (
                  <span
                    onTouchEnd={(): void =>
                      navigate(`${PATHS.volumes}/${lastVolume?.id}`)
                    }
                  >
                    {t('components.header.links.lastVolume')}
                  </span>
                )}
                {shouldRenderMenuItem('SECTIONS') && (
                  <span onTouchEnd={(): void => navigate(PATHS.sections)}>
                    {t('components.header.links.sections')}
                  </span>
                )}
                {shouldRenderMenuItem('SPECIAL_ISSUES') && (
                  <span
                    onTouchEnd={(): void =>
                      navigate(
                        `${PATHS.volumes}?type=${VOLUME_TYPE.SPECIAL_ISSUE}`
                      )
                    }
                  >
                    {t('components.header.links.specialIssues')}
                  </span>
                )}
                {shouldRenderMenuItem('VOLUME_TYPE_PROCEEDINGS') && (
                  <span
                    onTouchEnd={(): void =>
                      navigate(
                        `${PATHS.volumes}?type=${VOLUME_TYPE.PROCEEDINGS}`
                      )
                    }
                  >
                    {t('components.header.links.proceedings')}
                  </span>
                )}
                {shouldRenderMenuItem('AUTHORS') && (
                  <span onTouchEnd={(): void => navigate(PATHS.authors)}>
                    {t('components.header.links.authors')}
                  </span>
                )}
              </div>
            </div>
            <div className="header-postheader-burger-content-links-section header-postheader-burger-content-links-section-bordered">
              <div className="header-postheader-burger-content-links-section-links">
                {getAboutSections(shouldRenderStatistics).map(section => (
                  <span
                    key={section.type}
                    onTouchEnd={(): void => navigate(section.path)}
                  >
                    {t(section.translationKey)}
                  </span>
                ))}
              </div>
            </div>
            <div className="header-postheader-burger-content-links-section header-postheader-burger-content-links-section-bordered">
              <div className="header-postheader-burger-content-links-section-links">
                <span onTouchEnd={(): void => navigate(PATHS.boards)}>
                  {t('components.header.links.boards')}
                </span>
              </div>
            </div>
            {getPublishSections().length > 0 && (
              <div className="header-postheader-burger-content-links-section">
                <div className="header-postheader-burger-content-links-section-title">
                  {t('pages.publish.title')}
                </div>
                <div className="header-postheader-burger-content-links-section-links">
                  {getPublishSections().map(section => (
                    <span
                      key={section.type}
                      onTouchEnd={(): void => navigate(section.path)}
                    >
                      {t(section.translationKey)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return <></>;
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setShowDropdown({ content: false, about: false, publish: false });
  }, [location]);

  if (isReduced) {
    return (
      <header className="header header-reduced">
        <div className="header-reduced-journal">
          <div className="header-reduced-journal-logo">
            <Link to={PATHS.home}>
              <img src={getLogoOfJournal('small')} alt="Reduced journal logo" />
            </Link>
          </div>
          <div className="header-reduced-journal-title">{journalName}</div>
          <div className="header-reduced-journal-dropdown">
            {availableLanguages.length > 1 && (
              <LanguageDropdown withWhiteCaret={isMobileReduced()} />
            )}
            {submitManagerLink && (
              <div className="header-reduced-journal-signin">
                {availableLanguages.length > 1 && (
                  <span className="header-reduced-journal-signin-separator" aria-hidden="true">|</span>
                )}
                <Link
                  to={submitManagerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="header-reduced-journal-signin-link"
                >
                  <span className="header-reduced-journal-signin-link-text">
                    {t('components.header.signIn')}
                  </span>
                  <img
                    className="header-reduced-journal-signin-link-icon"
                    src={userCircle}
                    alt={t('components.header.signIn') || 'Sign in'}
                  />
                  <span className="sr-only">
                    {t('components.header.newWindow')}
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="header-postheader" ref={mobileMenuDropdownRef}>
          <div
            className="header-postheader-burger"
            onTouchEnd={(): void => setShowMobileMenu(!showMobileMenu)}
          >
            <img
              className="header-postheader-burger-icon"
              src={burger}
              alt="Burger menu icon"
            />
            {getPostHeaderBurgerLinks()}
          </div>
          {getPostHeaderLinks()}
        </div>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="header-preheader">
        <div className="header-preheader-logo">
          <Link
            to={getEpisciencesHomePageLink()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={logoText} alt="Episciences logo" />
          </Link>
        </div>
        <div className="header-preheader-links">
          <div className="header-preheader-links-access">
            <Link
              to={getJournalAccessLink()}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('components.header.journal')}
            </Link>
          </div>
          <div className="header-preheader-links-access-mobile">
            <Link
              to={getJournalAccessLink()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={arrowRight} alt="Arrow right icon" />
            </Link>
          </div>
          <div className="header-preheader-links-right">
            {availableLanguages.length > 1 && <LanguageDropdown />}
            {submitManagerLink && (
              <div className="header-preheader-links-signin">
                {availableLanguages.length > 1 && (
                  <span className="header-preheader-links-signin-separator" aria-hidden="true">|</span>
                )}
                <Link
                  to={submitManagerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="header-preheader-links-signin-link"
                >
                  <span className="header-preheader-links-signin-link-text">
                    {t('components.header.signIn')}
                  </span>
                  <img
                    className="header-preheader-links-signin-link-icon"
                    src={userCircle}
                    alt={t('components.header.signIn') || 'Sign in'}
                  />
                  <span className="sr-only">
                    {t('components.header.newWindow')}
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="header-journal">
        <div className="header-journal-logo">
          <Link to={PATHS.home}>
            <img src={getLogoOfJournal('big')} alt="Journal logo" />
          </Link>
        </div>
        <div className="header-journal-titles">
          <div className="header-journal-title">{journalName}</div>
          <div className="header-journal-subtitle">{journalSubtitle}</div>
        </div>
      </div>
      <div className="header-postheader" ref={mobileMenuDropdownRef}>
        <div
          className="header-postheader-burger"
          onTouchEnd={(): void => setShowMobileMenu(!showMobileMenu)}
        >
          <img
            className="header-postheader-burger-icon"
            src={burger}
            alt="Burger menu icon"
          />
          {getPostHeaderBurgerLinks()}
        </div>
        {getPostHeaderLinks()}
      </div>
    </header>
  );
}
