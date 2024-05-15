import './BoardSidebar.scss'

interface IBoardSidebarProps {
  groups: string[];
  activeGroupIndex: number;
  onSetActiveGroupCallback: (index: number) => void;
}

export default function BoardSidebar({ groups, activeGroupIndex, onSetActiveGroupCallback }: IBoardSidebarProps): JSX.Element {
  return (
    <div className='boardSidebar'>
      <div className='boardSidebar-resume'>Table of contents</div>
      <div className='boardSidebar-links'>
        {groups.map((group, index) => (
          <div
            key={index}
            className={`boardSidebar-links-row ${index === activeGroupIndex && 'boardSidebar-links-row-active'}`}
            onClick={(): void => onSetActiveGroupCallback(index)}
          >
            {group}
          </div>
        ))}
      </div>
    </div>
  )
}