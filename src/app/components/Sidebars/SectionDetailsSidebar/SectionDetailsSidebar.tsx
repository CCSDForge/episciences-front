import './SectionDetailsSidebar.scss'

interface ISectionDetailsSidebarProps {
  articlesCount: number;
}

export default function SectionDetailsSidebar({ articlesCount }: ISectionDetailsSidebarProps): JSX.Element {
  return (
    <div className="sectionDetailsSidebar">
      <div className='sectionDetailsSidebar-count'>
        {articlesCount > 1 ? `${articlesCount} articles` : `${articlesCount} article`}
      </div>
    </div>
  )
}