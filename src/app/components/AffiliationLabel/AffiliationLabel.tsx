import rorIcon from '/icons/ror.svg';
import { IBoardMemberAffiliation } from '../../../types/board';
import './AffiliationLabel.scss';

interface IAffiliationLabelProps {
  affiliation: IBoardMemberAffiliation;
}

export default function AffiliationLabel({
  affiliation,
}: IAffiliationLabelProps): JSX.Element {
  return (
    <span className="affiliationLabel">
      {affiliation.rorId && (
        <>
          <a
            href={affiliation.rorId}
            target="_blank"
            rel="noopener noreferrer"
            className="affiliationLabel-ror-link"
            aria-label={`ROR profile for ${affiliation.label}`}
          >
            <img
              src={rorIcon}
              alt="ROR"
              className="affiliationLabel-ror-icon"
            />
          </a>
          {'\u00A0'}
        </>
      )}
      {affiliation.label}
    </span>
  );
}