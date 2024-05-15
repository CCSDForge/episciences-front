import './SwiperBoardCard.scss'

export interface ISwiperBoardCardProps {
  picture: string;
  name: string;
  role: string;
  university: string;
  skills: string;
}

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