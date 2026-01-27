import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TFunction } from 'i18next';
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share';
import { isMobileOnly } from 'react-device-detect';

import bluesky from '/icons/bluesky.svg';
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
import whatsapp from '/icons/whatsapp.svg';
import { PATHS } from '../../../../config/paths';
import { IArticle } from '../../../../types/article';
import { IVolume } from '../../../../types/volume';
import {
  ICitation,
  METADATA_TYPE,
  copyToClipboardCitation,
  getLicenseTranslations,
  getMetadataTypes,
} from '../../../../utils/article';
import { formatDate } from '../../../../utils/date';
import { AvailableLanguage } from '../../../../utils/i18n';
import { VOLUME_TYPE } from '../../../../utils/volume';
import './ArticleDetailsSidebar.scss';

interface IArticleDetailsSidebarProps {
  language: AvailableLanguage;
  t: TFunction<'translation', undefined>;
  article?: IArticle;
  relatedVolume?: IVolume;
  citations: ICitation[];
  metrics?: JSX.Element;
}

export default function ArticleDetailsSidebar({
  language,
  t,
  article,
  relatedVolume,
  citations,
  metrics,
}: IArticleDetailsSidebarProps): JSX.Element {
  const navigate = useNavigate();

  const [openedPublicationDetails, setOpenedPublicationDetails] =
    useState(true);
  const [showCitationsDropdown, setShowCitationsDropdown] = useState(false);
  const [showMetadatasDropdown, setShowMetadatasDropdown] = useState(false);
  const [showSharingDropdown, setShowSharingDropdown] = useState(false);
  const [openedFunding, setOpenedFunding] = useState(true);

  const citationsDropdownRef = useRef<HTMLDivElement | null>(null);
  const metadatasDropdownRef = useRef<HTMLDivElement | null>(null);
  const sharingDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleTouchOutsideCitations = (event: TouchEvent): void => {
      if (
        citationsDropdownRef.current &&
        !citationsDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCitationsDropdown(false);
      }
    };

    const handleTouchOutsideMetadatas = (event: TouchEvent): void => {
      if (
        metadatasDropdownRef.current &&
        !metadatasDropdownRef.current.contains(event.target as Node)
      ) {
        setShowMetadatasDropdown(false);
      }
    };

    const handleTouchOutsideSharing = (event: TouchEvent): void => {
      if (
        sharingDropdownRef.current &&
        !sharingDropdownRef.current.contains(event.target as Node)
      ) {
        setShowSharingDropdown(false);
      }
    };

    document.addEventListener('touchstart', handleTouchOutsideCitations);
    document.addEventListener('touchstart', handleTouchOutsideMetadatas);
    document.addEventListener('touchstart', handleTouchOutsideSharing);

    return () => {
      document.removeEventListener('touchstart', handleTouchOutsideCitations);
      document.removeEventListener('touchstart', handleTouchOutsideMetadatas);
      document.removeEventListener('touchstart', handleTouchOutsideSharing);
    };
  }, [citationsDropdownRef, metadatasDropdownRef, sharingDropdownRef]);

  const togglePublicationDetails = (): void =>
    setOpenedPublicationDetails(!openedPublicationDetails);

  const toggleFunding = (): void => setOpenedFunding(!openedFunding);

  const renderRelatedVolume = (relatedVolume?: IVolume): JSX.Element | null => {
    if (!relatedVolume) return null;

    let text = '';

    if (relatedVolume?.types && relatedVolume.types.length > 0) {
      if (relatedVolume.types.includes(VOLUME_TYPE.PROCEEDINGS)) {
        text += t('pages.articleDetails.volumeDetails.proceeding');
      }

      if (relatedVolume.types.includes(VOLUME_TYPE.SPECIAL_ISSUE)) {
        text += t('pages.articleDetails.volumeDetails.specialIssue');
      }
    } else {
      text += t('pages.articleDetails.volumeDetails.title');
    }

    return (
      <Link
        to={`${PATHS.volumes}/${relatedVolume.id}`}
        className="articleDetailsSidebar-volumeDetails-number"
      >
        {text} {relatedVolume.num}
      </Link>
    );
  };

  const renderLicenseContent = (): JSX.Element | null => {
    if (!article) return null;

    const translatedLicense = getLicenseTranslations(t).find(
      lt => lt.value === article.license
    );

    if (!translatedLicense) return null;
    return (
      <div className="articleDetailsSidebar-volumeDetails-license">
        <div>{t('pages.articleDetails.license')}</div>
        {translatedLicense.isLink ? (
          <Link
            to={translatedLicense.value}
            className="articleDetailsSidebar-volumeDetails-license-content articleDetailsSidebar-volumeDetails-license-content-link"
            target="_blank"
          >
            {translatedLicense.label}
          </Link>
        ) : (
          <div className="articleDetailsSidebar-volumeDetails-license-content">
            {translatedLicense.label}
          </div>
        )}
      </div>
    );
  };

  const copyCitation = (citation: ICitation): void => {
    copyToClipboardCitation(citation, t);
    setShowCitationsDropdown(false);
  };

  const navigateToMetadata = (metadata: { type: METADATA_TYPE }): void => {
    navigate(`/${PATHS.articles}/${article?.id}/metadata/${metadata.type}`);
    setShowMetadatasDropdown(false);
  };

  return (
    <div className="articleDetailsSidebar">
      <div className="articleDetailsSidebar-links">
        {article?.pdfLink && (
          <a
            href={`/${PATHS.articles}/${article.id}/download`}
            target="_blank"
            rel="noopener noreferrer"
            className="articleDetailsSidebar-links-link"
          >
            <img
              className="articleDetailsSidebar-links-link-icon"
              src={download}
              alt="Download icon"
            />
            <div className="articleDetailsSidebar-links-link-text">
              {t('pages.articleDetails.actions.download')}
            </div>
          </a>
        )}
        {article?.docLink && (
          <a
            href={article.docLink}
            target="_blank"
            rel="noopener noreferrer"
            className="articleDetailsSidebar-links-link"
          >
            <img
              className="articleDetailsSidebar-links-link-icon"
              src={externalLink}
              alt="External link icon"
            />
            <div className="articleDetailsSidebar-links-link-text">
              {t('pages.articleDetails.actions.openOn')}{' '}
              {article.repositoryName}
            </div>
          </a>
        )}

        {citations.length > 0 && (
          <div
            ref={citationsDropdownRef}
            className="articleDetailsSidebar-links-link articleDetailsSidebar-links-link-modal"
            onMouseEnter={(): void => setShowCitationsDropdown(true)}
            onMouseLeave={(): void => setShowCitationsDropdown(false)}
            onTouchStart={(): void =>
              setShowCitationsDropdown(!showCitationsDropdown)
            }
          >
            <img
              className="articleDetailsSidebar-links-link-icon"
              src={quote}
              alt="Quote icon"
            />
            <div className="articleDetailsSidebar-links-link-text">
              {t('pages.articleDetails.actions.cite')}
            </div>
            <div
              className={`articleDetailsSidebar-links-link-modal-content ${showCitationsDropdown && 'articleDetailsSidebar-links-link-modal-content-displayed'}`}
            >
              <div className="articleDetailsSidebar-links-link-modal-content-links">
                {citations.map((citation, index) => (
                  <div
                    key={index}
                    className="articleDetailsSidebar-links-link-modal-content-links-link"
                    onClick={(): void => copyCitation(citation)}
                    onTouchEnd={(): void => copyCitation(citation)}
                  >
                    {citation.key}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {getMetadataTypes.length > 0 && (
          <div
            ref={metadatasDropdownRef}
            className="articleDetailsSidebar-links-link articleDetailsSidebar-links-link-modal"
            onMouseEnter={(): void => setShowMetadatasDropdown(true)}
            onMouseLeave={(): void => setShowMetadatasDropdown(false)}
            onTouchStart={(): void =>
              setShowMetadatasDropdown(!showMetadatasDropdown)
            }
          >
            <img
              className="articleDetailsSidebar-links-link-icon"
              src={quote}
              alt="Quote icon"
            />
            <div className="articleDetailsSidebar-links-link-text">
              {t('pages.articleDetails.actions.metadata')}
            </div>
            <div
              className={`articleDetailsSidebar-links-link-modal-content ${showMetadatasDropdown && 'articleDetailsSidebar-links-link-modal-content-displayed'}`}
            >
              <div className="articleDetailsSidebar-links-link-modal-content-links">
                {getMetadataTypes.map((metadata, index) => (
                  <div
                    key={index}
                    className="articleDetailsSidebar-links-link-modal-content-links-link"
                    onClick={(): void => navigateToMetadata(metadata)}
                    onTouchEnd={(): void => navigateToMetadata(metadata)}
                  >
                    {metadata.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div
          className="articleDetailsSidebar-links-link articleDetailsSidebar-links-link-modal"
          onMouseEnter={(): void => setShowSharingDropdown(true)}
          onMouseLeave={(): void => setShowSharingDropdown(false)}
          onTouchStart={(): void =>
            setShowSharingDropdown(!showSharingDropdown)
          }
        >
          <img
            className="articleDetailsSidebar-links-link-icon"
            src={share}
            alt="Share icon"
          />
          <div className="articleDetailsSidebar-links-link-text">
            {t('pages.articleDetails.actions.share.text')}
          </div>
          <div
            className={`articleDetailsSidebar-links-link-modal-content ${showSharingDropdown && 'articleDetailsSidebar-links-link-modal-content-displayed'}`}
          >
            <div className="articleDetailsSidebar-links-link-modal-content-links">
              <a
                href={`https://bsky.app/intent/compose?text=${encodeURIComponent((article?.title ? article.title + ' ' : '') + window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                onTouchStart={e => e.stopPropagation()}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="articleDetailsSidebar-links-link-modal-content-links-link">
                  <img src={bluesky} alt="Bluesky icon" />
                  {t('pages.articleDetails.actions.share.bluesky')}
                </div>
              </a>
              <FacebookShareButton
                url={window.location.href}
                title={article?.title}
                onTouchStart={e => e.stopPropagation()}
              >
                <div className="articleDetailsSidebar-links-link-modal-content-links-link">
                  <img src={facebook} alt="Facebook icon" />
                  {t('pages.articleDetails.actions.share.facebook')}
                </div>
              </FacebookShareButton>
              <LinkedinShareButton
                url={window.location.href}
                title={article?.title}
                onTouchStart={e => e.stopPropagation()}
              >
                <div className="articleDetailsSidebar-links-link-modal-content-links-link">
                  <img src={linkedin} alt="Linkedin icon" />
                  {t('pages.articleDetails.actions.share.linkedin')}
                </div>
              </LinkedinShareButton>
              <EmailShareButton
                url={window.location.href}
                subject={article?.title}
                onTouchStart={e => e.stopPropagation()}
              >
                <div className="articleDetailsSidebar-links-link-modal-content-links-link">
                  <img src={mail} alt="Mail icon" />
                  {t('pages.articleDetails.actions.share.email')}
                </div>
              </EmailShareButton>
              <WhatsappShareButton
                url={window.location.href}
                title={article?.title}
                separator=" - "
                onTouchStart={e => e.stopPropagation()}
              >
                <div className="articleDetailsSidebar-links-link-modal-content-links-link">
                  <img src={whatsapp} alt="WhatsApp icon" />
                  {t('pages.articleDetails.actions.share.whatsapp')}
                </div>
              </WhatsappShareButton>
              <TwitterShareButton
                url={window.location.href}
                title={article?.title}
                onTouchStart={e => e.stopPropagation()}
              >
                <div className="articleDetailsSidebar-links-link-modal-content-links-link">
                  <img src={twitter} alt="Twitter icon" />
                  {t('pages.articleDetails.actions.share.twitter')}
                </div>
              </TwitterShareButton>
            </div>
          </div>
        </div>
      </div>
      <div className="articleDetailsSidebar-publicationDetails">
        <div
          className="articleDetailsSidebar-publicationDetails-title"
          onClick={(): void => togglePublicationDetails()}
        >
          <div className="articleDetailsSidebar-publicationDetails-title-text">
            {t('pages.articleDetails.publicationDetails.title')}
          </div>
          {openedPublicationDetails ? (
            <img
              className="articleDetailsSidebar-publicationDetails-title-caret"
              src={caretUp}
              alt="Caret up icon"
            />
          ) : (
            <img
              className="articleDetailsSidebar-publicationDetails-title-caret"
              src={caretDown}
              alt="Caret down icon"
            />
          )}
        </div>
        <div
          className={`articleDetailsSidebar-publicationDetails-content ${openedPublicationDetails && 'articleDetailsSidebar-publicationDetails-content-opened'}`}
        >
          {article?.publicationDate && (
            <div className="articleDetailsSidebar-publicationDetails-content-row">
              <div className="articleDetailsSidebar-publicationDetails-content-row-publicationDate">
                {t('pages.articleDetails.publicationDetails.publishedOn')}
              </div>
              <div className="articleDetailsSidebar-publicationDetails-content-row-publicationDate-value">
                {formatDate(article?.publicationDate, language)}
              </div>
            </div>
          )}

          {article?.acceptanceDate &&
            (article?.isImported === undefined ||
              article?.isImported === false) && (
              <div className="articleDetailsSidebar-publicationDetails-content-row">
                <div>
                  {t('pages.articleDetails.publicationDetails.acceptedOn')}
                </div>
                <div>{formatDate(article?.acceptanceDate, language)}</div>
              </div>
            )}

          {article?.submissionDate && (
            <div className="articleDetailsSidebar-publicationDetails-content-row">
              <div>
                <div>
                  {article?.isImported === true
                    ? t('pages.articleDetails.publicationDetails.importedOn')
                    : t('pages.articleDetails.publicationDetails.submittedOn')}
                </div>
              </div>
              <div>{formatDate(article?.submissionDate, language)}</div>
            </div>
          )}
        </div>
      </div>
      <div className="articleDetailsSidebar-volumeDetails">
        {relatedVolume && (
          <>
            {renderRelatedVolume(relatedVolume)}
            <div className="articleDetailsSidebar-volumeDetails-title">
              {relatedVolume.title && relatedVolume.title[language]}
            </div>
            {article?.doi && (
              <div className="articleDetailsSidebar-volumeDetails-doi">
                <div>{t('common.doi')}</div>
                <Link
                  to={`${import.meta.env.VITE_DOI_HOMEPAGE}/${article.doi}`}
                  className="articleDetailsSidebar-volumeDetails-doi-content"
                  target="_blank"
                >
                  {article.doi}
                </Link>
              </div>
            )}
          </>
        )}
        {article?.license && renderLicenseContent()}
      </div>
      {article?.fundings && article.fundings.length > 0 && (
        <div className="articleDetailsSidebar-funding">
          <div
            className="articleDetailsSidebar-funding-title"
            onClick={(): void => toggleFunding()}
          >
            <div className="articleDetailsSidebar-funding-title-text">
              {t('pages.articleDetails.funding')}
            </div>
            {openedFunding ? (
              <img
                className="articleDetailsSidebar-funding-title-text-caret"
                src={caretUp}
                alt="Caret up icon"
              />
            ) : (
              <img
                className="articleDetailsSidebar-funding-title-text-caret"
                src={caretDown}
                alt="Caret down icon"
              />
            )}
          </div>
          <div
            className={`articleDetailsSidebar-funding-content ${openedFunding && 'articleDetailsSidebar-funding-content-opened'}`}
          >
            {article.fundings.map((funding, index) => (
              <div
                key={index}
                className="articleDetailsSidebar-funding-content-row"
              >
                {funding}
              </div>
            ))}
          </div>
        </div>
      )}
      {!isMobileOnly && metrics}
    </div>
  );
}
