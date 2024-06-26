import caretRightBlack from '/icons/caret-right-black.svg';
import caretRightRed from '/icons/caret-right-red.svg';
import { IAuthor } from "../../../../types/author";
import './AuthorCard.scss'

export interface IAuthorCardProps extends IAuthor {
  expandedCard: boolean;
  setExpandedAuthorIndexCallback: () => void;
}

export default function AuthorCard({ name, articlesCount, university, expandedCard, setExpandedAuthorIndexCallback }: IAuthorCardProps): JSX.Element {
  return (
    <div className='authorCard'>
      <div className='authorCard-title'>
        <div className='authorCard-title-name' onClick={setExpandedAuthorIndexCallback}>
          <div className={`authorCard-title-name-text ${expandedCard && 'authorCard-title-name-text-expanded'}`}>{name}</div>
          {expandedCard ? (
            <img className='authorCard-title-name-caret' src={caretRightRed} alt='Caret right icon' />
          ) : (
            <img className='authorCard-title-name-caret' src={caretRightBlack} alt='Caret right icon' />
          )}
        </div>
        {/* <div className='authorCard-title-count'>{articlesCount > 1 ? `${articlesCount} articles` : `${articlesCount} article`}</div> */}
        <div className='authorCard-title-count'>99 articles</div>
      </div>
      {/* <div className='authorCard-university'>{university}</div> */}
      <div className='authorCard-university'>University of Oxford, United Kingdom</div>
    </div>
  )
}