import SearchInput from '../../SearchInput/SearchInput';
import './AuthorSidebar.scss'

interface IAuthorSidebarProps {
  onSearchCallback: (search: string) => void;
  activeLetter: string;
  onSetActiveLetterCallback: (letter: string) => void;
}

export default function AuthorSidebar({ onSearchCallback, activeLetter, onSetActiveLetterCallback }: IAuthorSidebarProps): JSX.Element {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  return (
    <div className='authorSidebar'>
      <div className='authorSidebar-search'>
        <SearchInput placeholder='search a name' onChangeCallback={onSearchCallback} className='search-icon-small search-icon-reverted' />
      </div>
      <div className='authorSidebar-letters'>
        {letters.map((letter, index) => (
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