import { useEffect, useRef, useState } from 'react';
import i18next from 'i18next';

import caretUpBlue from '/icons/caret-up-blue.svg';
import caretDownBlue from '/icons/caret-down-blue.svg';
import caretUpWhite from '/icons/caret-up-white.svg';
import caretDownWhite from '/icons/caret-down-white.svg';
import { useAppDispatch, useAppSelector } from '../../../hooks/store';
import { setLanguage } from '../../../store/features/i18n/i18n.slice';
import { AvailableLanguage, availableLanguages } from '../../../utils/i18n';
import './LanguageDropdown.scss'

interface ILanguageDropdownProps {
  withWhiteCaret?: boolean;
}

export default function LanguageDropdown({ withWhiteCaret }: ILanguageDropdownProps) {
  const dispatch = useAppDispatch();
  const language = useAppSelector(state => state.i18nReducer.language);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const acceptedLanguages = import.meta.env.VITE_JOURNAL_ACCEPTED_LANGUAGES.split(',');

  useEffect(() => {
    const handleTouchOutside = (event: TouchEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('touchstart', handleTouchOutside);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchOutside);
    };
  }, [dropdownRef]);

  const switchLanguage = (updatedLanguage: AvailableLanguage): void => {
    setShowDropdown(false);

    if (updatedLanguage === language) {
      return;
    }

    dispatch(setLanguage(updatedLanguage));
    i18next.changeLanguage(updatedLanguage)
  };

  if (acceptedLanguages.length <= 1) {
    return null; // Do not render the dropdown if there is only one accepted language
  }

  return (
    <div
      ref={dropdownRef}
      className='languageDropdown'
      onMouseEnter={(): void => setShowDropdown(true)}
      onMouseLeave={(): void => setShowDropdown(false)}
      onTouchStart={(): void => setShowDropdown(!showDropdown)}
    >
      <div className='languageDropdown-icon'>
        <div className='languageDropdown-icon-text'>{language.toUpperCase()}</div>
        {showDropdown ? (
          <img className='languageDropdown-icon-caret' src={withWhiteCaret ? caretUpWhite : caretUpBlue} alt='Caret up icon' />
        ) : (
          <img className='languageDropdown-icon-caret' src={withWhiteCaret ? caretDownWhite : caretDownBlue} alt='Caret down icon' />
        )}
      </div>
      <div className={`languageDropdown-content ${showDropdown && 'languageDropdown-content-displayed'}`}>
        <div className='languageDropdown-content-links'>
          {availableLanguages.map((availableLanguage, index) => (
            <span key={index} onClick={(): void => switchLanguage(availableLanguage)} onTouchEnd={(): void => switchLanguage(availableLanguage)}>{availableLanguage.toUpperCase()}</span>
          ))}
        </div>
      </div>
    </div>
  );
}