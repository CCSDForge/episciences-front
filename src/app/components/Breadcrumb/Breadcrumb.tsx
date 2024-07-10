import { Link } from 'react-router-dom';

import { PathKeys } from '../../../config/paths';
import './Breadcrumb.scss'

interface IBreadcrumbProps {
  parent: {
    path: PathKeys;
    label: string;
  };
  crumbLabel: string;
}

export default function Breadcrumb({ parent, crumbLabel }: IBreadcrumbProps): JSX.Element {
    return (
      <div className="breadcrumb">
        <span className='breadcrumb-parent'>
          <Link to={`/${parent.path}`}>{parent.label}</Link>
        </span>
        {' '}
        <span className='breadcrumb-current'>{crumbLabel}</span>
      </div>
  )
}