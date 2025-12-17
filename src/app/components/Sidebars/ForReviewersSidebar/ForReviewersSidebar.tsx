import { Link } from 'react-router-dom';

import caretUp from '/icons/caret-up-grey.svg';
import caretDown from '/icons/caret-down-grey.svg';
import './ForReviewersSidebar.scss';

export interface IForReviewersHeader {
  id: string;
  value: string;
  opened: boolean;
  children: IForReviewersHeader[];
}

interface IForReviewersSidebarProps {
  headers: IForReviewersHeader[];
  toggleHeaderCallback: (id: string) => void;
}

export default function ForReviewersSidebar({
  headers,
  toggleHeaderCallback,
}: IForReviewersSidebarProps): JSX.Element {
  return (
    <div className="forReviewersSidebar">
      {headers.map((header, index) => (
        <div key={index} className="forReviewersSidebar-header">
          <div className="forReviewersSidebar-header-title">
            <Link to={`#${header.id}`}>
              <div className="forReviewersSidebar-header-title-text">
                {header.value}
              </div>
            </Link>
            {header.children.length > 0 && (
              <img
                className="forReviewersSidebar-header-title-caret"
                src={header.opened ? caretUp : caretDown}
                alt={header.opened ? 'Caret up icon' : 'Caret down icon'}
                onClick={(): void => toggleHeaderCallback(header.id)}
              />
            )}
          </div>
          {header.opened && (
            <div className="forReviewersSidebar-header-subheaders">
              {header.children.map((subheader, index) => (
                <Link key={index} to={`#${subheader.id}`}>
                  <div className="forReviewersSidebar-header-subheaders-subheader">
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
