import { Link } from 'react-router-dom';

import caretUp from '/icons/caret-up-grey.svg';
import caretDown from '/icons/caret-down-grey.svg';
import './AcknowledgmentsSidebar.scss'

export interface IJournalAcknowledgmentsHeader {
  id: string;
  value: string;
  opened: boolean;
  children: IJournalAcknowledgmentsHeader[];
}

interface IJournalAcknowledgmentsSidebarProps {
  headers: IJournalAcknowledgmentsHeader[];
  toggleHeaderCallback: (id: string) => void;
}

export default function AcknowledgmentsSidebar({ headers, toggleHeaderCallback }: IJournalAcknowledgmentsSidebarProps): JSX.Element {
  return (
    <div className='journalAcknowledgmentsSidebar'>
      {headers.map((header, index) => (
        <div
          key={index}
          className='journalAcknowledgmentsSidebar-header'
        >
          <div className='journalAcknowledgmentsSidebar-header-title'>
            <Link to={`#${header.id}`}>
              <div className='journalAcknowledgmentsSidebar-header-title-text'>{header.value}</div>
            </Link>
            {header.children.length > 0 && <img className='journalAcknowledgmentsSidebar-header-title-caret' src={header.opened ? caretUp : caretDown} alt={header.opened ? 'Caret up icon' : 'Caret down icon'} onClick={(): void => toggleHeaderCallback(header.id)} />}
          </div>
          {header.opened && (
            <div className='journalAcknowledgmentsSidebar-header-subheaders'>
              {header.children.map((subheader, index) => (
                <Link key={index} to={`#${subheader.id}`}>
                  <div className='journalAcknowledgmentsSidebar-header-subheaders-subheader'>
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
