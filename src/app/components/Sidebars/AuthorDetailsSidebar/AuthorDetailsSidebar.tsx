import { Link } from 'react-router-dom';
import { TFunction } from 'i18next';
import { MathJax } from 'better-react-mathjax';

import caretRight from '/icons/caret-right-grey.svg';
import close from '/icons/close-red.svg';
import { PATHS } from '../../../../config/paths';
import { IAuthor } from "../../../../types/author";
import { useFetchAuthorArticlesQuery } from '../../../../store/features/author/author.query';
import { formatDate } from '../../../../utils/date';
import { AvailableLanguage } from '../../../../utils/i18n';
import './AuthorDetailsSidebar.scss'

export interface IAuthorDetailsSidebarProps {
  language: AvailableLanguage;
  t: TFunction<"translation", undefined>
  rvcode?: string;
  expandedAuthor?: IAuthor;
  onCloseDetailsCallback: () => void;
}

export default function AuthorDetailsSidebar ({ language, t, rvcode, expandedAuthor, onCloseDetailsCallback }: IAuthorDetailsSidebarProps): JSX.Element {
  const { data: articles } = useFetchAuthorArticlesQuery({ rvcode: rvcode!, fullname: expandedAuthor?.name! }, { skip: !rvcode })

  return (
    <div className="authorDetailsSidebar">
      <img className='authorDetailsSidebar-close' src={close} alt='Close icon' onClick={onCloseDetailsCallback} />
      <div className="authorDetailsSidebar-content">
        <div className="authorDetailsSidebar-content-name">{expandedAuthor?.name}</div>
        {articles?.data.map((article, index) => (
          <div key={index} className="authorDetailsSidebar-content-article">
            <div className="authorDetailsSidebar-content-article-title">
              <MathJax dynamic>{article.title}</MathJax>
            </div>
            <div className="authorDetailsSidebar-content-article-publicationDate">{`${t('common.publishedOn')} ${formatDate(article.publicationDate, language)}`}</div>
            {article.doi && (
                <div className="authorDetailsSidebar-content-article-doi">
                  <div className="authorDetailsSidebar-content-article-doi-text">{t('common.doi')} :</div>
                  <Link to={`${import.meta.env.VITE_DOI_HOMEPAGE}/${article.doi}`} className="authorDetailsSidebar-content-article-doi-link" target='_blank'>{article.doi}</Link>
                </div>
            )}
            <Link to={`/${PATHS.articles}/${article.id}`}>
              <div className="authorDetailsSidebar-content-article-seeMore">
                <div className="authorDetailsSidebar-content-article-seeMore-text">{t('common.seeMore')}</div>
                <img className="authorDetailsSidebar-content-article-seeMore-icon" src={caretRight} alt='Caret right icon' />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}