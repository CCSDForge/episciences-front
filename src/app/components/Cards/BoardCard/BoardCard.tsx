import { Link } from 'react-router-dom';

import at from '/icons/at.svg';
import orcid from '/icons/orcid.svg';
import externalLink from '/icons/external-link-red.svg';
import linkedin from '/icons/linkedin.svg';
import twitter from '/icons/twitter.svg';
import mastodon from '/icons/mastodon.svg';
import user from '/icons/user.svg';
import { IBoardMember } from "../../../../types/board";
import { AvailableLanguage } from '../../../../utils/i18n';
import { defaultBoardRole, getBoardRole } from '../../../../utils/types';
import './BoardCard.scss'

interface IBoardCardProps {
  language: AvailableLanguage;
  member: IBoardMember;
  fullCard: boolean;
  blurCard: boolean;
  setFullMemberIndexCallback: () => void;
}

export default function BoardCard({ language, member, fullCard, blurCard, setFullMemberIndexCallback }: IBoardCardProps): JSX.Element {
  if (fullCard) {
    return (
      <div className='boardCard boardCard-full' onClick={setFullMemberIndexCallback}>
        <div className='boardCard-full-initial'>
          <div className='boardCard-full-initial-person'>
            <div className='boardCard-full-initial-person-picture'>
              {member.picture ? (
                <img src={member.picture} alt={`${member.firstname} ${member.lastname} picture`}/>
              ) : (
                <img className='boardCard-person-picture-placeholder' src={user} alt='User icon' />
              )}
            </div>
            <div className='boardCard-full-initial-person-title'>
              <div className='boardCard-full-initial-person-title-name'>
                <div className='boardCard-full-initial-person-title-name-text'>{member.firstname} {member.lastname}</div>
                {member.orcid && member.orcid.length > 0 && (
                  <Link to={`${import.meta.env.VITE_ORCID_HOMEPAGE}/${member.orcid}`} title={member.orcid} target='_blank' onClick={(e) => e.stopPropagation()}>
                    <img className='boardCard-full-initial-person-title-name-orcid' src={orcid} alt='Orcid icon' />
                  </Link>
                )}
              </div>
              {member.rolesLabels.length > 0 ? (
                <div className='boardCard-full-initial-person-title-role'>{getBoardRole(member.rolesLabels[0])}</div>
              ) : (
                <div className='boardCard-full-initial-person-title-role'>{defaultBoardRole.label}</div>
              )}
            </div>
          </div>
          {member.affiliations.length > 0 && <div className='boardCard-full-initial-affiliations'>{member.affiliations[0].label}</div>}
          {member.assignedSections.length > 0 && <div className='boardCard-full-initial-assignedSections'>{member.assignedSections.map((assignedSection) => assignedSection.title[language]).join(', ')}</div>}
        </div>
        <div className='boardCard-full-expanded'>
          <div className='boardCard-full-expanded-email'>
            <img className='boardCard-full-expanded-email-at' src={at} alt={`At ${member.email} icon`}/>
            <div>{member.email}</div>
          </div>
          <div className='boardCard-full-expanded-biography'>{member.biography}</div>
          <div className='boardCard-full-expanded-social'>
            {member.socialMedias && (
              <div className='boardCard-full-expanded-social-networks'>
                <Link to={`${import.meta.env.VITE_LINKEDIN_HOMEPAGE}/${member.socialMedias}`} title={member.socialMedias} target='_blank' onClick={(e) => e.stopPropagation()}>
                  <img className='boardCard-full-expanded-social-networks-icon' src={linkedin} alt='Linkedin icon' />
                </Link>
                <Link to={`${import.meta.env.VITE_TWITTER_HOMEPAGE}/${member.socialMedias}`} title={member.socialMedias} target='_blank' onClick={(e) => e.stopPropagation()}>
                <img className='boardCard-full-expanded-social-networks-icon' src={twitter} alt='Twitter icon' />
                </Link>
                <Link to={`${import.meta.env.VITE_MASTODON_HOMEPAGE}/${member.socialMedias}`} title={member.socialMedias} target='_blank' onClick={(e) => e.stopPropagation()}>
                <img className='boardCard-full-expanded-social-networks-icon' src={mastodon} alt='Mastodon icon' />
                </Link>
              </div>
            )}
            {member.websites.length > 0 && (
              <Link to={member.websites[0]} title={member.websites[0]} target='_blank' onClick={(e) => e.stopPropagation()}>
                <div className='boardCard-full-expanded-social-website'>
                  <div>Website</div>
                  <img className='boardCard-full-expanded-social-website-img' src={externalLink} alt='Website link icon' />
                </div>
              </Link>
            )}
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
            <img className='boardCard-person-picture-placeholder' src={user} alt='User icon' />
          )}
        </div>
        <div className='boardCard-person-title'>
          <div className='boardCard-person-title-name'>
            <div className='boardCard-person-title-name-text'>{member.firstname} {member.lastname}</div>
            {member.orcid && member.orcid.length > 0 && (
              <Link to={`${import.meta.env.VITE_ORCID_HOMEPAGE}/${member.orcid}`} title={member.orcid} target='_blank' onClick={(e) => e.stopPropagation()}>
                <img className='boardCard-person-title-name-orcid' src={orcid} alt='Orcid icon' />
              </Link>
            )}
          </div>
          {member.rolesLabels.length > 0 ? (
            <div className='boardCard-person-title-role'>{getBoardRole(member.rolesLabels[0])}</div>
          ) : (
            <div className='boardCard-person-title-role'>{defaultBoardRole.label}</div>
          )}
        </div>
      </div>
      {member.affiliations.length > 0 && <div className='boardCard-affiliations'>{member.affiliations[0].label}</div>}
      {member.assignedSections.length > 0 && <div className='boardCard-assignedSections'>{member.assignedSections.map((assignedSection) => assignedSection.title[language]).join(', ')}</div>}
    </div>
  )
}