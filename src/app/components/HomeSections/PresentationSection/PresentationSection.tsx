import { Link } from 'react-router-dom';

import caretRight from '/icons/caret-right-grey.svg';
import caretDown from '/icons/caret-down-red.svg';
import { PATHS } from '../../../../config/paths'
import './PresentationSection.scss'

export default function PresentationSection(): JSX.Element {
  return (
    <div className="presentationSection">
      <div className='presentationSection-about'>
        <div className='presentationSection-about-content'>
          The Journal of Theoretical, Computational and Applied Mechanics is a scholarly journal, provided on a Fair Open Access basis, without cost to both readers and authors. The Journal aims to select publications of the highest scientific calibre in the form of either original research papers or reviews. The focus is placed on contributions of fundamental importance in the broad domain of solid mechanics, mechanics of materials and structures. The journal aims to achieve a balance between theoretical, numerical, applied and experimental research.
        </div>
        <Link to={PATHS.about}>
          <div className='presentationSection-about-seeMore'>
            <div className='presentationSection-about-seeMore-text'>See more</div>
            <img className='presentationSection-about-seeMore-icon' src={caretRight} alt='Caret right icon' />
          </div>
        </Link>
      </div>
      <div className='presentationSection-new'>
        <div className='presentationSection-new-title'>
          <div className='presentationSection-new-title-date'>2024</div>
          <div className='presentationSection-new-title-text'>Volume 14 - Spécial Issue</div>
        </div>
        <div className='presentationSection-new-description'>Archives et traces : enjeux, usages et poétiques. Actes des Doctoriales de l’Europe médiane, de l’espace russe et (post)soviétique (DEMEPS 2021)</div>
        <div className='presentationSection-new-about'>
          <div className='presentationSection-new-about-text'>About</div>
          <img className='presentationSection-new-about-text-icon' src={caretDown} alt='Caret down icon' />
        </div>
      </div>
    </div>
  )
}