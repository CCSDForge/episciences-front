import { Link } from 'react-router-dom';

import at from '/icons/at.svg';
import orcid from '/icons/orcid.svg';
import externalLink from '/icons/external-link-red.svg';
import linkedin from '/icons/linkedin.svg';
import twitter from '/icons/twitter.svg';
import mastodon from '/icons/mastodon.svg';
import user from '/icons/user.svg';
import { IBoardMember } from "../../../../types/board";
import './BoardCard.scss'

interface IBoardCardProps {
  member: IBoardMember;
  fullCard: boolean;
  blurCard: boolean;
  setFullMemberIndexCallback: () => void;
}

export default function BoardCard({ member, fullCard, blurCard, setFullMemberIndexCallback }: IBoardCardProps): JSX.Element {
  if (fullCard) {
    return (
      <div className='boardCard boardCard-full' onClick={setFullMemberIndexCallback}>
        <div className='boardCard-full-initial'>
          <div className='boardCard-full-initial-person'>
            <div className='boardCard-full-initial-person-picture'>
              {member.picture ? (
                <img src={member.picture} alt={`${member.firstname} ${member.lastname} picture`}/>
              ) : (
                <img src={user} alt='User icon' />
              )}
            </div>
            <div className='boardCard-full-initial-person-title'>
              <div className='boardCard-full-initial-person-title-name'>
                <div className='boardCard-full-initial-person-title-name-text'>{member.firstname} {member.lastname}</div>
                <img className='boardCard-full-initial-person-title-name-orcid' src={orcid} alt='Orcid icon' />
              </div>
              <div className='boardCard-full-initial-person-title-role'>{member.roles}</div>
            </div>
          </div>
          <div className='boardCard-full-initial-university'>{member.university}</div>
          <div className='boardCard-full-initial-skills'>{member.skills}</div>
        </div>
        <div className='boardCard-full-expanded'>
          <div className='boardCard-full-expanded-email'>
            <img className='boardCard-full-expanded-email-at' src={at} alt={`At ${member.email} icon`}/>
            <div>{member.email}</div>
          </div>
          <div className='boardCard-full-expanded-description'>{member.description}</div>
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
            <Link to={member.website} target='_blank'>
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
          {member.picture ? (
            <img src={member.picture} alt={`${member.firstname} ${member.lastname} picture`}/>
          ) : (
            <img src={user} alt='User icon' />
          )}
        </div>
        <div className='boardCard-person-title'>
          <div className='boardCard-person-title-name'>
            <div className='boardCard-person-title-name-text'>{member.firstname} {member.lastname}</div>
            <img className='boardCard-person-title-name-orcid' src={orcid} alt='Orcid icon' />
          </div>
          <div className='boardCard-person-title-role'>{member.roles}</div>
        </div>
      </div>
      <div className='boardCard-university'>{member.university}</div>
      <div className='boardCard-skills'>{member.skills}</div>
    </div>
  )
}