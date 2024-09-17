import { useState } from 'react';
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

  const switchLanguage = (updatedLanguage: AvailableLanguage): void => {
    if (updatedLanguage === language) {
      return;
    }

    setShowDropdown(false);
    dispatch(setLanguage(updatedLanguage));
    i18next.changeLanguage(updatedLanguage)
  };

  return (
    <div className='languageDropdown' onMouseEnter={(): void => setShowDropdown(true)}>
      <div className='languageDropdown-icon'>
        <div className='languageDropdown-icon-text'>{language.toUpperCase()}</div>
        {showDropdown ? (
            <img className='languageDropdown-icon-caret' src={withWhiteCaret ? caretUpWhite : caretUpBlue} alt='Caret up icon' />
          ) : (
            <img className='languageDropdown-icon-caret' src={withWhiteCaret ? caretDownWhite : caretDownBlue} alt='Caret down icon' />
          )}
      </div>
      {showDropdown && (
        <div className='languageDropdown-content' onMouseLeave={(): void => setShowDropdown(false)}>
          <div className='languageDropdown-content-links'>
            {availableLanguages.map((availableLanguage, index) => (
              <span key={index} onClick={(): void => switchLanguage(availableLanguage)}>{availableLanguage.toUpperCase()}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}