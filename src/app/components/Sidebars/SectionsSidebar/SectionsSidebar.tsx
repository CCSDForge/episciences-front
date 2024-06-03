import Checkbox from '../../Checkbox/Checkbox';
import './SectionsSidebar.scss'

export interface ISectionTypeSelection {
  label: string;
  value: string;
  isChecked: boolean;
}

interface ISectionsSidebarProps {
  types: ISectionTypeSelection[];
  onCheckTypeCallback: (value: string) => void;
}

export default function SectionsSidebar({ types, onCheckTypeCallback }: ISectionsSidebarProps): JSX.Element {
  return (
    <div className='sectionsSidebar'>
      <div className='sectionsSidebar-typesSection'>
        <div className='sectionsSidebar-typesSection-title'>Types of section</div>
        <div className='sectionsSidebar-typesSection-types'>
          {types.map((t, index) => (
            <div
              key={index}
              className='sectionsSidebar-typesSection-types-choice'
            >
              <div className='sectionsSidebar-typesSection-types-choice-checkbox'>
                <Checkbox checked={t.isChecked} onChangeCallback={(): void => onCheckTypeCallback(t.value)}/>
              </div>
              <span
                className={`sectionsSidebar-typesSection-types-choice-label ${t.isChecked && 'sectionsSidebar-typesSection-types-choice-label-checked'}`}
                onClick={(): void => onCheckTypeCallback(t.value)}
              >
                {t.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}