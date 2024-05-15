import { ChangeEvent } from 'react';

import './SearchInput.scss'

interface ISearchInputProps {
  placeholder: string;
  onChangeCallback: (search: string) => void;
}

export default function SearchInput({ placeholder, onChangeCallback }: ISearchInputProps): JSX.Element {
  return (
    <input className='searchInput' placeholder={placeholder} onChange={(e: ChangeEvent<HTMLInputElement>): void => onChangeCallback(e.target.value)} />
  )
}