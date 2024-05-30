import './BoardsSidebar.scss'

interface IBoardsSidebarProps {
  groups: string[];
  activeGroupIndex: number;
  onSetActiveGroupCallback: (index: number) => void;
}

export default function BoardsSidebar({ groups, activeGroupIndex, onSetActiveGroupCallback }: IBoardsSidebarProps): JSX.Element {
  return (
    <div className='boardsSidebar'>
      <div className='boardsSidebar-resume'>Table of contents</div>
      <div className='boardsSidebar-links'>
        {groups.map((group, index) => (
          <div
            key={index}
            className={`boardsSidebar-links-row ${index === activeGroupIndex && 'boardsSidebar-links-row-active'}`}
            onClick={(): void => onSetActiveGroupCallback(index)}
          >
            {group}
          </div>
        ))}
      </div>
    </div>
  )
}