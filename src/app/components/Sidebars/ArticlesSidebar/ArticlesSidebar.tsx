import Checkbox from '../../Checkbox/Checkbox';
import './ArticlesSidebar.scss'

export interface IArticleTypeSelection {
  label: string;
  value: string;
  isChecked: boolean;
}

export interface IArticleSectionSelection {
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
  sections: IArticleSectionSelection[];
  onCheckSectionCallback: (value: string) => void;
  years: IArticleYearSelection[];
  onCheckYearCallback: (year: number) => void;
}

export default function ArticlesSidebar({ types, onCheckTypeCallback, sections, onCheckSectionCallback, years, onCheckYearCallback }: IArticlesSidebarProps): JSX.Element {
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
      <div className='articlesSidebar-sectionsSection'>
        <div className='articlesSidebar-sectionsSection-title'>Sections</div>
        <div className='articlesSidebar-sectionsSection-sections'>
          {sections.map((s, index) => (
            <div
              key={index}
              className='articlesSidebar-sectionsSection-sections-choice'
            >
              <div className='articlesSidebar-sectionsSection-sections-choice-checkbox'>
                <Checkbox checked={s.isChecked} onChangeCallback={(): void => onCheckSectionCallback(s.value)}/>
              </div>
              <span
                className={`articlesSidebar-sectionsSection-sections-choice-label ${s.isChecked && 'articlesSidebar-sectionsSection-sections-choice-label-checked'}`}
                onClick={(): void => onCheckSectionCallback(s.value)}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className='articlesSidebar-yearsSection'>
        <div className='articlesSidebar-yearsSection-title'>Years</div>
        <div className='articlesSidebar-yearsSection-years'>
          {years.map((y, index) => (
            <div
              key={index}
              className='articlesSidebar-yearsSection-years-choice'
            >
              <div className='articlesSidebar-yearsSection-years-choice-checkbox'>
                <Checkbox checked={y.isChecked} onChangeCallback={(): void => onCheckYearCallback(y.year)}/>
              </div>
              <span
                className={`articlesSidebar-yearsSection-years-choice-label ${y.isChecked && 'articlesSidebar-yearsSection-years-choice-label-checked'}`}
                onClick={(): void => onCheckYearCallback(y.year)}
              >
                {y.year}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}