import Checkbox from '../../Checkbox/Checkbox';
import './ArticlesSidebar.scss'

export interface IArticleTypeSelection {
  label: string;
  value: string;
  isChecked: boolean;
}

export interface IArticleYearSelection {
  year: number;
  isChecked: boolean;
}

interface IArticlesSidebarProps {
  types: IArticleTypeSelection[];
  onCheckTypeCallback: (value: string) => void;
  years: IArticleYearSelection[];
  onCheckYearCallback: (year: number) => void;
}

export default function ArticlesSidebar({ types, onCheckTypeCallback, years, onCheckYearCallback }: IArticlesSidebarProps): JSX.Element {
  return (
    <div className='articlesSidebar'>
      <div className='articlesSidebar-typesSection'>
        <div className='articlesSidebar-typesSection-title'>Types of document</div>
        <div className='articlesSidebar-typesSection-types'>
          {types.map((t, index) => (
            <div
              key={index}
              className='articlesSidebar-typesSection-types-choice'
            >
              <div className='articlesSidebar-typesSection-types-choice-checkbox'>
                <Checkbox checked={t.isChecked} onChangeCallback={(): void => onCheckTypeCallback(t.value)}/>
              </div>
              <span
                className={`articlesSidebar-typesSection-types-choice-label ${t.isChecked && 'articlesSidebar-typesSection-types-choice-label-checked'}`}
                onClick={(): void => onCheckTypeCallback(t.value)}
              >
                {t.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className='articlesSidebar-yearsSection'>
        <div className='articlesSidebar-yearsSection-title'>Years</div>
        <div className='articlesSidebar-yearsSection-years'>
          <div className='articlesSidebar-yearsSection-years-list'>
            {years.map((y, index) => (
              <div
                key={index}
                className='articlesSidebar-yearsSection-years-list-choice'
              >
                <div className='articlesSidebar-yearsSection-years-list-choice-checkbox'>
                  <Checkbox checked={y.isChecked} onChangeCallback={(): void => onCheckYearCallback(y.year)}/>
                </div>
                <span
                  className={`articlesSidebar-yearsSection-years-list-choice-label ${y.isChecked && 'articlesSidebar-yearsSection-years-list-choice-label-checked'}`}
                  onClick={(): void => onCheckYearCallback(y.year)}
                >
                  {y.year}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}