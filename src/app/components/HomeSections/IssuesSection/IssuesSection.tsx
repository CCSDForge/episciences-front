import { Link } from 'react-router-dom';
import { TFunction } from 'i18next';

import download from '/icons/download-red.svg';
import file from '/icons/file-grey.svg';
import { PATHS } from '../../../../config/paths';
import { IJournal } from '../../../../types/journal';
import { IVolume } from '../../../../types/volume';
import { AvailableLanguage } from '../../../../utils/i18n';
import './IssuesSection.scss'

interface IIssuesSectionProps {
  language: AvailableLanguage;
  t: TFunction<"translation", undefined>
  issues: IVolume[];
  currentJournal?: IJournal;
}

export default function IssuesSection({ language, t, issues, currentJournal }: IIssuesSectionProps): JSX.Element {
  return (
    <div className="issuesSection">
      {issues.map((issue, index) => (
        <div key={index} className='issuesSection-card'>
          <div className="issuesSection-card-template">
            <div className="issuesSection-card-template-jpe">{currentJournal?.code.toUpperCase()}</div>
            <div className="issuesSection-card-template-volume">{t('common.volumeCard.volume')}</div>
            <div className="issuesSection-card-template-volume">{t('common.volumeCard.specialIssue')}</div>
            <div className="issuesSection-card-template-number">{issue.num}</div>
            <div className="issuesSection-card-template-year">{issue.year}</div>
          </div>
          <div className="issuesSection-card-text">
            <Link to={`${PATHS.volumes}/${issue.id}`}>
              <div className='issuesSection-card-text-volume'>{`${t('common.volumeCard.volume')} ${issue.num} - ${t('common.volumeCard.specialIssue')}`}</div>
            </Link>
            <div className="issuesSection-card-text-title">{issue.title ? issue.title[language] : ''}</div>
            <div className="issuesSection-card-text-year">{issue.year}</div>
            <div className="issuesSection-card-text-count">
              <img className="issuesSection-card-text-count-icon" src={file} alt='File icon' />
              <div className="issuesSection-card-text-count-text">{issue.articles.length > 1 ? `${issue.articles.length} ${t('common.articles')}`: `${issue.articles.length} ${t('common.article')}`}</div>
            </div>
            <Link to={issue.downloadLink} target='_blank' className="issuesSection-card-text-download">
              <img className="issuesSection-card-text-download-icon" src={download} alt='Download icon' />
              <div className="issuesSection-card-text-download-text">{t('common.pdf')}</div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}