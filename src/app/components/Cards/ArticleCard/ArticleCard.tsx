import logo from '/logo.svg';
import './ArticleCard.scss'

export interface IArticleCardProps {
  title: string;
  authors: string;
  openedAbstract: boolean;
  abstract: string;
  publicationDate: string;
  tag: string;
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
            <img className='articleCard-abstract-title-caret' src={logo} alt='Caret up icon' />
          ) : (
            <img className='articleCard-abstract-title-caret' src={logo} alt='Caret down icon' />
          )}
        </div>
        <div className={`articleCard-abstract-content ${openedAbstract && 'articleCard-abstract-content-opened'}`}>{abstract}</div>
      </div>
      <div className='articleCard-publicationDate'>{publicationDate}</div>
    </div>
  )
}