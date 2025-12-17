import { Link } from 'react-router-dom';

import caretUp from '/icons/caret-up-grey.svg';
import caretDown from '/icons/caret-down-grey.svg';
import './EthicalCharterSidebar.scss';

export interface IEthicalCharterHeader {
  id: string;
  value: string;
  opened: boolean;
  children: IEthicalCharterHeader[];
}

interface IEthicalCharterSidebarProps {
  headers: IEthicalCharterHeader[];
  toggleHeaderCallback: (id: string) => void;
}

export default function EthicalCharterSidebar({
  headers,
  toggleHeaderCallback,
}: IEthicalCharterSidebarProps): JSX.Element {
  return (
    <div className="ethicalCharterSidebar">
      {headers.map((header, index) => (
        <div key={index} className="ethicalCharterSidebar-header">
          <div className="ethicalCharterSidebar-header-title">
            <Link to={`#${header.id}`}>
              <div className="ethicalCharterSidebar-header-title-text">
                {header.value}
              </div>
            </Link>
            {header.children.length > 0 && (
              <img
                className="ethicalCharterSidebar-header-title-caret"
                src={header.opened ? caretUp : caretDown}
                alt={header.opened ? 'Caret up icon' : 'Caret down icon'}
                onClick={(): void => toggleHeaderCallback(header.id)}
              />
            )}
          </div>
          {header.opened && (
            <div className="ethicalCharterSidebar-header-subheaders">
              {header.children.map((subheader, index) => (
                <Link key={index} to={`#${subheader.id}`}>
                  <div className="ethicalCharterSidebar-header-subheaders-subheader">
                    {subheader.value}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
