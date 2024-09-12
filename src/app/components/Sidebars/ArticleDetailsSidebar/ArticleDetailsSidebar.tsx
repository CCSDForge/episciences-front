import { useState } from 'react';
import { Link } from 'react-router-dom'
import { TFunction } from 'i18next';
import { EmailShareButton, FacebookShareButton, LinkedinShareButton, TwitterShareButton } from 'react-share'

import caretUp from '/icons/caret-up-grey.svg';
import caretDown from '/icons/caret-down-grey.svg';
import download from '/icons/download-black.svg';
import externalLink from '/icons/external-link-black.svg';
import facebook from '/icons/facebook.svg';
import linkedin from '/icons/linkedin.svg';
import mail from '/icons/mail.svg';
import quote from '/icons/quote-black.svg';
import share from '/icons/share.svg';
import twitter from '/icons/twitter.svg';
import { PATHS } from '../../../../config/paths';
import { IArticle } from '../../../../types/article';
import { IVolume } from '../../../../types/volume';
import { ICitation, copyToClipboardCitation, getLicenseTranslations, getMetadataTypes } from '../../../../utils/article';
import { formatDate } from '../../../../utils/date';
import { AvailableLanguage } from '../../../../utils/i18n';
import { VOLUME_TYPE } from '../../../../utils/volume';
import './ArticleDetailsSidebar.scss'

interface IArticleDetailsSidebarProps {
  language: AvailableLanguage;
  t: TFunction<"translation", undefined>;
  article?: IArticle;
  relatedVolume?: IVolume;
  citations: ICitation[];
}

