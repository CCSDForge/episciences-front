import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import externalLink from '/icons/external-link-red.svg';
import { AvailableLanguage } from '../../../../utils/i18n';
import './JournalSection.scss'

interface IJournalSectionProps {
  language: AvailableLanguage;
  content?: Record<AvailableLanguage, string>;
}

export default function JournalSection({ content, language }: IJournalSectionProps): JSX.Element {
  return (
    <div className='journalSection'>
        {content && (
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <Link to={props.href!} target='_blank'>
                  <span>{props.children?.toString()}</span>
                  <img src={externalLink} alt='Journal link icon' />
                </Link>
              ),
            }}
          >
            {content[language]}</ReactMarkdown>
        )}
    </div>
  )
}