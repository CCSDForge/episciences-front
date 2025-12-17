import { TFunction } from 'i18next';
import { Link } from 'react-router-dom';

import orcid from '/icons/orcid.svg';
import user from '/icons/user.svg';
import { IBoardMember } from '../../../../types/board';
import { AvailableLanguage } from '../../../../utils/i18n';
import { defaultBoardRole, getBoardRoles } from '../../../../utils/board';
import './SwiperBoardCard.scss';

export type SwiperBoardCardProps = IBoardMember;

interface ISwiperBoardCardProps {
  language: AvailableLanguage;
  t: TFunction<'translation', undefined>;
  member: IBoardMember;
}

export default function SwiperBoardCard({
  language,
  t,
  member,
}: ISwiperBoardCardProps): JSX.Element {
  return (
    <div className="swiperBoardCard">
      <div className="swiperBoardCard-person">
        <div className="swiperBoardCard-person-picture">
          {member.picture ? (
            <img
              src={member.picture}
              alt={`${member.firstname} ${member.lastname} picture`}
            />
          ) : (
            <img
              className="swiperBoardCard-person-picture-placeholder"
              src={user}
              alt="User icon"
            />
          )}
        </div>
        <div className="swiperBoardCard-person-title">
          <div className="swiperBoardCard-person-title-name">
            <div className="swiperBoardCard-person-title-name-text">
              {member.firstname} {member.lastname}
            </div>
            {member.orcid && member.orcid.length > 0 && (
              <Link
                to={`${import.meta.env.VITE_ORCID_HOMEPAGE}/${member.orcid}`}
                title={member.orcid}
                target="_blank"
                onClick={e => e.stopPropagation()}
              >
                <img
                  className="swiperBoardCard-person-title-name-orcid"
                  src={orcid}
                  alt="Orcid icon"
                />
              </Link>
            )}
          </div>
          {member.roles.length > 0 ? (
            <div className="swiperBoardCard-person-title-role">
              {getBoardRoles(t, member.roles)}
            </div>
          ) : (
            <div className="swiperBoardCard-person-title-role">
              {defaultBoardRole(t).label}
            </div>
          )}
        </div>
      </div>
      {member.affiliations.length > 0 && (
        <div className="swiperBoardCard-affiliations">
          {member.affiliations[0].label}
        </div>
      )}
      {member.assignedSections.length > 0 && (
        <div className="swiperBoardCard-assignedSections">
          {member.assignedSections
            .map(assignedSection => assignedSection.title[language])
            .join(', ')}
        </div>
      )}
    </div>
  );
}
