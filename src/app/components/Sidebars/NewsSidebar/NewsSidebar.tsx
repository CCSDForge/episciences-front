import './NewsSidebar.scss'

interface INewsSidebarProps {
  filters: { id: number; title: string; choices: { id: number; label: string; isSelected: boolean; }[] }[];
  onSelectFilterChoiceCallback: (filterId: number, choiceId: number) => void;
}

export default function NewsSidebar({ filters, onSelectFilterChoiceCallback }: INewsSidebarProps): JSX.Element {
  return (
    <div className='newsSidebar'>
      {filters.map((filter, index) => (
        <div
          key={index}
          className='newsSidebar-filter'
        >
          <div className='newsSidebar-filter-title'>{filter.title}</div>
          <div className='newsSidebar-filter-choices'>
            {filter.choices.map((choice, index) => (
              <div
                key={index}
                className={`newsSidebar-filter-choices-choice ${choice.isSelected && 'newsSidebar-filter-choices-choice-selected'}`}
                onClick={(): void => onSelectFilterChoiceCallback(filter.id, choice.id )}
              >
                {choice.label}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}