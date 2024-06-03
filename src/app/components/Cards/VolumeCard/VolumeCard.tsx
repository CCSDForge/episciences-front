import caretUp from '/icons/caret-up-red.svg';
import caretDown from '/icons/caret-down-red.svg';
import file from '/icons/file-grey.svg';
import { IVolume } from "../../../../types/volume";
import { AvailableLanguage } from '../../../../utils/i18n';
import './VolumeCard.scss'

interface IVolumeCardProps {
  language: AvailableLanguage;
  volume: IVolume;
}

export default function VolumeCard({ language, volume }: IVolumeCardProps): JSX.Element {
  return (
    <div className='volumeCard'>
      <div className='volumeCard-title'>
        <div className='volumeCard-title-text'>{volume.title ? volume.title[language] : ''}</div>
        <div className='volumeCard-title-year'>{volume.year}</div>
        <div className='volumeCard-title-count'>
          <img className='volumeCard-title-count-icon' src={file} alt='File icon' />
          <span className='volumeCard-title-count-text'>{volume.articles.length > 1 ? `${volume.articles.length} articles`: `${volume.articles.length} article`}</span>
        </div>
      </div>
    </div>
  )
}