import './StatisticsSidebar.scss'

interface IStatisticsSidebarProps {
  filters: { id: number; title: string; choices: { id: number; label: string; isSelected: boolean; }[] }[];
  onSelectFilterChoiceCallback: (filterId: number, choiceId: number) => void;
}

export default function StatisticsSidebar({ filters, onSelectFilterChoiceCallback }: IStatisticsSidebarProps): JSX.Element {
  return (
    <div className='statisticsSidebar'>
      {filters.map((filter, index) => (
        <div
          key={index}
          className='statisticsSidebar-filter'
        >
          <div className='statisticsSidebar-filter-title'>{filter.title}</div>
          <div className='statisticsSidebar-filter-choices'>
            {filter.choices.map((choice, index) => (
              <div
                key={index}
                className={`statisticsSidebar-filter-choices-choice ${choice.isSelected && 'statisticsSidebar-filter-choices-choice-selected'}`}
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