import Checkbox from '../../Checkbox/Checkbox';
import './SectionsSidebar.scss'

interface ISectionsSidebarProps {
  filters: { id: number; title: string; choices: { id: number; label: string; isChecked: boolean; }[] }[];
  onCheckFilterChoiceCallback: (filterId: number, choiceId: number) => void;
}

export default function SectionsSidebar({ filters, onCheckFilterChoiceCallback }: ISectionsSidebarProps): JSX.Element {
  return (
    <div className='sectionsSidebar'>
      {filters.map((filter, index) => (
        <div
          key={index}
          className='sectionsSidebar-filter'
        >
          <div className='sectionsSidebar-filter-title'>{filter.title}</div>
          <div className='sectionsSidebar-filter-choices'>
            {filter.choices.map((choice, index) => (
              <div
                key={index}
                className='sectionsSidebar-filter-choices-choice'
              >
                <div className='sectionsSidebar-filter-choices-choice-checkbox'>
                  <Checkbox checked={choice.isChecked} onChangeCallback={(): void => onCheckFilterChoiceCallback(filter.id, choice.id )}/>
                </div>
                <span
                  className={`sectionsSidebar-filter-choices-choice-label ${choice.isChecked && 'sectionsSidebar-filter-choices-choice-label-checked'}`}
                  onClick={(): void => onCheckFilterChoiceCallback(filter.id, choice.id )}
                >
                  {choice.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}