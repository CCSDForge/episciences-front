import { Link, useLocation, useMatches, useParams } from 'react-router-dom';

import './Breadcrumb.scss'

interface IBreadcrumbProps {
  id?: string;
}

export default function Breadcrumb({ id }: IBreadcrumbProps): JSX.Element {

  const location = useLocation();
  const matches = useMatches();
  const params = useParams();

  const match = matches.find((match) => match.pathname === location.pathname);
  const handle = match?.handle as { parent?: { path: string; label: string; }, crumb?: string | ((id: string) => string) } | undefined

  if (handle && handle.parent && handle.crumb) {
    let crumbLabel = typeof handle.crumb === 'function' ? id ? handle.crumb(id) : handle.crumb(params['id']!) : handle.crumb;

    return (
      <div className="breadcrumb">
        <span className='breadcrumb-parent'>
          <Link to={handle.parent.path}>{handle.parent.label}</Link>
        </span>
        {' '}
        <span className='breadcrumb-current'>{crumbLabel}</span>
      </div>
  )
  }

  return <></>;
}