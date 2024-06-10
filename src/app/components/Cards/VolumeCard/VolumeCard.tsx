import { useState } from 'react';
import { Link } from 'react-router-dom';

import caretUp from '/icons/caret-up-red.svg';
import caretDown from '/icons/caret-down-red.svg';
import file from '/icons/file-grey.svg';
import { PATHS } from '../../../../config/paths';
import { IVolume } from "../../../../types/volume";
import { AvailableLanguage } from '../../../../utils/i18n';
import './VolumeCard.scss'

interface IVolumeCardProps {
  language: AvailableLanguage;
  volume: IVolume;
}

export default function VolumeCard({ language, volume }: IVolumeCardProps): JSX.Element {
  const [openedDescription, setOpenedDescription] = useState(false)

  const toggleDescription = (): void => setOpenedDescription(!openedDescription)

  return (
    <div className='volumeCard'>
      <div className='volumeCard-resume'>
        <Link to={`${PATHS.volumes}/${volume.id}`}>
          <div className='volumeCard-resume-id'>{`Volume ${volume.id}`}</div>
        </Link>
        <div className='volumeCard-resume-year'>{volume.year}</div>
        <div className='volumeCard-resume-count'>
          <img className='volumeCard-resume-count-icon' src={file} alt='File icon' />
          <span className='volumeCard-resume-count-text'>{volume.articles.length > 1 ? `${volume.articles.length} articles`: `${volume.articles.length} article`}</span>
        </div>
      </div>
      <div className='volumeCard-content'>
        {volume.types && volume.types.includes('special_issue') && (
          <div className='volumeCard-content-special'>Special issue</div>
        )}
        <div className='volumeCard-content-title'>{volume.title ? volume.title[language] : ''}</div>
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
      </div>
    </div>
  )
}