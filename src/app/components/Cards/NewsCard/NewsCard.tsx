import { MouseEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TFunction } from 'i18next';

import externalLink from '/icons/external-link-red.svg';
import { INews } from '../../../../types/news';
import { formatDate } from '../../../../utils/date';
import { RENDERING_MODE } from '../../../../utils/card';
import { AvailableLanguage, getLocalizedContent } from '../../../../utils/i18n';
import { generateIdFromText } from '../../../../utils/markdown';
import './NewsCard.scss';

const MAX_CONTENT_LENGTH = 400;

interface INewsCardTile {
  fullCard: boolean;
  blurCard: boolean;
  setFullNewsIndexCallback: () => void;
}

interface INewsCardProps extends INewsCardTile {
  language: AvailableLanguage;
  t: TFunction<'translation', undefined>;
  mode: RENDERING_MODE;
  news: INews;
}

export default function NewsCard({
  language,
  t,
  mode,
  fullCard,
  blurCard,
  setFullNewsIndexCallback,
  news,
}: INewsCardProps): JSX.Element {
  const [showFullContent, setShowFullContent] = useState(false);

  const toggleFullContent = (e: MouseEvent): void => {
    e.stopPropagation();
    setShowFullContent(!showFullContent);
  };

  const renderContent = (): JSX.Element | null => {
    const localizedContent = getLocalizedContent(news.content, language);
    if (!localizedContent) return null;

    if (localizedContent.length <= MAX_CONTENT_LENGTH) {
      return <ReactMarkdown remarkPlugins={[remarkGfm]}>{localizedContent}</ReactMarkdown>;
    }

    return (
      <div className="newsCard-content-content">
        {showFullContent ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{localizedContent}</ReactMarkdown>
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{`${localizedContent.substring(0, MAX_CONTENT_LENGTH)}...`}</ReactMarkdown>
        )}
        <div
          onClick={(e): void => toggleFullContent(e)}
          className="newsCard-content-content-toggle"
        >
          {showFullContent ? t('common.readLess') : t('common.readMore')}
        </div>
      </div>
    );
  };

  const cardId = (): string => generateIdFromText(news.id.toString());

  if (mode === RENDERING_MODE.TILE) {
    if (fullCard) {
      return (
        <div
          id={cardId()}
          className="newsCard newsCard-tile newsCard-tile-full"
          onClick={setFullNewsIndexCallback}
        >
          <div className="newsCard-tile-full-initial">
            <div className="newsCard-content newsCard-content-tile-full">
              <div className="newsCard-content-title newsCard-content-title-tile">
                {getLocalizedContent(news.title, language) ?? ''}
              </div>
              <div className="newsCard-tile-anchor">
                <div className="newsCard-publicationDate newsCard-publicationDate-tile">
                  {formatDate(news.publicationDate, language)}
                </div>
              </div>
            </div>
          </div>
          <div className="newsCard-tile-full-expanded">
            {renderContent()}
            {news.link && (
              <div className="newsCard-content-read newsCard-content-read-full">
                <Link
                  to={news.link}
                  target="_blank"
                  onClick={e => e.stopPropagation()}
                >
                  <img src={externalLink} alt="External link icon" />
                  <div className="newsCard-content-read-text">
                    {t('common.read')}
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        id={cardId()}
        className={
          blurCard
            ? 'newsCard newsCard-tile newsCard-tile-blur'
            : 'newsCard newsCard-tile'
        }
        onClick={setFullNewsIndexCallback}
      >
        <div className="newsCard-content newsCard-content-tile">
          <div className="newsCard-content-title newsCard-content-title-tile">
            {getLocalizedContent(news.title, language) ?? ''}
          </div>
          <div className="newsCard-tile-anchor">
            <div className="newsCard-publicationDate newsCard-publicationDate-tile">
              {formatDate(news.publicationDate, language)}
            </div>
            {news.link && (
              <div className="newsCard-content-read">
                <Link
                  to={news.link}
                  target="_blank"
                  onClick={e => e.stopPropagation()}
                >
                  <img src={externalLink} alt="External link icon" />
                  <div className="newsCard-content-read-text">
                    {t('common.read')}
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id={cardId()} className="newsCard">
      <div className="newsCard-publicationDate">
        {formatDate(news.publicationDate, language)}
      </div>
      <div className="newsCard-content">
        <div className="newsCard-content-title">{getLocalizedContent(news.title, language) ?? ''}</div>
        {renderContent()}
        {news.link && (
          <div className="newsCard-content-read">
            <Link
              to={news.link}
              target="_blank"
              onClick={e => e.stopPropagation()}
            >
              <img src={externalLink} alt="External link icon" />
              <div className="newsCard-content-read-text">
                {t('common.read')}
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
