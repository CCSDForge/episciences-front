import { useState } from 'react';

import caretUp from '/icons/caret-up-red.svg';
import caretDown from '/icons/caret-down-red.svg';
import { ISection } from "../../../../types/section";
import { AvailableLanguage } from '../../../../utils/i18n';
import './SectionCard.scss'

interface ISectionCardProps {
  language: AvailableLanguage;
  section: ISection;
}

export default function SectionCard({ language, section }: ISectionCardProps): JSX.Element {
  const [openedDescription, setOpenedDescription] = useState(false)

  const toggleDescription = (): void => setOpenedDescription(!openedDescription)

  return (
    <div className='sectionCard'>
      <div className='sectionCard-title'>
        <div className='sectionCard-title-text'>{section.title ? section.title[language] : ''}</div>
        <div className='sectionCard-title-count'>{section.articles.length > 1 ? `${section.articles.length} articles`: `${section.articles.length} article`}</div>
      </div>
      {section.description && (
        <div className='sectionCard-description'>
          <div className={`sectionCard-description-title ${!openedDescription && 'sectionCard-description-title-closed'}`} onClick={toggleDescription}>
            <div className='sectionCard-description-title-text'>About</div>
            {openedDescription ? (
              <img className='sectionCard-description-title-caret' src={caretUp} alt='Caret up icon' />
            ) : (
              <img className='sectionCard-description-title-caret' src={caretDown} alt='Caret down icon' />
            )}
          </div>
          <div className={`sectionCard-description-content ${openedDescription && 'sectionCard-description-content-opened'}`}>{section.description[language]}</div>
        </div>
      )}
    </div>
  )
}