import { Link } from 'react-router-dom';

import caretUp from '/icons/caret-up-grey.svg';
import caretDown from '/icons/caret-down-grey.svg';
import './ProposingSpecialIssuesSidebar.scss';

export interface IProposingSpecialIssuesHeader {
  id: string;
  value: string;
  opened: boolean;
  children: IProposingSpecialIssuesHeader[];
}

interface IProposingSpecialIssuesSidebarProps {
  headers: IProposingSpecialIssuesHeader[];
  toggleHeaderCallback: (id: string) => void;
}

export default function ProposingSpecialIssuesSidebar({
  headers,
  toggleHeaderCallback,
}: IProposingSpecialIssuesSidebarProps): JSX.Element {
  return (
    <div className="proposingSpecialIssuesSidebar">
      {headers.map((header, index) => (
        <div key={index} className="proposingSpecialIssuesSidebar-header">
          <div className="proposingSpecialIssuesSidebar-header-title">
            <Link to={`#${header.id}`}>
              <div className="proposingSpecialIssuesSidebar-header-title-text">
                {header.value}
              </div>
            </Link>
            {header.children.length > 0 && (
              <img
                className="proposingSpecialIssuesSidebar-header-title-caret"
                src={header.opened ? caretUp : caretDown}
                alt={header.opened ? 'Caret up icon' : 'Caret down icon'}
                onClick={(): void => toggleHeaderCallback(header.id)}
              />
            )}
          </div>
          {header.opened && (
            <div className="proposingSpecialIssuesSidebar-header-subheaders">
              {header.children.map((subheader, index) => (
                <Link key={index} to={`#${subheader.id}`}>
                  <div className="proposingSpecialIssuesSidebar-header-subheaders-subheader">
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
