import './VolumeDetailsSidebar.scss'

interface IVolumeDetailsSidebarProps {
  articlesCount: number;
}

export default function VolumeDetailsSidebar({ articlesCount }: IVolumeDetailsSidebarProps): JSX.Element {
  return (
    <div className="volumeDetailsSidebar">
      <div className='volumeDetailsSidebar-count'>
        {articlesCount > 1 ? `${articlesCount} articles` : `${articlesCount} article`}
      </div>
    </div>
  )
}