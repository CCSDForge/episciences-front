import { ChangeEvent, KeyboardEvent } from 'react';

import search from '/icons/search.svg';
import './SearchInput.scss'

interface ISearchInputProps {
  value: string;
  placeholder: string;
  onChangeCallback: (search: string) => void;
  onSubmitCallback?: () => void;
  className?: string;
}

export default function SearchInput({ value, placeholder, onChangeCallback, onSubmitCallback, className }: ISearchInputProps): JSX.Element {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && onSubmitCallback) {
      onSubmitCallback()
    }
  }

  return (
    <div className={`searchInput ${className}`}>
      <input className='searchInput-input' value={value} placeholder={placeholder} onChange={(e: ChangeEvent<HTMLInputElement>): void => onChangeCallback(e.target.value)} onKeyDown={(e: KeyboardEvent<HTMLInputElement>): void => handleKeyDown(e)} />
      <img className='searchInput-icon' src={search} alt='Search icon'/>
    </div>
  )
}