import './NewsSidebar.scss'

export interface INewsYearSelection {
  year: number;
  isSelected: boolean;
}

interface INewsSidebarProps {
  years: INewsYearSelection[];
  onSelectYearCallback: (year: number) => void;
}

export default function NewsSidebar({ years, onSelectYearCallback }: INewsSidebarProps): JSX.Element {
  return (
    <div className='newsSidebar'>
      <div className='newsSidebar-title'>Years</div>
      <div className='newsSidebar-years'>
        <div className='newsSidebar-years-list'>
          {years.map((y) => (
            <div
              key={y.year}
              className={`newsSidebar-years-list-year ${y.isSelected && 'newsSidebar-years-list-year-selected'}`}
              onClick={(): void => onSelectYearCallback(y.year)}
            >
              {y.year}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}