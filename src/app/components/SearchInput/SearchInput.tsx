import { ChangeEvent } from 'react';

import search from '/icons/search.svg';
import './SearchInput.scss'

interface ISearchInputProps {
  value: string;
  placeholder: string;
  onChangeCallback: (search: string) => void;
  className?: string;
}

export default function SearchInput({ value, placeholder, onChangeCallback, className }: ISearchInputProps): JSX.Element {
  return (
    <div className={`searchInput ${className}`}>
      <input className='searchInput-input' value={value} placeholder={placeholder} onChange={(e: ChangeEvent<HTMLInputElement>): void => onChangeCallback(e.target.value)} />
      <img className='searchInput-icon' src={search} alt='Search icon'/>
    </div>
  )
}