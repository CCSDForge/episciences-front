import { Link } from 'react-router-dom';

import caretUp from '/icons/caret-up-grey.svg';
import caretDown from '/icons/caret-down-grey.svg';
import './ForConferenceOrganisersSidebar.scss'

export interface IForConferenceOrganisersHeader {
  id: string;
  value: string;
  opened: boolean;
  children: IForConferenceOrganisersHeader[];
}

interface IForConferenceOrganisersSidebarProps {
  headers: IForConferenceOrganisersHeader[];
  toggleHeaderCallback: (id: string) => void;
}

export default function ForConferenceOrganisersSidebar({ headers, toggleHeaderCallback }: IForConferenceOrganisersSidebarProps): JSX.Element {
  return (
    <div className='forConferenceOrganisersSidebar'>
      {headers.map((header, index) => (
        <div
          key={index}
          className='forConferenceOrganisersSidebar-header'
        >
          <div className='forConferenceOrganisersSidebar-header-title'>
            <Link to={`#${header.id}`}>
              <div className='forConferenceOrganisersSidebar-header-title-text'>{header.value}</div>
            </Link>
            {header.children.length > 0 && <img className='forConferenceOrganisersSidebar-header-title-caret' src={header.opened ? caretUp : caretDown} alt={header.opened ? 'Caret up icon' : 'Caret down icon'} onClick={(): void => toggleHeaderCallback(header.id)} />}
          </div>
          {header.opened && (
            <div className='forConferenceOrganisersSidebar-header-subheaders'>
              {header.children.map((subheader, index) => (
                <Link key={index} to={`#${subheader.id}`}>
                  <div className='forConferenceOrganisersSidebar-header-subheaders-subheader'>
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