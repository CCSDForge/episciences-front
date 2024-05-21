import { ChangeEvent } from 'react';

import search from '/icons/search.svg';
import './SearchInput.scss'

interface ISearchInputProps {
  placeholder: string;
  onChangeCallback: (search: string) => void;
  className?: string;
}

export default function SearchInput({ placeholder, onChangeCallback, className }: ISearchInputProps): JSX.Element {
  return (
    <div className={`searchInput ${className}`}>
      <input className='searchInput-input' placeholder={placeholder} onChange={(e: ChangeEvent<HTMLInputElement>): void => onChangeCallback(e.target.value)} />
      <img className='searchInput-icon' src={search} alt='Search icon'/>
    </div>
  )
}