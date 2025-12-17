import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import { AvailableLanguage } from '../../../../utils/i18n';
import './JournalSection.scss';

interface IJournalSectionProps {
  language: AvailableLanguage;
  content?: Record<AvailableLanguage, string>;
}

export default function JournalSection({
  content,
  language,
}: IJournalSectionProps): JSX.Element {
  return (
    <div className="journalSection">
      {content && (
        <ReactMarkdown
          components={{
            a: ({ ...props }) => (
              <Link to={props.href!} target="_blank">
                <span>{props.children?.toString()}</span>
              </Link>
            ),
          }}
        >
          {content[language]}
        </ReactMarkdown>
      )}
    </div>
  );
}
