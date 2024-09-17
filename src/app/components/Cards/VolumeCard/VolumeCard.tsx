import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TFunction } from 'i18next';
import ReactMarkdown from 'react-markdown';

import caretUp from '/icons/caret-up-red.svg';
import caretDown from '/icons/caret-down-red.svg';
import download from '/icons/download-red.svg';
import file from '/icons/file-grey.svg';
import { PATHS } from '../../../../config/paths';
import { IJournal } from '../../../../types/journal';
import { IVolume } from "../../../../types/volume";
import { RENDERING_MODE } from '../../../../utils/card';
import { AvailableLanguage } from '../../../../utils/i18n';
import { VOLUME_TYPE } from '../../../../utils/volume';
import './VolumeCard.scss'

interface IVolumeCardProps {
  language: AvailableLanguage;
  t: TFunction<"translation", undefined>
  mode: RENDERING_MODE;
  volume: IVolume;
  currentJournal?: IJournal;
}

export default function VolumeCard({ language, t, mode, volume, currentJournal }: IVolumeCardProps): JSX.Element {
  const [openedDescription, setOpenedDescription] = useState(false)
  const toggleDescription = (): void => setOpenedDescription(!openedDescription)

  const renderVolumeTileSpecial = (): JSX.Element => {
    let text = `${t('common.volumeCard.volume')} ${volume.num}`

    if (volume.types && volume.types.length) {
      if (volume.types.includes(VOLUME_TYPE.SPECIAL_ISSUE) && volume.types.includes(VOLUME_TYPE.PROCEEDINGS)) {
        text += ` - ${t('common.volumeCard.specialIssue')}, ${t('common.volumeCard.proceeding')}`
      } else if (volume.types.includes(VOLUME_TYPE.SPECIAL_ISSUE)) {
        text += ` - ${t('common.volumeCard.specialIssue')}`
      } else if (volume.types.includes(VOLUME_TYPE.PROCEEDINGS)) {
        text += ` - ${t('common.volumeCard.proceeding')}`
      }
    }

    return (
      <Link to={`${PATHS.volumes}/${volume.id}`}>
        <div className='volumeCard-tile-text-volume'>{text}</div>
      </Link>
    )
  }

  const renderVolumeListSpecial = (): JSX.Element | null => {
    let text = ''

    if (volume.types && volume.types.length) {
      if (volume.types.includes(VOLUME_TYPE.SPECIAL_ISSUE) && volume.types.includes(VOLUME_TYPE.PROCEEDINGS)) {
        text += `${t('common.volumeCard.specialIssue')}, ${t('common.volumeCard.proceeding')}`
      } else if (volume.types.includes(VOLUME_TYPE.SPECIAL_ISSUE)) {
        text += `${t('common.volumeCard.specialIssue')}`
      } else if (volume.types.includes(VOLUME_TYPE.PROCEEDINGS)) {
        text += `${t('common.volumeCard.proceeding')}`
      }
    }

    return text ? <div className='volumeCard-content-special'>{text}</div> : null
  }


  if (mode === RENDERING_MODE.TILE) {
    return (
      <div className='volumeCard volumeCard-tile'>
        {volume.tileImageURL ? (
          <img className='volumeCard-tile-img' src={volume.tileImageURL} alt='Volume tile' />
        ) : (
          <div className="volumeCard-tile-template">
            <div className="volumeCard-tile-template-jpe">{currentJournal?.code.toUpperCase()}</div>
            <div className="volumeCard-tile-template-volume">{t('common.volumeCard.volume')}</div>
            {volume.types && volume.types.includes(VOLUME_TYPE.SPECIAL_ISSUE) && (
              <div className="volumeCard-tile-template-issue">{t('common.volumeCard.specialIssue')}</div>
            )}
            <div className="volumeCard-tile-template-number">{volume.num}</div>
            <div className="volumeCard-tile-template-year">{volume.year}</div>
          </div>
        )}
        <div className="volumeCard-tile-text">
          {renderVolumeTileSpecial()}
          <Link to={`${PATHS.volumes}/${volume.id}`}>
            <div className="volumeCard-tile-text-title">{volume.title ? volume.title[language] : ''}</div>
          </Link>
          <div className="volumeCard-tile-text-year">{volume.year}</div>
          <div className="volumeCard-tile-text-count">
            <img className="volumeCard-tile-text-count-icon" src={file} alt='File icon' />
            <div className="volumeCard-tile-text-count-text">{volume.articles.length > 1 ? `${volume.articles.length} ${t('common.articles')}`: `${volume.articles.length} ${t('common.article')}`}</div>
          </div>
          <Link to={volume.downloadLink} target='_blank' className="volumeCard-tile-text-download">
            <img className="volumeCard-tile-text-download-icon" src={download} alt='Download icon' />
            <div className="volumeCard-tile-text-download-text">{t('common.pdf')}</div>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='volumeCard'>
      <div className='volumeCard-resume'>
        <Link to={`${PATHS.volumes}/${volume.id}`}>
          <div className='volumeCard-resume-id'>{`${t('common.volumeCard.volume')} ${volume.num}`}</div>
        </Link>
        {volume.year && <div className='volumeCard-resume-year'>{volume.year}</div>}
        <div className='volumeCard-resume-count'>
          <img className='volumeCard-resume-count-icon' src={file} alt='File icon' />
          <span className='volumeCard-resume-count-text'>{volume.articles.length > 1 ? `${volume.articles.length} ${t('common.articles')}`: `${volume.articles.length} ${t('common.article')}`}</span>
        </div>
      </div>
      <div className='volumeCard-content'>
        {renderVolumeListSpecial()}
        <Link to={`${PATHS.volumes}/${volume.id}`}>
          <div className='volumeCard-content-title'>{volume.title ? volume.title[language] : ''}</div>
        </Link>
        {volume.committee && volume.committee.length > 0 && <div className='volumeCard-content-committee'>{volume.committee.map((member) => member.screenName).join(', ')}</div>}
        {volume.description && volume.description[language] && (
          <div className='volumeCard-content-description'>
            <div className={`volumeCard-content-description-title ${!openedDescription && 'volumeCard-content-description-title'}`} onClick={toggleDescription}>
              <div className='volumeCard-content-description-title-text'>{t('common.about')}</div>
              {openedDescription ? (
                <img className='volumeCard-content-description-title-caret' src={caretUp} alt='Caret up icon' />
              ) : (
                <img className='volumeCard-content-description-title-caret' src={caretDown} alt='Caret down icon' />
              )}
            </div>
            <div className={`volumeCard-content-description-content ${openedDescription && 'volumeCard-content-description-content-opened'}`}>
              <ReactMarkdown>{volume.description[language]}</ReactMarkdown>
            </div>
          </div>
        )}
        <Link to={volume.downloadLink} target='_blank' className="volumeCard-content-download">
          <img className="volumeCard-content-download-icon" src={download} alt='Download icon' />
          <div className="volumeCard-content-download-text">{t('common.pdf')}</div>
        </Link>
      </div>
    </div>
  )
}