import { Link } from 'react-router-dom';

import caretUp from '/icons/caret-up-grey.svg';
import caretDown from '/icons/caret-down-grey.svg';
import './CreditsSidebar.scss'

export interface ICreditsHeader {
  id: string;
  value: string;
  opened: boolean;
  children: ICreditsHeader[];
}

interface ICreditsSidebarProps {
  headers: ICreditsHeader[];
  toggleHeaderCallback: (id: string) => void;
}

export default function CreditsSidebar({ headers, toggleHeaderCallback }: ICreditsSidebarProps): JSX.Element {
  return (
    <div className='creditsSidebar'>
      {headers.map((header, index) => (
        <div
          key={index}
          className='creditsSidebar-header'
        >
          <div className='creditsSidebar-header-title'>
            <Link to={`#${header.id}`}>
              <div className='creditsSidebar-header-title-text'>{header.value}</div>
            </Link>
            {header.children.length > 0 && <img className='creditsSidebar-header-title-caret' src={header.opened ? caretUp : caretDown} alt={header.opened ? 'Caret up icon' : 'Caret down icon'} onClick={(): void => toggleHeaderCallback(header.id)} />}
          </div>
          {header.opened && (
            <div className='creditsSidebar-header-subheaders'>
              {header.children.map((subheader, index) => (
                <Link key={index} to={`#${subheader.id}`}>
                  <div className='creditsSidebar-header-subheaders-subheader'>
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