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
}

export default function AuthorsSidebar({ t, search, onSearchCallback, activeLetter, onSetActiveLetterCallback }: IAuthorsSidebarProps): JSX.Element {
  return (
    <div className='authorsSidebar'>
      <div className='authorsSidebar-search'>
        <SearchInput value={search} placeholder={t('pages.authors.searchName')} onChangeCallback={onSearchCallback} className='search-icon-small search-icon-reverted' />
      </div>
      <div className='authorsSidebar-letters'>
        {alphabet.map((letter, index) => (
          <div
            key={index}
            className={`authorsSidebar-letters-letter ${activeLetter === letter && 'authorsSidebar-letters-letter-active'}`}
            onClick={(): void => onSetActiveLetterCallback(letter)}
          >{letter}</div>
        ))}
      </div>
    </div>
  )
}