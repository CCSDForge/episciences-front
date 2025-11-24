
import { Link } from 'react-router-dom';

import caretUp from '/icons/caret-up-grey.svg';
import caretDown from '/icons/caret-down-grey.svg';
import './AcknowledgementsSidebar.scss'

export interface IAcknowledgementsHeader {
    id: string;
    value: string;
    opened: boolean;
    children: IAcknowledgementsHeader[];
}

interface IAcknowledgementsSidebarProps {
    headers: IAcknowledgementsHeader[];
    toggleHeaderCallback: (id: string) => void;
}

export default function AcknowledgementsSidebar({ headers, toggleHeaderCallback }: IAcknowledgementsSidebarProps): JSX.Element {
    return (
        <div className='acknowledgementsSidebar'>
            {headers.map((header, index) => (
                <div
                    key={index}
                    className='acknowledgementsSidebar-header'
                >
                    <div className='acknowledgementsSidebar-header-title'>
                        <Link to={`#${header.id}`}>
                            <div className='acknowledgementsSidebar-header-title-text'>{header.value}</div>
                        </Link>
                        {header.children.length > 0 && <img className='acknowledgementsSidebar-header-title-caret' src={header.opened ? caretUp : caretDown} alt={header.opened ? 'Caret up icon' : 'Caret down icon'} onClick={(): void => toggleHeaderCallback(header.id)} />}
                    </div>
                    {header.opened && (
                        <div className='acknowledgementsSidebar-header-subheaders'>
                            {header.children.map((subheader, index) => (
                                <Link key={index} to={`#${subheader.id}`}>
                                    <div className='acknowledgementsSidebar-header-subheaders-subheader'>
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