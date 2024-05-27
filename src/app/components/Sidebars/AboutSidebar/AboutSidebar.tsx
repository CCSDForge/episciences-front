import { Link } from 'react-router-dom';

import caretUp from '/icons/caret-up-grey.svg';
import caretDown from '/icons/caret-down-grey.svg';
import './AboutSidebar.scss'

export interface IAboutHeader {
  id: string;
  value: string;
  opened: boolean;
  children: IAboutHeader[];
}

interface IAboutSidebarProps {
  headers: IAboutHeader[];
  toggleHeaderCallback: (id: string) => void;
}

export default function AboutSidebar({ headers, toggleHeaderCallback }: IAboutSidebarProps): JSX.Element {
  return (
    <div className='aboutSidebar'>
      {headers.map((header, index) => (
        <div
          key={index}
          className='aboutSidebar-header'
        >
          {header.children.length === 0 ? (
            <Link to={`#${header.id}`}>
              <div className='aboutSidebar-header-title'>{header.value}</div>
            </Link>
          ) : (
            <div className='aboutSidebar-header-title' onClick={(): void => toggleHeaderCallback(header.id)}>
              <div className='aboutSidebar-header-title-text'>{header.value}</div>
              {header.opened ? (
                <img className='aboutSidebar-header-title-caret' src={caretUp} alt='Caret up icon' />
              ) : (
                <img className='aboutSidebar-header-title-caret' src={caretDown} alt='Caret down icon' />
              )}
            </div>
          )}
          {header.opened && (
            <div className='aboutSidebar-header-subheaders'>
              {header.children.map((subheader, index) => (
                <Link key={index} to={`#${subheader.id}`}>
                  <div className='aboutSidebar-header-subheaders-subheader'>
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