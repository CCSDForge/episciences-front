import download from '/icons/download-red.svg';
import file from '/icons/file-grey.svg';
import './IssuesSection.scss'

// TODO: type hint ?
interface IIssuesSectionProps {
  issues: { volume: string; title: string }[];
}

export default function IssuesSection({ issues }: IIssuesSectionProps): JSX.Element {
  return (
    <div className="issuesSection">
      {issues.map((issue, index) => (
        <div key={index} className='issuesSection-card'>
          <div className="issuesSection-card-template">
            <div className="issuesSection-card-template-jpe">JPE</div>
            <div className="issuesSection-card-template-volume">Volume</div>
            <div className="issuesSection-card-template-issue">Special Issue</div>
            <div className="issuesSection-card-template-number">13.1</div>
            <div className="issuesSection-card-template-year">2018</div>
          </div>
          <div className="issuesSection-card-text">
            <div className="issuesSection-card-text-volume">{issue.volume}</div>
            <div className="issuesSection-card-text-title">{issue.title}</div>
            <div className="issuesSection-card-text-year">2023 (in progress)</div>
            <div className="issuesSection-card-text-count">
              <img className="issuesSection-card-text-count-icon" src={file} alt='File icon' />
              <div className="issuesSection-card-text-count-text">12 articles</div>
            </div>
            <div className="issuesSection-card-text-download">
              <img className="issuesSection-card-text-download-icon" src={download} alt='Download icon' />
              <div className="issuesSection-card-text-download-text">PDF</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}