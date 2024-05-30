import caretUp from '/icons/caret-up-red.svg';
import caretDown from '/icons/caret-down-red.svg';
import { IVolume } from "../../../../types/volume";
import './VolumeCard.scss'

export interface IVolumeCard extends IVolume {
  openedAbstract: boolean;
}

interface IVolumeCardProps extends IVolumeCard {
  toggleAbstractCallback: () => void;
}

export default function VolumeCard({ title, authors, openedAbstract, abstract, publicationDate, tag, toggleAbstractCallback }: IVolumeCardProps): JSX.Element {
  return (
    <div className='volumeCard'>
      <div className='volumeCard-tag'>{tag}</div>
      <div className='volumeCard-title'>{title}</div>
      <div className='volumeCard-authors'>{authors}</div>
      <div className='volumeCard-abstract'>
        <div className={`volumeCard-abstract-title ${!openedAbstract && 'volumeCard-abstract-title-closed'}`} onClick={toggleAbstractCallback}>
          <div className='volumeCard-abstract-title-text'>Abstract</div>
          {openedAbstract ? (
            <img className='volumeCard-abstract-title-caret' src={caretUp} alt='Caret up icon' />
          ) : (
            <img className='volumeCard-abstract-title-caret' src={caretDown} alt='Caret down icon' />
          )}
        </div>
        <div className={`volumeCard-abstract-content ${openedAbstract && 'volumeCard-abstract-content-opened'}`}>{abstract}</div>
      </div>
      <div className='volumeCard-publicationDate'>{publicationDate}</div>
    </div>
  )
}