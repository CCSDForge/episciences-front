import { Link } from 'react-router-dom'

import download from '/icons/download-black.svg';
import externalLink from '/icons/external-link-black.svg';
import { FetchedArticle } from '../../../../utils/article'
import './ArticleDetailsSidebar.scss'

interface IArticleDetailsSidebarProps {
  article: FetchedArticle;
}

export default function ArticleDetailsSidebar({ article }: IArticleDetailsSidebarProps): JSX.Element {
  return (
    <div className='articleDetailsSidebar'>
      <div className='articleDetailsSidebar-links'>
        {article?.pdfLink && (
          <Link to={article?.pdfLink} target='_blank'>
            <div className='articleDetailsSidebar-links-link'>
              <img className='articleDetailsSidebar-links-link-icon' src={download} alt='Download icon' />
              <div className='articleDetailsSidebar-links-link-text'>Download article</div>
            </div>
          </Link>
        )}
        {article?.halLink && (
          <Link to={article?.halLink} target='_blank'>
            <div className='articleDetailsSidebar-links-link'>
              <img className='articleDetailsSidebar-links-link-icon' src={externalLink} alt='External link icon' />
              <div className='articleDetailsSidebar-links-link-text'>Open on HAL</div>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}