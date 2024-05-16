import Checkbox from '../../Checkbox/Checkbox';
import './ArticleSidebar.scss'

interface IArticleSidebarProps {
  filters: { id: number; title: string; choices: { id: number; label: string; isChecked: boolean; }[] }[];
  onCheckFilterChoiceCallback: (filterId: number, choiceId: number) => void;
}

export default function ArticleSidebar({ filters, onCheckFilterChoiceCallback }: IArticleSidebarProps): JSX.Element {
  return (
    <div className='articleSidebar'>
      {filters.map((filter, index) => (
        <div
          key={index}
          className='articleSidebar-filter'
        >
          <div className='articleSidebar-filter-title'>{filter.title}</div>
          <div className='articleSidebar-filter-choices'>
            {filter.choices.map((choice, index) => (
              <div
                key={index}
                className='articleSidebar-filter-choices-choice'
              >
                <div className='articleSidebar-filter-choices-choice-checkbox'>
                  <Checkbox checked={choice.isChecked} onChangeCallback={(): void => onCheckFilterChoiceCallback(filter.id, choice.id )}/>
                </div>
                <span
                  className={`articleSidebar-filter-choices-choice-label ${choice.isChecked && 'articleSidebar-filter-choices-choice-label-checked'}`}
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