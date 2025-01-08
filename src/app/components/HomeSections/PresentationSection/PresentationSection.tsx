import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'
import { TFunction } from 'i18next';

import caretRight from '/icons/caret-right-grey.svg';
import { HOMEPAGE_LAST_INFORMATION_BLOCK } from '../../../../config/homepage';
import { PATHS } from '../../../../config/paths';
import { INews } from '../../../../types/news';
import { IVolume } from '../../../../types/volume';
import { formatDate } from '../../../../utils/date';
import { AvailableLanguage } from '../../../../utils/i18n';
import { VOLUME_TYPE } from '../../../../utils/volume';
import './PresentationSection.scss'

const MAX_ABOUT_CONTENT_LENGTH = 400;
const MAX_NEWS_CONTENT_LENGTH = 200;

interface IPresentationSectionProps {
  language: AvailableLanguage;
  t: TFunction<"translation", undefined>
  aboutContent?: Record<AvailableLanguage, string>;
  lastInformation?: {
    type: HOMEPAGE_LAST_INFORMATION_BLOCK;
    information?: IVolume | INews }
}

export default function PresentationSection({ language, t, aboutContent, lastInformation }: IPresentationSectionProps): JSX.Element {
  return (
    <div className="presentationSection">
      {aboutContent && aboutContent[language] && (
        <div className='presentationSection-about'>
          <div className='presentationSection-about-content'>
            <ReactMarkdown>{`${aboutContent[language]?.substring(0, MAX_ABOUT_CONTENT_LENGTH) ?? ''}...`}</ReactMarkdown>
            </div>
          <Link to={PATHS.about}>
            <div className='presentationSection-about-seeMore'>
              <div className='presentationSection-about-seeMore-text'>{t('common.seeMore')}</div>
              <img className='presentationSection-about-seeMore-icon' src={caretRight} alt='Caret right icon' />
            </div>
          </Link>
        </div>
      )}
      {lastInformation && lastInformation.information && (
        <>
          {lastInformation.type === HOMEPAGE_LAST_INFORMATION_BLOCK.LAST_NEWS && (
            <div className='presentationSection-new'>
              <div className='presentationSection-new-title'>
                <div className='presentationSection-new-title-date'>{formatDate((lastInformation.information as INews).publicationDate, language)}</div>
                <div className='presentationSection-new-title-text'>{(lastInformation.information as INews).title[language]}</div>
              </div>
              {(lastInformation.information as INews).content && <div className='presentationSection-new-description'>{`${(lastInformation.information as INews).content![language]?.substring(0, MAX_NEWS_CONTENT_LENGTH) ?? ''}...`}</div>}
              <Link to={PATHS.news}>
                <div className='presentationSection-new-seeMore'>
                  <div className='presentationSection-new-seeMore-text'>{t('common.seeMore')}</div>
                  <img className='presentationSection-new-seeMore-icon' src={caretRight} alt='Caret right icon' />
                </div>
              </Link>
            </div>
          )}
          {(lastInformation.type === HOMEPAGE_LAST_INFORMATION_BLOCK.LAST_VOLUME || lastInformation.type === HOMEPAGE_LAST_INFORMATION_BLOCK.LAST_SPECIAL_ISSUE) && (
            <div className='presentationSection-new'>
              <div className='presentationSection-new-title'>
                <div className='presentationSection-new-title-date'>{(lastInformation.information as IVolume).year}</div>
                <div className='presentationSection-new-title-text'>{(lastInformation.information as IVolume).title ? (lastInformation.information as IVolume).title![language] : ''}</div>
              </div>
              {(lastInformation.information as IVolume).description && <div className='presentationSection-new-description'>{`${(lastInformation.information as IVolume).description![language]?.substring(0, MAX_NEWS_CONTENT_LENGTH) ?? ''}...`}</div>}
              <Link to={lastInformation.type === HOMEPAGE_LAST_INFORMATION_BLOCK.LAST_VOLUME ? PATHS.volumes : `${PATHS.volumes}?type=${VOLUME_TYPE.SPECIAL_ISSUE}`}>
                <div className='presentationSection-new-seeMore'>
                  <div className='presentationSection-new-seeMore-text'>{t('common.seeMore')}</div>
                  <img className='presentationSection-new-seeMore-icon' src={caretRight} alt='Caret right icon' />
                </div>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}