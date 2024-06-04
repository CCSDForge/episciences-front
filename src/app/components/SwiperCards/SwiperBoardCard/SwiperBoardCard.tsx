import orcid from '/icons/orcid.svg';

import { IBoardMember } from '../../../../types/board'
import './SwiperBoardCard.scss'

export type SwiperBoardCardProps = IBoardMember

export default function SwiperBoardCard({ picture, name, role, university, skills }: SwiperBoardCardProps): JSX.Element {
  return (
    <div className='swiperBoardCard'>
      <div className='swiperBoardCard-person'>
        <div className='swiperBoardCard-person-picture'>
          <img src={picture} alt={`${name} picture`}/>
        </div>
        <div className='swiperBoardCard-person-title'>
          <div className='swiperBoardCard-person-title-name'>
            <div className='swiperBoardCard-person-title-name-text'>{name}</div>
            <img className='swiperBoardCard-person-title-name-orcid' src={orcid} alt='Orcid icon' />
          </div>
          <div className='swiperBoardCard-person-title-role'>{role}</div>
        </div>
      </div>
      <div className='swiperBoardCard-university'>{university}</div>
      <div className='swiperBoardCard-skills'>{skills}</div>
    </div>
  )
}