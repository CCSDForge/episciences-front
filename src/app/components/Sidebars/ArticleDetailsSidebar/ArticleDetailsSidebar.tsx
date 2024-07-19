import { useState } from 'react';
import { Link } from 'react-router-dom'
import { TFunction } from 'i18next';

import caretUp from '/icons/caret-up-grey.svg';
import caretDown from '/icons/caret-down-grey.svg';
import download from '/icons/download-black.svg';
import externalLink from '/icons/external-link-black.svg';
import { PATHS } from '../../../../config/paths';
import { IArticle } from '../../../../types/article';
import { IVolume } from '../../../../types/volume';
import { formatDate } from '../../../../utils/date';
import { AvailableLanguage } from '../../../../utils/i18n';
import { VOLUME_TYPE } from '../../../../utils/volume';
import './ArticleDetailsSidebar.scss'

interface IArticleDetailsSidebarProps {
  language: AvailableLanguage;
  t: TFunction<"translation", undefined>;
  article: IArticle;
  relatedVolume?: IVolume;
}

export default function ArticleDetailsSidebar({ language, t, article, relatedVolume }: IArticleDetailsSidebarProps): JSX.Element {
  const [openedPublicationDetails, setOpenedPublicationDetails] = useState(true)

  const togglePublicationDetails = (): void => setOpenedPublicationDetails(!openedPublicationDetails)

  const renderSpecialRelatedVolume = (): JSX.Element | null => {
    if (relatedVolume?.types) {
      if (relatedVolume.types.includes(VOLUME_TYPE.PROCEEDINGS)) {
        return <div className='articleDetailsSidebar-volumeDetails-special'>{t('pages.articleDetails.volumeDetails.proceeding')}</div>
      }

      if (relatedVolume.types.includes(VOLUME_TYPE.SPECIAL_ISSUE)) {
        return <div className='articleDetailsSidebar-volumeDetails-special'>{t('pages.articleDetails.volumeDetails.specialIssue')}</div>
      }
    }

    return null
  }

  return (
    <div className='articleDetailsSidebar'>
      <div className='articleDetailsSidebar-links'>
        {article?.pdfLink && (
          <Link to={article?.pdfLink} target='_blank'>
            <div className='articleDetailsSidebar-links-link'>
              <img className='articleDetailsSidebar-links-link-icon' src={download} alt='Download icon' />
              <div className='articleDetailsSidebar-links-link-text'>{t('pages.articleDetails.actions.download')}</div>
            </div>
          </Link>
        )}
        {article?.halLink && (
          <Link to={article?.halLink} target='_blank'>
            <div className='articleDetailsSidebar-links-link'>
              <img className='articleDetailsSidebar-links-link-icon' src={externalLink} alt='External link icon' />
              <div className='articleDetailsSidebar-links-link-text'>{t('pages.articleDetails.actions.openHAL')}</div>
            </div>
          </Link>
        )}
      </div>
      <div className='articleDetailsSidebar-publicationDetails'>
        <div className='articleDetailsSidebar-publicationDetails-title' onClick={(): void => togglePublicationDetails()}>
          <div className='articleDetailsSidebar-publicationDetails-title-text'>{t('pages.articleDetails.publicationDetails.title')}</div>
          {openedPublicationDetails ? (
            <img className='articleDetailsSidebar-publicationDetails-title-text-caret' src={caretUp} alt='Caret up icon' />
          ) : (
            <img className='articleDetailsSidebar-publicationDetails-title-text-caret' src={caretDown} alt='Caret down icon' />
          )}
        </div>
        <div className={`articleDetailsSidebar-publicationDetails-content ${openedPublicationDetails && 'articleDetailsSidebar-publicationDetails-content-opened'}`}>
          <div className='articleDetailsSidebar-publicationDetails-content-row'>
            <div className='articleDetailsSidebar-publicationDetails-content-row-publicationDate'>{t('pages.articleDetails.publicationDetails.publishedOn')}</div>
            <div className='articleDetailsSidebar-publicationDetails-content-row-publicationDate-value'>{formatDate(article?.publicationDate, language)}</div>
          </div>
          {article.acceptanceDate && (
            <div className='articleDetailsSidebar-publicationDetails-content-row'>
              <div>{t('pages.articleDetails.publicationDetails.acceptedOn')}</div>
              <div>{formatDate(article?.acceptanceDate, language)}</div>
            </div>
          )}
          {article.submissionDate && (
            <div className='articleDetailsSidebar-publicationDetails-content-row'>
              <div>{t('pages.articleDetails.publicationDetails.submittedOn')}</div>
              <div>{formatDate(article?.submissionDate, language)}</div>
            </div>
          )}
        </div>
      </div>
      {relatedVolume && (
        <div className='articleDetailsSidebar-volumeDetails'>
          <Link to={`${PATHS.volumes}/${relatedVolume.id}`} className='articleDetailsSidebar-volumeDetails-number'>{t('pages.articleDetails.volumeDetails.title')} {relatedVolume.id}</Link>
          {renderSpecialRelatedVolume()}
          <div className='articleDetailsSidebar-volumeDetails-title'>{relatedVolume.title && relatedVolume.title[language]}</div>
          {article.doi && (
            <div className='articleDetailsSidebar-volumeDetails-doi'>
              <div>DOI</div>
              <div className='articleDetailsSidebar-volumeDetails-doi-content'>{article.doi}</div>
            </div>
          )}
          {/* <div className='articleDetailsSidebar-volumeDetails-licence'>
            <div>Licence</div>
            <div className='articleDetailsSidebar-volumeDetails-licence-content'>CC0 1.0 universel (CC0 1.0) Transfert dans le Domaine Public</div>
          </div> */}
        </div>
      )}
    </div>
  )
}