import { useTranslation } from 'react-i18next';

import './SectionDetailsSidebar.scss'

interface ISectionDetailsSidebarProps {
  articlesCount: number;
}

export default function SectionDetailsSidebar({ articlesCount }: ISectionDetailsSidebarProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="sectionDetailsSidebar">
      <div className='sectionDetailsSidebar-count'>
        {articlesCount > 1 ? `${articlesCount} ${t('common.articles')}` : `${articlesCount} ${t('common.article')}`}
      </div>
    </div>
  )
}