import { Link } from 'react-router-dom';

import at from '/icons/at.svg';
import orcid from '/icons/orcid.svg';
import externalLink from '/icons/external-link-red.svg';
import linkedin from '/icons/linkedin.svg';
import twitter from '/icons/twitter.svg';
import mastodon from '/icons/mastodon.svg';
import { IBoard } from "../../../../types/board";
import './BoardCard.scss'

interface IBoardCardProps extends IBoard {
  fullCard: boolean;
  blurCard: boolean;
  setFullMemberIndexCallback: () => void;
}

export default function BoardCard({ picture, name, email, description, role, university, skills, socialNetworks, website, fullCard, blurCard, setFullMemberIndexCallback }: IBoardCardProps): JSX.Element {
  if (fullCard) {
    return (
      <div className='boardCard boardCard-full' onClick={setFullMemberIndexCallback}>
        <div className='boardCard-full-initial'>
          <div className='boardCard-full-initial-person'>
            <div className='boardCard-full-initial-person-picture'>
              <img src={picture} alt={`${name} picture`}/>
            </div>
            <div className='boardCard-full-initial-person-title'>
              <div className='boardCard-full-initial-person-title-name'>
                <div className='boardCard-full-initial-person-title-name-text'>{name}</div>
                <img className='boardCard-full-initial-person-title-name-orcid' src={orcid} alt='Orcid icon' />
              </div>
              <div className='boardCard-full-initial-person-title-role'>{role}</div>
            </div>
          </div>
          <div className='boardCard-full-initial-university'>{university}</div>
          <div className='boardCard-full-initial-skills'>{skills}</div>
        </div>
        <div className='boardCard-full-expanded'>
          <div className='boardCard-full-expanded-email'>
            <img className='boardCard-full-expanded-email-at' src={at} alt={`At ${email} icon`}/>
            <div>{email}</div>
          </div>
          <div className='boardCard-full-expanded-description'>{description}</div>
          <div className='boardCard-full-expanded-social'>
            {/* TODO : condtional rendering social networks + website */}
            {/* TODO : also conditional rendering other fields ? see API fetch */}
            {/* {socialNetworks.length > 0 && socialNetworks.map((socialNetwork) => (
              <span>{socialNetwork}</span>
            ))} */}
            <div className='boardCard-full-expanded-social-networks'>
              <Link to='/' target='_blank'>
                <img className='boardCard-full-expanded-social-networks-icon' src={linkedin} alt='Linkedin icon' />
              </Link>
              <Link to='/' target='_blank'>
              <img className='boardCard-full-expanded-social-networks-icon' src={twitter} alt='Twitter icon' />
              </Link>
              <Link to='/' target='_blank'>
              <img className='boardCard-full-expanded-social-networks-icon' src={mastodon} alt='Mastodon icon' />
              </Link>
            </div>
            <Link to={website} target='_blank'>
              <div className='boardCard-full-expanded-social-website'>
                <div>Website</div>
                <img className='boardCard-full-expanded-social-website-img' src={externalLink} alt='Website link icon' />
              </div>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={blurCard ? 'boardCard boardCard-blur' : 'boardCard'} onClick={setFullMemberIndexCallback}>
      <div className='boardCard-person'>
        <div className='boardCard-person-picture'>
          <img src={picture} alt={`${name} picture`}/>
        </div>
        <div className='boardCard-person-title'>
          <div className='boardCard-person-title-name'>
            <div className='boardCard-person-title-name-text'>{name}</div>
            <img className='boardCard-person-title-name-orcid' src={orcid} alt='Orcid icon' />
          </div>
          <div className='boardCard-person-title-role'>{role}</div>
        </div>
      </div>
      <div className='boardCard-university'>{university}</div>
      <div className='boardCard-skills'>{skills}</div>
    </div>
  )
}