import './BoardCard.scss'

export interface IBoardCardProps {
  picture: string;
  name: string;
  role: string;
  university: string;
  skills: string;
  full?: boolean;
}

export default function BoardCard({ picture, name, role, university, skills, full }: IBoardCardProps): JSX.Element {
  return (
    <div className={`boardCard ${full && 'boardCard-full'}`}>
      <div className='boardCard-person'>
        <div className='boardCard-person-picture'>{picture}</div>
        <div className='boardCard-person-title'>
          <div className='boardCard-person-title-name'>{name}</div>
          <div className='boardCard-person-title-role'>{role}</div>
        </div>
      </div>
      <div className='boardCard-university'>{university}</div>
      <div className='boardCard-skills'>{skills}</div>
    </div>
  )
}