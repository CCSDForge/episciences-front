import { useState } from 'react';
import i18next from 'i18next';

import caretUp from '/icons/caret-up-blue.svg';
import caretDown from '/icons/caret-down-blue.svg';
import { useAppDispatch, useAppSelector } from '../../../hooks/store';
import { setLanguage } from '../../../store/features/i18n/i18n.slice';
import './LanguageDropdown.scss'

export default function LanguageDropdown() {
  const availablesLanguages = ['en', 'fr']

  const dispatch = useAppDispatch();

  const language = useAppSelector(state => state.i18nReducer.language);

  const [showDropdown, setShowDropdown] = useState(false);

  const switchLanguage = (updatedLanguage: string): void => {
    if (updatedLanguage === language) {
      return;
    }

    dispatch(setLanguage(updatedLanguage));
    i18next.changeLanguage(updatedLanguage)
  };

  return (
    <div className='languageDropdown' onMouseEnter={(): void => setShowDropdown(true)} onMouseLeave={(): void => setShowDropdown(false)}>
      <div className='languageDropdown-icon'>
        <div className='languageDropdown-icon-text'>{language.toUpperCase()}</div>
        {showDropdown ? (
            <img className='languageDropdown-icon-caret' src={caretUp} alt='Caret up icon' />
          ) : (
            <img className='languageDropdown-icon-caret' src={caretDown} alt='Caret down icon' />
          )}
      </div>
      {showDropdown && (
        <div className='languageDropdown-content'>
          <div className='languageDropdown-content-links'>
            {availablesLanguages.map((availablesLanguage, index) => (
              <span key={index} onClick={(): void => switchLanguage(availablesLanguage)}>{availablesLanguage.toUpperCase()}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}