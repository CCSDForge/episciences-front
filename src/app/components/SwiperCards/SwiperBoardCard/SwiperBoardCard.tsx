import { IBoard } from '../../../../types/board'
import './SwiperBoardCard.scss'

export type ISwiperBoardCardProps = IBoard

export default function SwiperBoardCard({ picture, name, role, university, skills }: ISwiperBoardCardProps): JSX.Element {
  return (
    <div className='swiperBoardCard'>
      <div className='swiperBoardCard-person'>
        <div className='swiperBoardCard-person-picture'>{picture}</div>
        <div className='swiperBoardCard-person-title'>
          <div className='swiperBoardCard-person-title-name'>{name}</div>
          <div className='swiperBoardCard-person-title-role'>{role}</div>
        </div>
      </div>
      <div className='swiperBoardCard-university'>{university}</div>
      <div className='swiperBoardCard-skills'>{skills}</div>
    </div>
  )
}