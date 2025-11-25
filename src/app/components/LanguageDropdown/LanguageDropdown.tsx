import { useEffect, useRef, useState, KeyboardEvent } from 'react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

import caretUpBlue from '/icons/caret-up-blue.svg';
import caretDownBlue from '/icons/caret-down-blue.svg';
import caretUpWhite from '/icons/caret-up-white.svg';
import caretDownWhite from '/icons/caret-down-white.svg';
import languageIcon from '/icons/language.svg';
import { useAppDispatch, useAppSelector } from '../../../hooks/store';
import { setLanguage } from '../../../store/features/i18n/i18n.slice';
import { AvailableLanguage, availableLanguages } from '../../../utils/i18n';
import { getLanguageName } from '../../../utils/languageNames';
import './LanguageDropdown.scss'

interface ILanguageDropdownProps {
  withWhiteCaret?: boolean;
}

export default function LanguageDropdown({ withWhiteCaret }: ILanguageDropdownProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const language = useAppSelector(state => state.i18nReducer.language);
  const [showDropdown, setShowDropdown] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuItemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const acceptedLanguages = import.meta.env.VITE_JOURNAL_ACCEPTED_LANGUAGES.split(',');

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showDropdown]);

  // Handle Escape key globally when menu is open
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && showDropdown) {
        closeDropdown();
      }
    };

    if (showDropdown) {
      document.addEventListener('keydown', handleEscape as any);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape as any);
    };
  }, [showDropdown]);

  // Focus management when dropdown opens
  useEffect(() => {
    if (showDropdown) {
      // Find the index of the current language
      const currentLangIndex = availableLanguages.findIndex((lang: AvailableLanguage) => lang === language);
      const indexToFocus = currentLangIndex >= 0 ? currentLangIndex : 0;

      setFocusedIndex(indexToFocus);

      // Focus the current language or first option
      setTimeout(() => {
        if (menuItemsRef.current[indexToFocus]) {
          menuItemsRef.current[indexToFocus]?.focus();
        }
      }, 0);
    } else {
      setFocusedIndex(-1);
    }
  }, [showDropdown, language, availableLanguages]);

  const openDropdown = (): void => {
    setShowDropdown(true);
  };

  const closeDropdown = (): void => {
    setShowDropdown(false);
    // Return focus to the button
    buttonRef.current?.focus();
  };

  const switchLanguage = (updatedLanguage: AvailableLanguage): void => {
    if (updatedLanguage === language) {
      closeDropdown();
      return;
    }

    dispatch(setLanguage(updatedLanguage));
    i18next.changeLanguage(updatedLanguage);
    closeDropdown();
  };

  // Handle keyboard navigation on the trigger button
  const handleButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    switch (event.key) {
      case 'Enter':
      case ' ': // Space
        event.preventDefault();
        if (showDropdown) {
          closeDropdown();
        } else {
          openDropdown();
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!showDropdown) {
          openDropdown();
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!showDropdown) {
          openDropdown();
        }
        break;
      case 'Escape':
        if (showDropdown) {
          event.preventDefault();
          closeDropdown();
        }
        break;
    }
  };

  // Handle keyboard navigation within the menu
  const handleMenuItemKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number): void => {
    switch (event.key) {
      case 'Enter':
      case ' ': // Space
        event.preventDefault();
        switchLanguage(availableLanguages[index]);
        break;
      case 'ArrowDown':
        event.preventDefault();
        focusNextItem(index);
        break;
      case 'ArrowUp':
        event.preventDefault();
        focusPreviousItem(index);
        break;
      case 'Home':
        event.preventDefault();
        focusFirstItem();
        break;
      case 'End':
        event.preventDefault();
        focusLastItem();
        break;
      case 'Escape':
        event.preventDefault();
        closeDropdown();
        break;
      default:
        // Handle letter key navigation (type-ahead)
        if (event.key.length === 1) {
          handleTypeAhead(event.key);
        }
        break;
    }
  };

  const focusNextItem = (currentIndex: number): void => {
    const nextIndex = (currentIndex + 1) % availableLanguages.length;
    setFocusedIndex(nextIndex);
    menuItemsRef.current[nextIndex]?.focus();
  };

  const focusPreviousItem = (currentIndex: number): void => {
    const prevIndex = currentIndex === 0 ? availableLanguages.length - 1 : currentIndex - 1;
    setFocusedIndex(prevIndex);
    menuItemsRef.current[prevIndex]?.focus();
  };

  const focusFirstItem = (): void => {
    setFocusedIndex(0);
    menuItemsRef.current[0]?.focus();
  };

  const focusLastItem = (): void => {
    const lastIndex = availableLanguages.length - 1;
    setFocusedIndex(lastIndex);
    menuItemsRef.current[lastIndex]?.focus();
  };

  const handleTypeAhead = (key: string): void => {
    const lowercaseKey = key.toLowerCase();

    // Find the next language starting with the typed letter
    const startIndex = focusedIndex + 1;
    const languagesFromCurrent = [
      ...availableLanguages.slice(startIndex),
      ...availableLanguages.slice(0, startIndex)
    ];

    const matchingLang = languagesFromCurrent.find(lang =>
      lang.toLowerCase().startsWith(lowercaseKey) ||
      getLanguageName(lang).toLowerCase().startsWith(lowercaseKey)
    );

    if (matchingLang) {
      const matchIndex = availableLanguages.indexOf(matchingLang);
      setFocusedIndex(matchIndex);
      menuItemsRef.current[matchIndex]?.focus();
    }
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
    >
      <button
        ref={buttonRef}
        className='languageDropdown-button'
        onClick={(): void => setShowDropdown(!showDropdown)}
        onKeyDown={handleButtonKeyDown}
        aria-haspopup="true"
        aria-expanded={showDropdown}
        aria-label={t('components.header.chooseLanguage') || 'Choose language'}
        type="button"
      >
      <span className='languageDropdown-button-translate' aria-hidden="true">
         <img src={languageIcon} alt="" />
      </span>
          <span className='languageDropdown-button-text'>{language.toUpperCase()}</span>
          {showDropdown ? (
          <img
            className='languageDropdown-button-caret'
            src={withWhiteCaret ? caretUpWhite : caretUpBlue}
            alt=''
            aria-hidden="true"
          />
        ) : (
          <img
            className='languageDropdown-button-caret'
            src={withWhiteCaret ? caretDownWhite : caretDownBlue}
            alt=''
            aria-hidden="true"
          />
        )}
      </button>

      <div
        className={`languageDropdown-content ${showDropdown ? 'languageDropdown-content-displayed' : ''}`}
        role="menu"
        aria-label={t('components.header.languageMenu') || 'Language selection menu'}
      >
        <div className='languageDropdown-content-links'>
          {availableLanguages.map((availableLanguage: AvailableLanguage, index: number) => (
            <button
              key={availableLanguage}
              ref={(el) => (menuItemsRef.current[index] = el)}
              className={`languageDropdown-content-links-item ${
                availableLanguage === language ? 'languageDropdown-content-links-active' : ''
              }`}
              onClick={(): void => switchLanguage(availableLanguage)}
              onKeyDown={(e): void => handleMenuItemKeyDown(e, index)}
              role="menuitem"
              tabIndex={showDropdown ? 0 : -1}
              aria-current={availableLanguage === language ? 'true' : undefined}
              type="button"
            >
              {availableLanguage.toUpperCase()} - {getLanguageName(availableLanguage)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
