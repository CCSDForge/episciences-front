import './BoardCard.scss'

export interface IBoardCardProps {
  picture: string;
  name: string;
  role: string;
  university: string;
  skills: string;
  fullCard?: boolean;
  blurCard?: boolean;
}

export default function BoardCard({ picture, name, role, university, skills, fullCard, blurCard }: IBoardCardProps): JSX.Element {
  const boardCardClassName = () => {
    if (fullCard) {
      return 'boardCard boardCard-full';
    }

    if (blurCard) {
      return 'boardCard boardCard-blur';
    }

    return 'boardCard';
  }

  return (
    <div className={boardCardClassName()}>
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