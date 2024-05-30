import Checkbox from '../../Checkbox/Checkbox';
import './ArticlesSidebar.scss'

interface IArticlesSidebarProps {
  filters: { id: number; title: string; choices: { id: number; label: string; isChecked: boolean; }[] }[];
  onCheckFilterChoiceCallback: (filterId: number, choiceId: number) => void;
}

export default function ArticlesSidebar({ filters, onCheckFilterChoiceCallback }: IArticlesSidebarProps): JSX.Element {
  return (
    <div className='articlesSidebar'>
      {filters.map((filter, index) => (
        <div
          key={index}
          className='articlesSidebar-filter'
        >
          <div className='articlesSidebar-filter-title'>{filter.title}</div>
          <div className='articlesSidebar-filter-choices'>
            {filter.choices.map((choice, index) => (
              <div
                key={index}
                className='articlesSidebar-filter-choices-choice'
              >
                <div className='articlesSidebar-filter-choices-choice-checkbox'>
                  <Checkbox checked={choice.isChecked} onChangeCallback={(): void => onCheckFilterChoiceCallback(filter.id, choice.id )}/>
                </div>
                <span
                  className={`articlesSidebar-filter-choices-choice-label ${choice.isChecked && 'articlesSidebar-filter-choices-choice-label-checked'}`}
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