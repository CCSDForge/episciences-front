import { Link } from 'react-router-dom';

import externalLink from '/icons/external-link-red.svg';
import './JournalSection.scss'

// TODO: typehint in src from Home?
interface IJournal {
  title: string;
  link: string;
}

interface IJournalSectionProps {
  journals: IJournal[][]
}

export default function JournalSection({ journals }: IJournalSectionProps): JSX.Element {
  return (
    <div className='journalSection'>
        {journals.map((journalColumn, index) => (
            <div key={index} className='journalSection-column'>
              <ul>
                {journalColumn.map((journal, index) => (
                  <li key={index} className='journalSection-column-row'>
                    <Link to={journal.link}>
                      <div className='journalSection-column-row-text'>{journal.title}</div>
                      <img className='journalSection-column-row-text-img' src={externalLink} alt='Journal link icon' />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
        ))}
    </div>
  )
}