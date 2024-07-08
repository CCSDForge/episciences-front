import caretRightBlack from '/icons/caret-right-black.svg';
import caretRightRed from '/icons/caret-right-red.svg';
import { IAuthor } from "../../../../types/author";
import './AuthorCard.scss'

export interface IAuthorCardProps {
  author: IAuthor;
  expandedCard: boolean;
  setExpandedAuthorIndexCallback: () => void;
}

export default function AuthorCard({ author, expandedCard, setExpandedAuthorIndexCallback }: IAuthorCardProps): JSX.Element {
  return (
    <div className='authorCard'>
      <div className='authorCard-title'>
        <div className='authorCard-title-name' onClick={setExpandedAuthorIndexCallback}>
          <div className={`authorCard-title-name-text ${expandedCard && 'authorCard-title-name-text-expanded'}`}>{author.name}</div>
          {expandedCard ? (
            <img className='authorCard-title-name-caret' src={caretRightRed} alt='Caret right icon' />
          ) : (
            <img className='authorCard-title-name-caret' src={caretRightBlack} alt='Caret right icon' />
          )}
        </div>
        <div className='authorCard-title-count'>{author.count > 1 ? `${author.count} articles` : `${author.count} article`}</div>
      </div>
    </div>
  )
}