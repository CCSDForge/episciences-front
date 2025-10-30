import { Link } from 'react-router-dom';

import caretUp from '/icons/caret-up-grey.svg';
import caretDown from '/icons/caret-down-grey.svg';
import './IndexationSidebar.scss'

export interface IIndexationHeader {
    id: string;
    value: string;
    opened: boolean;
    children: IIndexationHeader[];
}

interface IIndexationSidebarProps {
    headers: IIndexationHeader[];
    toggleHeaderCallback: (id: string) => void;
}

export default function IndexationSidebar({ headers, toggleHeaderCallback }: IIndexationSidebarProps): JSX.Element {
    return (
        <div className='indexationSidebar'>
            {headers.map((header, index) => (
                <div
                    key={index}
                    className='indexationSidebar-header'
                >
                    <div className='indexationSidebar-header-title'>
                        <Link to={`#${header.id}`}>
                            <div className='indexationSidebar-header-title-text'>{header.value}</div>
                        </Link>
                        {header.children.length > 0 && <img className='indexationSidebar-header-title-caret' src={header.opened ? caretUp : caretDown} alt={header.opened ? 'Caret up icon' : 'Caret down icon'} onClick={(): void => toggleHeaderCallback(header.id)} />}
                    </div>
                    {header.opened && (
                        <div className='indexationSidebar-header-subheaders'>
                            {header.children.map((subheader, index) => (
                                <Link key={index} to={`#${subheader.id}`}>
                                    <div className='indexationSidebar-header-subheaders-subheader'>
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
