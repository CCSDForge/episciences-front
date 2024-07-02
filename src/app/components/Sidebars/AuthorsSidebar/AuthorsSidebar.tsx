import { alphabet } from '../../../../utils/filter';
import SearchInput from '../../SearchInput/SearchInput';
import './AuthorsSidebar.scss'

interface IAuthorsSidebarProps {
  search: string;
  onSearchCallback: (search: string) => void;
  activeLetter: string;
  onSetActiveLetterCallback: (letter: string) => void;
}

export default function AuthorsSidebar({ search, onSearchCallback, activeLetter, onSetActiveLetterCallback }: IAuthorsSidebarProps): JSX.Element {
  return (
    <div className='authorsSidebar'>
      <div className='authorsSidebar-search'>
        <SearchInput value={search} placeholder='search a name' onChangeCallback={onSearchCallback} className='search-icon-small search-icon-reverted' />
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