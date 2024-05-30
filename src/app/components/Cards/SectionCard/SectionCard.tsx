import caretUp from '/icons/caret-up-red.svg';
import caretDown from '/icons/caret-down-red.svg';
import { ISection } from "../../../../types/section";
import './SectionCard.scss'

export interface ISectionCard extends ISection {
  openedAbstract: boolean;
}

interface ISectionCardProps extends ISectionCard {
  toggleAbstractCallback: () => void;
}

export default function SectionCard({ title, authors, openedAbstract, abstract, publicationDate, tag, toggleAbstractCallback }: ISectionCardProps): JSX.Element {
  return (
    <div className='sectionCard'>
      <div className='sectionCard-tag'>{tag}</div>
      <div className='sectionCard-title'>{title}</div>
      <div className='sectionCard-authors'>{authors}</div>
      <div className='sectionCard-abstract'>
        <div className={`sectionCard-abstract-title ${!openedAbstract && 'sectionCard-abstract-title-closed'}`} onClick={toggleAbstractCallback}>
          <div className='sectionCard-abstract-title-text'>Abstract</div>
          {openedAbstract ? (
            <img className='sectionCard-abstract-title-caret' src={caretUp} alt='Caret up icon' />
          ) : (
            <img className='sectionCard-abstract-title-caret' src={caretDown} alt='Caret down icon' />
          )}
        </div>
        <div className={`sectionCard-abstract-content ${openedAbstract && 'sectionCard-abstract-content-opened'}`}>{abstract}</div>
      </div>
      <div className='sectionCard-publicationDate'>{publicationDate}</div>
    </div>
  )
}