import { Link } from 'react-router-dom'
import { TFunction } from 'i18next';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import download from '/icons/download-blue.svg';
import { PATHS } from '../../../../config/paths';
import { IArticle } from '../../../../types/article';
import { IJournal } from '../../../../types/journal';
import { IVolume, IVolumeMetadata } from '../../../../types/volume';
import { AvailableLanguage } from '../../../../utils/i18n';
import { VOLUME_TYPE } from '../../../../utils/volume';
import './VolumeDetailsSidebar.scss'

interface IVolumeDetailsSidebarProps {
  language: AvailableLanguage
  t: TFunction<"translation", undefined>
  volume?: IVolume;
  articles: IArticle[];
  currentJournal?: IJournal;
  relatedVolumes: IVolume[];
}

export default function VolumeDetailsSidebar({ language, t, volume, articles, currentJournal, relatedVolumes }: IVolumeDetailsSidebarProps): JSX.Element {
  const NOT_RENDERED_SIDEBAR_METADATAS = ['tile', 'edito'];

  const renderMetadatas = (): IVolumeMetadata[] => {
    if (!volume?.metadatas || !volume.metadatas.length) return [];

    return volume.metadatas.filter((metadata) => metadata.file && metadata.title && metadata.title[language] && !NOT_RENDERED_SIDEBAR_METADATAS.includes(metadata.title[language].toLowerCase()))
  }

  const downloadAllArticles = async (openTab: boolean): Promise<void> => {
    if (!volume || !articles.length) return;

    if (openTab) {
      articles.forEach((article) => {
        window.open(article.pdfLink, '_blank')
      })

      return;
    }

    const folderName = `Volume_${volume.num}`;

    const zip = new JSZip();
    const folder = zip.folder(folderName);

    const pdfDownloads = articles.map(async (article) => {
      const response = await fetch(article.pdfLink);
      const blob = await response.blob();
      const fileName = article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      folder?.file(`${fileName}.pdf`, blob);
    });

    await Promise.all(pdfDownloads);

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${folderName}.zip`);
  };

  const renderVolumeTemplateSpecial = (): JSX.Element => {
    if (volume?.types && volume.types.length) {
      if (volume.types.includes(VOLUME_TYPE.PROCEEDINGS)) {
        return <div className="volumeDetailsSidebar-template-volume">{t('common.volumeCard.proceeding')}</div>
      } else if (volume.types.includes(VOLUME_TYPE.SPECIAL_ISSUE)) {
        return (
          <>
            <div className="volumeDetailsSidebar-template-volume">{t('common.volumeCard.volume')}</div>
            <div className="volumeDetailsSidebar-template-volume">{t('common.volumeCard.specialIssue')}</div>
          </>
        )
      }
    }

    return <div className="volumeDetailsSidebar-template-volume">{t('common.volumeCard.volume')}</div>
  }

  const renderRelatedVolumesTitle = (): string => {
    if (volume?.types && volume.types.length) {
      if (volume.types.includes(VOLUME_TYPE.PROCEEDINGS)) {
        return t('pages.volumeDetails.relatedVolumes.proceedings')
      }

      if (volume.types.includes(VOLUME_TYPE.SPECIAL_ISSUE)) {
        return t('pages.volumeDetails.relatedVolumes.specialIssues')
      }
    }

    return t('pages.volumeDetails.relatedVolumes.volumes')
  }

  return (
    <div className="volumeDetailsSidebar">
      {volume?.tileImageURL ? (
        <img className='volumeDetailsSidebar-tile' src={volume.tileImageURL} alt='Volume tile' />
      ) : (
        <div className="volumeDetailsSidebar-template">
          <div className="volumeDetailsSidebar-template-jpe">{currentJournal?.code.toUpperCase()}</div>
          {renderVolumeTemplateSpecial()}
          <div className="volumeDetailsSidebar-template-number">{volume?.num}</div>
          <div className="volumeDetailsSidebar-template-year">{volume?.year}</div>
        </div>
      )}
      <div className='volumeDetailsSidebar-count'>
        {articles.length > 1 ? `${articles.length} ${t('common.articles')}` : `${articles.length} ${t('common.article')}`}
      </div>
      <div className='volumeDetailsSidebar-actions'>
        {articles.length > 0 && (
          <div className='volumeDetailsSidebar-actions-action' onClick={(): Promise<void> => downloadAllArticles(true)}>
            <img src={download} alt='Download icon' />
            <span className='volumeDetailsSidebar-actions-action-text'>{t('pages.volumeDetails.actions.downloadAll')}</span>
          </div>
        )}
        {renderMetadatas().map((metadata, index) => (
          <Link key={index} className='volumeDetailsSidebar-actions-action' to={`https://${currentJournal?.code}.episciences.org/public/volumes/${volume?.id}/${metadata.file}`} target='_blank'>
            <img src={download} alt='Download icon' />
            <span className='volumeDetailsSidebar-actions-action-text'>{metadata.title && metadata.title[language]}</span>
          </Link>
        ))}
      </div>
      {relatedVolumes.length > 0 && (
        <div className='volumeDetailsSidebar-relatedVolumes'>
          <div className='volumeDetailsSidebar-relatedVolumes-title'>{renderRelatedVolumesTitle()}</div>
          <div className='volumeDetailsSidebar-relatedVolumes-volumes'>
            <div className='volumeDetailsSidebar-relatedVolumes-volumes-list'>
              {relatedVolumes.map((relatedVolume, index) => (
                <Link
                  key={index}
                  to={`${PATHS.volumes}/${relatedVolume.id}`}
                  className={`volumeDetailsSidebar-relatedVolumes-volumes-list-volume ${relatedVolume.id === volume?.id && 'volumeDetailsSidebar-relatedVolumes-volumes-list-volume-current'}`}
                >
                  {relatedVolume.title ? relatedVolume.title[language] : ''}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}