export default function ArticleDetailsSidebar({ language, t, article, relatedVolume, citations }: IArticleDetailsSidebarProps): JSX.Element {
  const [openedPublicationDetails, setOpenedPublicationDetails] = useState(true)
  const [showCitationsDropdown, setShowCitationsDropdown] = useState(false)
  const [showMetadatasDropdown, setShowMetadatasDropdown] = useState(false)
  const [showSharingDropdown, setShowSharingDropdown] = useState(false)
  const [openedFunding, setOpenedFunding] = useState(true)

  const togglePublicationDetails = (): void => setOpenedPublicationDetails(!openedPublicationDetails)

  const toggleFunding = (): void => setOpenedFunding(!openedFunding)

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

  const renderLicenseContent = (): JSX.Element | null => {
    if (!article) return null;

    const translatedLicense = getLicenseTranslations(t).find(lt => lt.value === article.license)

    if (!translatedLicense) return null
    return (
      <div className='articleDetailsSidebar-volumeDetails-license'>
        <div>{t('pages.articleDetails.license')}</div>
        {translatedLicense.isLink ? (
          <Link to={translatedLicense.value} className='articleDetailsSidebar-volumeDetails-license-content articleDetailsSidebar-volumeDetails-license-content-link' target='_blank'>{translatedLicense.label}</Link>
        ) : (
          <div className='articleDetailsSidebar-volumeDetails-license-content'>{translatedLicense.label}</div>
        )}
      </div>
    )
  }

  return (
    <div className='articleDetailsSidebar'>
      <div className='articleDetailsSidebar-links'>
        {article?.pdfLink && (
          <Link to={`/${PATHS.articles}/${article.id}/download`}>
            <div className='articleDetailsSidebar-links-link'>
              <img className='articleDetailsSidebar-links-link-icon' src={download} alt='Download icon' />
              <div className='articleDetailsSidebar-links-link-text'>{t('pages.articleDetails.actions.download')}</div>
            </div>
          </Link>
        )}
        {article?.docLink && (
          <Link to={`/${PATHS.articles}/${article.id}/notice`}>
            <div className='articleDetailsSidebar-links-link'>
              <img className='articleDetailsSidebar-links-link-icon' src={externalLink} alt='External link icon' />
              <div className='articleDetailsSidebar-links-link-text'>{t('pages.articleDetails.actions.openOn')} {article.repositoryName}</div>
            </div>
          </Link>
        )}
        {citations.length > 0 && (
          <div className='articleDetailsSidebar-links-link articleDetailsSidebar-links-link-modal' onMouseEnter={(): void => setShowCitationsDropdown(true)}>
            <img className='articleDetailsSidebar-links-link-icon' src={quote} alt='Quote icon' />
            <div className='articleDetailsSidebar-links-link-text'>{t('pages.articleDetails.actions.cite')}</div>
            {showCitationsDropdown && (
                <div className='articleDetailsSidebar-links-link-modal-content' onMouseLeave={(): void => setShowCitationsDropdown(false)}>
                  <div className='articleDetailsSidebar-links-link-modal-content-links'>
                    {citations.map((citation, index) => (
                      <div className='articleDetailsSidebar-links-link-modal-content-links-link' key={index} onClick={(): void => {
                        copyToClipboardCitation(citation, t)
                        setShowCitationsDropdown(false)
                      }}>{citation.key}</div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
        {getMetadataTypes.length > 0 && (
          <div className='articleDetailsSidebar-links-link articleDetailsSidebar-links-link-modal' onMouseEnter={(): void => setShowMetadatasDropdown(true)}>
            <img className='articleDetailsSidebar-links-link-icon' src={quote} alt='Quote icon' />
            <div className='articleDetailsSidebar-links-link-text'>{t('pages.articleDetails.actions.metadata')}</div>
            {showMetadatasDropdown && (
                <div className='articleDetailsSidebar-links-link-modal-content' onMouseLeave={(): void => setShowMetadatasDropdown(false)}>
                  <div className='articleDetailsSidebar-links-link-modal-content-links'>
                    {getMetadataTypes.map((metadata, index) => (
                      <Link to={`/${PATHS.articles}/${article?.id}/metadata/${metadata.type}`} target='_blank' className='articleDetailsSidebar-links-link-modal-content-links-link' key={index} onClick={(): void => setShowMetadatasDropdown(false)}>{metadata.label}</Link>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
        <div className='articleDetailsSidebar-links-link articleDetailsSidebar-links-link-modal' onMouseEnter={(): void => setShowSharingDropdown(true)}>
          <img className='articleDetailsSidebar-links-link-icon' src={share} alt='Share icon' />
          <div className='articleDetailsSidebar-links-link-text'>{t('pages.articleDetails.actions.share.text')}</div>
          {showSharingDropdown && (
            <div className='articleDetailsSidebar-links-link-modal-content' onMouseLeave={(): void => setShowSharingDropdown(false)}>
              <div className='articleDetailsSidebar-links-link-modal-content-links'>
                <EmailShareButton url={window.location.href} subject={article?.title}>
                  <div className='articleDetailsSidebar-links-link-modal-content-links-link'>
                    <img src={mail} alt='Mail icon' />
                    {t('pages.articleDetails.actions.share.email')}
                  </div>
                </EmailShareButton>
                <TwitterShareButton url={window.location.href} title={article?.title}>
                  <div className='articleDetailsSidebar-links-link-modal-content-links-link'>
                    <img src={twitter} alt='Twitter icon' />
                    {t('pages.articleDetails.actions.share.twitter')}
                  </div>
                </TwitterShareButton>
                <LinkedinShareButton url={window.location.href} title={article?.title}>
                  <div className='articleDetailsSidebar-links-link-modal-content-links-link'>
                    <img src={linkedin} alt='Linkedin icon' />
                    {t('pages.articleDetails.actions.share.linkedin')}
                  </div>
                </LinkedinShareButton>
                <FacebookShareButton url={window.location.href} title={article?.title}>
                  <div className='articleDetailsSidebar-links-link-modal-content-links-link'>
                    <img src={facebook} alt='Facebook icon' />
                    {t('pages.articleDetails.actions.share.facebook')}
                  </div>
                </FacebookShareButton>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='articleDetailsSidebar-publicationDetails'>
        <div className='articleDetailsSidebar-publicationDetails-title' onClick={(): void => togglePublicationDetails()}>
          <div className='articleDetailsSidebar-publicationDetails-title-text'>{t('pages.articleDetails.publicationDetails.title')}</div>
          {openedPublicationDetails ? (
            <img className='articleDetailsSidebar-publicationDetails-title-caret' src={caretUp} alt='Caret up icon' />
          ) : (
            <img className='articleDetailsSidebar-publicationDetails-title-caret' src={caretDown} alt='Caret down icon' />
          )}
        </div>
        <div className={`articleDetailsSidebar-publicationDetails-content ${openedPublicationDetails && 'articleDetailsSidebar-publicationDetails-content-opened'}`}>
          {article?.publicationDate && (
            <div className='articleDetailsSidebar-publicationDetails-content-row'>
              <div className='articleDetailsSidebar-publicationDetails-content-row-publicationDate'>{t('pages.articleDetails.publicationDetails.publishedOn')}</div>
              <div className='articleDetailsSidebar-publicationDetails-content-row-publicationDate-value'>{formatDate(article?.publicationDate, language)}</div>
            </div>
          )}
          {article?.acceptanceDate && (
            <div className='articleDetailsSidebar-publicationDetails-content-row'>
              <div>{t('pages.articleDetails.publicationDetails.acceptedOn')}</div>
              <div>{formatDate(article?.acceptanceDate, language)}</div>
            </div>
          )}
          {article?.submissionDate && (
            <div className='articleDetailsSidebar-publicationDetails-content-row'>
              <div>{t('pages.articleDetails.publicationDetails.submittedOn')}</div>
              <div>{formatDate(article?.submissionDate, language)}</div>
            </div>
          )}
        </div>
      </div>
        <div className='articleDetailsSidebar-volumeDetails'>
          {relatedVolume && (
            <>
              <Link to={`${PATHS.volumes}/${relatedVolume.id}`} className='articleDetailsSidebar-volumeDetails-number'>{t('pages.articleDetails.volumeDetails.title')} {relatedVolume.num}</Link>
              {renderSpecialRelatedVolume()}
              <div className='articleDetailsSidebar-volumeDetails-title'>{relatedVolume.title && relatedVolume.title[language]}</div>
              {article?.doi && (
                <div className='articleDetailsSidebar-volumeDetails-doi'>
                  <div>{t('common.doi')}</div>
                  <Link to={`${import.meta.env.VITE_DOI_HOMEPAGE}/${article.doi}`} className='articleDetailsSidebar-volumeDetails-doi-content' target='_blank'>{article.doi}</Link>
                </div>
              )}
            </>
          )}
          {article?.license && renderLicenseContent()}
        </div>
      {article?.fundings && article.fundings.length > 0 && (
        <div className='articleDetailsSidebar-funding'>
          <div className='articleDetailsSidebar-funding-title' onClick={(): void => toggleFunding()}>
            <div className='articleDetailsSidebar-funding-title-text'>{t('pages.articleDetails.funding')}</div>
            {openedFunding ? (
              <img className='articleDetailsSidebar-funding-title-text-caret' src={caretUp} alt='Caret up icon' />
            ) : (
              <img className='articleDetailsSidebar-funding-title-text-caret' src={caretDown} alt='Caret down icon' />
            )}
          </div>
          <div className={`articleDetailsSidebar-funding-content ${openedFunding && 'articleDetailsSidebar-funding-content-opened'}`}>
            {article.fundings.map((funding, index) => (
              <div key={index} className='articleDetailsSidebar-funding-content-row'>{funding}</div>
            ))}
          </div>
        </div>
      )}
      {article?.metrics && (article.metrics.views > 0 || article.metrics.downloads > 0) && (
        <div className='articleDetailsSidebar-metrics'>
          <div className='articleDetailsSidebar-metrics-title'>{t('pages.articleDetails.metrics.title')}</div>
          <div className='articleDetailsSidebar-metrics-data'>
            <div className='articleDetailsSidebar-metrics-data-row'>
              <div className='articleDetailsSidebar-metrics-data-row-number'>{article.metrics.views}</div>
              <div className='articleDetailsSidebar-metrics-data-row-text'>{t('pages.articleDetails.metrics.views')}</div>
            </div>
            <div className='articleDetailsSidebar-metrics-data-divider'></div>
            <div className='articleDetailsSidebar-metrics-data-row'>
              <div className='articleDetailsSidebar-metrics-data-row-number'>{article.metrics.downloads}</div>
              <div className='articleDetailsSidebar-metrics-data-row-text'>{t('pages.articleDetails.metrics.downloads')}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}