import './BoardSidebar.scss'

interface IBoardSidebarProps {
  links: { text: string; isActive: boolean }[];
  onSetActiveLinkCallback: (index: number) => void;
}

export default function BoardSidebar({ links, onSetActiveLinkCallback }: IBoardSidebarProps): JSX.Element {
  return (
    <div className='boardSidebar'>
      <div className='boardSidebar-resume'>Table of contents</div>
      <div className='boardSidebar-links'>
        {links.map((link, index) => (
          <div
            key={index}
            className={`boardSidebar-links-row ${link.isActive && 'boardSidebar-links-row-active'}`}
            onClick={(): void => onSetActiveLinkCallback(index)}
          >
            {link.text}
          </div>
        ))}
      </div>
    </div>
  )
}