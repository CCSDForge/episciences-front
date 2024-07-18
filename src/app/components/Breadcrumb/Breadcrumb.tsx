import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { PathKeys } from '../../../config/paths';
import './Breadcrumb.scss'

interface IBreadcrumbProps {
  parents: {
    path: PathKeys;
    label: string;
  }[];
  crumbLabel: string;
}

export default function Breadcrumb({ parents, crumbLabel }: IBreadcrumbProps): JSX.Element {
    return (
      <div className="breadcrumb">
        {parents.map((parent, index) => (
          <Fragment key={index}>
            <span className='breadcrumb-parent'>
              <Link to={`/${parent.path}`}>{parent.label}</Link>
            </span>
            {' '}
          </Fragment>
        ))}
        {' '}
        <span className='breadcrumb-current'>{crumbLabel}</span>
      </div>
  )
}