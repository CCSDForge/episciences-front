import { Link } from 'react-router-dom';

import download from '/icons/download-red.svg';
import file from '/icons/file-grey.svg';
import { PATHS } from '../../../../config/paths';
import { IJournal } from '../../../../types/journal';
import { IVolume } from '../../../../types/volume';
import { AvailableLanguage } from '../../../../utils/i18n';
import './IssuesSection.scss'

interface IIssuesSectionProps {
  language: AvailableLanguage;
  issues: IVolume[];
  currentJournal?: IJournal;
}

export default function IssuesSection({ language, issues, currentJournal }: IIssuesSectionProps): JSX.Element {
  return (
    <div className="issuesSection">
      {issues.map((issue, index) => (
        <div key={index} className='issuesSection-card'>
          <div className="issuesSection-card-template">
            <div className="issuesSection-card-template-jpe">{currentJournal?.code.toUpperCase()}</div>
            <div className="issuesSection-card-template-volume">Volume</div>
            <div className="issuesSection-card-template-volume">Special Issue</div>
            <div className="issuesSection-card-template-number">{issue.num}</div>
            <div className="issuesSection-card-template-year">{issue.year}</div>
          </div>
          <div className="issuesSection-card-text">
            <Link to={`${PATHS.volumes}/${issue.id}`}>
              <div className='issuesSection-card-text-volume'>{`Volume ${issue.num} - Special issue`}</div>
            </Link>
            <div className="issuesSection-card-text-title">{issue.title ? issue.title[language] : ''}</div>
            <div className="issuesSection-card-text-year">{issue.year}</div>
            <div className="issuesSection-card-text-count">
              <img className="issuesSection-card-text-count-icon" src={file} alt='File icon' />
              <div className="issuesSection-card-text-count-text">{issue.articles.length > 1 ? `${issue.articles.length} articles`: `${issue.articles.length} article`}</div>
            </div>
            <Link to={issue.downloadLink} target='_blank' className="issuesSection-card-text-download">
              <img className="issuesSection-card-text-download-icon" src={download} alt='Download icon' />
              <div className="issuesSection-card-text-download-text">PDF</div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}