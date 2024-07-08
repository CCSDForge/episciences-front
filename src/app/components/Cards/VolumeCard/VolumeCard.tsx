import { useState } from 'react';
import { Link } from 'react-router-dom';

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
  mode: RENDERING_MODE;
  volume: IVolume;
  currentJournal?: IJournal;
}

export default function VolumeCard({ language, mode, volume, currentJournal }: IVolumeCardProps): JSX.Element {
  const renderVolumeTileSpecial = (): JSX.Element => {
    let text = `Volume ${volume.num}`

    if (volume.types && volume.types.length) {
      if (volume.types.includes(VOLUME_TYPE.SPECIAL_ISSUE) && volume.types.includes(VOLUME_TYPE.PROCEEDINGS)) {
        text += ` - Special issue, Proceeding`
      } else if (volume.types.includes(VOLUME_TYPE.SPECIAL_ISSUE)) {
        text += ` - Special issue`
      } else if (volume.types.includes(VOLUME_TYPE.PROCEEDINGS)) {
        text += ` - Proceeding`
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
        text += `Special issue, Proceeding`
      } else if (volume.types.includes(VOLUME_TYPE.SPECIAL_ISSUE)) {
        text += `Special issue`
      } else if (volume.types.includes(VOLUME_TYPE.PROCEEDINGS)) {
        text += `Proceeding`
      }
    }

    return text ? <div className='volumeCard-content-special'>{text}</div> : null
  }


  if (mode === RENDERING_MODE.TILE) {
    return (
      <div className='volumeCard volumeCard-tile'>
        <div className="volumeCard-tile-template">
            <div className="volumeCard-tile-template-jpe">{currentJournal?.code.toUpperCase()}</div>
            <div className="volumeCard-tile-template-volume">Volume</div>
            {volume.types && volume.types.includes(VOLUME_TYPE.SPECIAL_ISSUE) && (
              <div className="volumeCard-tile-template-issue">Special Issue</div>
            )}
            <div className="volumeCard-tile-template-number">{volume.num}</div>
            <div className="volumeCard-tile-template-year">{volume.year}</div>
          </div>
          <div className="volumeCard-tile-text">
            {renderVolumeTileSpecial()}
            <div className="volumeCard-tile-text-title">{volume.title ? volume.title[language] : ''}</div>
            <div className="volumeCard-tile-text-year">{volume.year}</div>
            <div className="volumeCard-tile-text-count">
              <img className="volumeCard-tile-text-count-icon" src={file} alt='File icon' />
              <div className="volumeCard-tile-text-count-text">{volume.articles.length > 1 ? `${volume.articles.length} articles`: `${volume.articles.length} article`}</div>
            </div>
            <Link to={volume.downloadLink} target='_blank' className="volumeCard-tile-text-download">
              <img className="volumeCard-tile-text-download-icon" src={download} alt='Download icon' />
              <div className="volumeCard-tile-text-download-text">PDF</div>
            </Link>
          </div>
      </div>
    )
  }

  const [openedDescription, setOpenedDescription] = useState(false)
  const toggleDescription = (): void => setOpenedDescription(!openedDescription)

  return (
    <div className='volumeCard'>
      <div className='volumeCard-resume'>
        <Link to={`${PATHS.volumes}/${volume.id}`}>
          <div className='volumeCard-resume-id'>{`Volume ${volume.num}`}</div>
        </Link>
        <div className='volumeCard-resume-year'>{volume.year}</div>
        <div className='volumeCard-resume-count'>
          <img className='volumeCard-resume-count-icon' src={file} alt='File icon' />
          <span className='volumeCard-resume-count-text'>{volume.articles.length > 1 ? `${volume.articles.length} articles`: `${volume.articles.length} article`}</span>
        </div>
      </div>
      <div className='volumeCard-content'>
        {renderVolumeListSpecial()}
        <div className='volumeCard-content-title'>{volume.title ? volume.title[language] : ''}</div>
        {volume.committee && volume.committee.length > 0 && <div className='volumeCard-content-committee'>{volume.committee.map((member) => member.screenName).join(', ')}</div>}
        {volume.description && volume.description[language] && (
          <div className='volumeCard-content-description'>
            <div className={`volumeCard-content-description-title ${!openedDescription && 'volumeCard-content-description-title'}`} onClick={toggleDescription}>
              <div className='volumeCard-content-description-title-text'>About</div>
              {openedDescription ? (
                <img className='volumeCard-content-description-title-caret' src={caretUp} alt='Caret up icon' />
              ) : (
                <img className='volumeCard-content-description-title-caret' src={caretDown} alt='Caret down icon' />
              )}
            </div>
            <div className={`volumeCard-content-description-content ${openedDescription && 'volumeCard-content-description-content-opened'}`}>{volume.description[language]}</div>
          </div>
        )}
        <Link to={volume.downloadLink} target='_blank' className="volumeCard-content-download">
          <img className="volumeCard-content-download-icon" src={download} alt='Download icon' />
          <div className="volumeCard-content-download-text">PDF</div>
        </Link>
      </div>
    </div>
  )
}