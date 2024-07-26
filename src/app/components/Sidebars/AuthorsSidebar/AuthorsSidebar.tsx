import { Fragment } from 'react'
import { TFunction } from 'i18next';

import { alphabet } from '../../../../utils/filter';
import SearchInput from '../../SearchInput/SearchInput';
import './AuthorsSidebar.scss'

interface IAuthorsSidebarProps {
  t: TFunction<"translation", undefined>
  search: string;
  onSearchCallback: (search: string) => void;
  activeLetter: string;
  onSetActiveLetterCallback: (letter: string) => void;
  lettersRange?: Record<string, number>;
}

export default function AuthorsSidebar({ t, search, onSearchCallback, activeLetter, onSetActiveLetterCallback, lettersRange }: IAuthorsSidebarProps): JSX.Element {
  const renderLetter = (value: string, label: string, customClassName?: string): JSX.Element => {
    let className = 'authorsSidebar-letters-letter'

    if (activeLetter === value) {
      className += ' authorsSidebar-letters-letter-active'
    }

    if (customClassName) {
      className += ` ${customClassName}`
    }

    if (lettersRange) {
      const lettersRangeKey = value === 'others' ? 'Others' : value
      
      if (!lettersRange[lettersRangeKey]) {
        className += ' authorsSidebar-letters-letter-disabled'
      }
    }

    return <div className={className} onClick={(): void => onSetActiveLetterCallback(value)}>{label}</div>
  }
  return (
    <div className='authorsSidebar'>
      <div className='authorsSidebar-search'>
        <SearchInput value={search} placeholder={t('pages.authors.searchName')} onChangeCallback={onSearchCallback} className='search-icon-small search-icon-reverted' />
      </div>
      <div className='authorsSidebar-letters'>
        {alphabet.map((letter, index) => (
          <Fragment key={index}>{renderLetter(letter, letter)}</Fragment>
        ))}
        {renderLetter('others', t('pages.authors.others'), 'authorsSidebar-letters-letter-others')}
      </div>
    </div>
  )
}