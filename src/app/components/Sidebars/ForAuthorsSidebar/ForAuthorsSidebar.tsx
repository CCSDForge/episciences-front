import { Link } from 'react-router-dom';

import caretUp from '/icons/caret-up-grey.svg';
import caretDown from '/icons/caret-down-grey.svg';
import './ForAuthorsSidebar.scss'

export interface IForAuthorsHeader {
  id: string;
  value: string;
  opened: boolean;
  children: IForAuthorsHeader[];
}

interface IForAuthorsSidebarProps {
  headers: IForAuthorsHeader[];
  toggleHeaderCallback: (id: string) => void;
}

export default function ForAuthorsSidebar({ headers, toggleHeaderCallback }: IForAuthorsSidebarProps): JSX.Element {
  return (
    <div className='forAuthorsSidebar'>
      {headers.map((header, index) => (
        <div
          key={index}
          className='forAuthorsSidebar-header'
        >
          {header.children.length === 0 ? (
            <Link to={`#${header.id}`}>
              <div className='forAuthorsSidebar-header-title'>{header.value}</div>
            </Link>
          ) : (
            <div className='forAuthorsSidebar-header-title' onClick={(): void => toggleHeaderCallback(header.id)}>
              <div className='forAuthorsSidebar-header-title-text'>{header.value}</div>
              {header.opened ? (
                <img className='forAuthorsSidebar-header-title-caret' src={caretUp} alt='Caret up icon' />
              ) : (
                <img className='forAuthorsSidebar-header-title-caret' src={caretDown} alt='Caret down icon' />
              )}
            </div>
          )}
          {header.opened && (
            <div className='forAuthorsSidebar-header-subheaders'>
              {header.children.map((subheader, index) => (
                <Link key={index} to={`#${subheader.id}`}>
                  <div className='forAuthorsSidebar-header-subheaders-subheader'>
                    {subheader.value}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}