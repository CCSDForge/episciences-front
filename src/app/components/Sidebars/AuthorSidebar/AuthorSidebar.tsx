import { alphabet } from '../../../../utils/common';
import SearchInput from '../../SearchInput/SearchInput';
import './AuthorSidebar.scss'

interface IAuthorSidebarProps {
  onSearchCallback: (search: string) => void;
  activeLetter: string;
  onSetActiveLetterCallback: (letter: string) => void;
}

export default function AuthorSidebar({ onSearchCallback, activeLetter, onSetActiveLetterCallback }: IAuthorSidebarProps): JSX.Element {
  return (
    <div className='authorSidebar'>
      <div className='authorSidebar-search'>
        <SearchInput placeholder='search a name' onChangeCallback={onSearchCallback} className='search-icon-small search-icon-reverted' />
      </div>
      <div className='authorSidebar-letters'>
        {alphabet.map((letter, index) => (
          <div
            key={index}
            className={`authorSidebar-letters-letter ${activeLetter === letter && 'authorSidebar-letters-letter-active'}`}
            onClick={(): void => onSetActiveLetterCallback(letter)}
          >{letter}</div>
        ))}
      </div>
    </div>
  )
}