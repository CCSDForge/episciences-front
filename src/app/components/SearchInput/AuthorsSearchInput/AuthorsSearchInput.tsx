import { ChangeEvent } from 'react';

import search from '/icons/search.svg';
import './AuthorsSearchInput.scss';

interface IAuthorsSearchInputProps {
  value: string;
  placeholder: string;
  onChangeCallback: (search: string) => void;
}

export default function AuthorsSearchInput({
  value,
  placeholder,
  onChangeCallback,
}: IAuthorsSearchInputProps): JSX.Element {
  return (
    <div className="authorsSearchInput">
      <input
        className="authorsSearchInput-input"
        value={value}
        placeholder={placeholder}
        onChange={(e: ChangeEvent<HTMLInputElement>): void =>
          onChangeCallback(e.target.value)
        }
      />
      <img className="authorsSearchInput-icon" src={search} alt="Search icon" />
    </div>
  );
}
