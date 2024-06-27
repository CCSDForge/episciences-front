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
          <div className='forAuthorsSidebar-header-title'>
            <Link to={`#${header.id}`}>
              <div className='forAuthorsSidebar-header-title-text'>{header.value}</div>
            </Link>
            {header.children.length > 0 && <img className='forAuthorsSidebar-header-title-caret' src={header.opened ? caretUp : caretDown} alt={header.opened ? 'Caret up icon' : 'Caret down icon'} onClick={(): void => toggleHeaderCallback(header.id)} />}
          </div>
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