import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TFunction } from 'i18next';
import ReactMarkdown from 'react-markdown';

import caretUp from '/icons/caret-up-red.svg';
import caretDown from '/icons/caret-down-red.svg';
import { PATHS } from '../../../../config/paths';
import { ISection } from '../../../../types/section';
import { AvailableLanguage, getLocalizedContent } from '../../../../utils/i18n';
import './SectionCard.scss';

interface ISectionCardProps {
  language: AvailableLanguage;
  t: TFunction<'translation', undefined>;
  section: ISection;
}

export default function SectionCard({
  language,
  t,
  section,
}: ISectionCardProps): JSX.Element {
  const [openedDescription, setOpenedDescription] = useState(false);

  const toggleDescription = (): void =>
    setOpenedDescription(!openedDescription);

  const localizedTitle = section.title
    ? getLocalizedContent(section.title, language)
    : undefined;
  const localizedDescription = section.description
    ? getLocalizedContent(section.description, language)
    : undefined;

  return (
    <div className="sectionCard">
      <div className="sectionCard-title">
        <Link to={`${PATHS.sections}/${section.id}`}>
          <div className="sectionCard-title-text">{localizedTitle ?? ''}</div>
        </Link>
        <div className="sectionCard-title-count">
          {section.articles.length > 1
            ? `${section.articles.length} ${t('common.articles')}`
            : `${section.articles.length} ${t('common.article')}`}
        </div>
      </div>
      {localizedDescription && (
        <div className="sectionCard-description">
          <div
            className={`sectionCard-description-title ${!openedDescription && 'sectionCard-description-title-closed'}`}
            onClick={toggleDescription}
          >
            <div className="sectionCard-description-title-text">
              {t('common.about')}
            </div>
            {openedDescription ? (
              <img
                className="sectionCard-description-title-caret"
                src={caretUp}
                alt="Caret up icon"
              />
            ) : (
              <img
                className="sectionCard-description-title-caret"
                src={caretDown}
                alt="Caret down icon"
              />
            )}
          </div>
          <div
            className={`sectionCard-description-content ${openedDescription && 'sectionCard-description-content-opened'}`}
          >
            <ReactMarkdown>{localizedDescription}</ReactMarkdown>
          </div>
        </div>
      )}
      <div className="sectionCard-countMobile">
        {section.articles.length > 1
          ? `${section.articles.length} ${t('common.articles')}`
          : `${section.articles.length} ${t('common.article')}`}
      </div>
    </div>
  );
}
