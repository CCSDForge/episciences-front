import { Link, useLocation, useMatches } from 'react-router-dom';

import './Breadcrumb.scss'

export default function Breadcrumb(): JSX.Element {
  const location = useLocation();
  const matches = useMatches();

  const match = matches.find((match) => match.pathname === location.pathname);
  const handle = match?.handle as { parent?: { path: string; label: string; }, crumb?: string } | undefined

  if (handle && handle.parent && handle.crumb) {
    return (
      <div className="breadcrumb">
        <span className='breadcrumb-parent'>
          <Link to={handle.parent.path}>{handle.parent.label}</Link>
        </span>
        {' '}
        <span className='breadcrumb-current'>{handle.crumb}</span>
      </div>
  )
  }

  return <></>;
}