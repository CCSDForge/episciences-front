import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'

import caretRight from '/icons/caret-right-grey.svg';
import { PATHS } from '../../../../config/paths';
import { INews } from '../../../../types/news';
import { formatDate } from '../../../../utils/date';
import { AvailableLanguage } from '../../../../utils/i18n';
import './PresentationSection.scss'

const MAX_ABOUT_CONTENT_LENGTH = 400;
const MAX_NEWS_CONTENT_LENGTH = 200;

interface IPresentationSectionProps {
  language: AvailableLanguage;
  aboutContent?: Record<AvailableLanguage, string>;
  lastNews?: INews;
}

export default function PresentationSection({ language, aboutContent, lastNews }: IPresentationSectionProps): JSX.Element {
  return (
    <div className="presentationSection">
      {aboutContent && aboutContent[language] && (
        <div className='presentationSection-about'>
          <div className='presentationSection-about-content'>
            <ReactMarkdown>{`${aboutContent[language].substring(0, MAX_ABOUT_CONTENT_LENGTH)}...`}</ReactMarkdown>
            </div>
          <Link to={PATHS.about}>
            <div className='presentationSection-about-seeMore'>
              <div className='presentationSection-about-seeMore-text'>See more</div>
              <img className='presentationSection-about-seeMore-icon' src={caretRight} alt='Caret right icon' />
            </div>
          </Link>
        </div>
      )}
      {lastNews && (
        <div className='presentationSection-new'>
          <div className='presentationSection-new-title'>
            <div className='presentationSection-new-title-date'>{formatDate(lastNews.publicationDate, language)}</div>
            <div className='presentationSection-new-title-text'>{lastNews.title[language]}</div>
          </div>
          {lastNews.content && <div className='presentationSection-new-description'>{`${lastNews.content[language].substring(0, MAX_NEWS_CONTENT_LENGTH)}...`}</div>}
          <Link to={PATHS.news}>
            <div className='presentationSection-new-seeMore'>
              <div className='presentationSection-new-seeMore-text'>See more</div>
              <img className='presentationSection-new-seeMore-icon' src={caretRight} alt='Caret right icon' />
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}