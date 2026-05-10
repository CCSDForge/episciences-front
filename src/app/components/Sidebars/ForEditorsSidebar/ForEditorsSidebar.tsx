import { Link } from 'react-router-dom';

import caretUp from '/icons/caret-up-grey.svg';
import caretDown from '/icons/caret-down-grey.svg';
import './ForEditorsSidebar.scss';

export interface IForEditorsHeader {
  id: string;
  value: string;
  opened: boolean;
  children: IForEditorsHeader[];
}

interface IForEditorsSidebarProps {
  headers: IForEditorsHeader[];
  toggleHeaderCallback: (id: string) => void;
}

export default function ForEditorsSidebar({
  headers,
  toggleHeaderCallback,
}: IForEditorsSidebarProps): JSX.Element {
  return (
    <div className="forEditorsSidebar">
      {headers.map((header, index) => (
        <div key={index} className="forEditorsSidebar-header">
          <div className="forEditorsSidebar-header-title">
            <Link to={`#${header.id}`}>
              <div className="forEditorsSidebar-header-title-text">
                {header.value}
              </div>
            </Link>
            {header.children.length > 0 && (
              <img
                className="forEditorsSidebar-header-title-caret"
                src={header.opened ? caretUp : caretDown}
                alt={header.opened ? 'Caret up icon' : 'Caret down icon'}
                onClick={(): void => toggleHeaderCallback(header.id)}
              />
            )}
          </div>
          {header.opened && (
            <div className="forEditorsSidebar-header-subheaders">
              {header.children.map((subheader, index) => (
                <Link key={index} to={`#${subheader.id}`}>
                  <div className="forEditorsSidebar-header-subheaders-subheader">
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
