import caretUp from '/icons/caret-up-red.svg';
import caretDown from '/icons/caret-down-red.svg';
import { IArticle } from "../../../../types/article";
import './ArticleCard.scss'

export interface IArticleCard extends IArticle {
  openedAbstract: boolean;
}

interface IArticleCardProps extends IArticleCard {
  toggleAbstractCallback: () => void;
}

export default function ArticleCard({ title, authors, openedAbstract, abstract, publicationDate, tag, toggleAbstractCallback }: IArticleCardProps): JSX.Element {
  return (
    <div className='articleCard'>
      <div className='articleCard-tag'>{tag}</div>
      <div className='articleCard-title'>{title}</div>
      <div className='articleCard-authors'>{authors}</div>
      <div className='articleCard-abstract'>
        <div className={`articleCard-abstract-title ${!openedAbstract && 'articleCard-abstract-title-closed'}`} onClick={toggleAbstractCallback}>
          <div className='articleCard-abstract-title-text'>Abstract</div>
          {openedAbstract ? (
            <img className='articleCard-abstract-title-caret' src={caretUp} alt='Caret up icon' />
          ) : (
            <img className='articleCard-abstract-title-caret' src={caretDown} alt='Caret down icon' />
          )}
        </div>
        <div className={`articleCard-abstract-content ${openedAbstract && 'articleCard-abstract-content-opened'}`}>{abstract}</div>
      </div>
      <div className='articleCard-publicationDate'>{publicationDate}</div>
    </div>
  )
}