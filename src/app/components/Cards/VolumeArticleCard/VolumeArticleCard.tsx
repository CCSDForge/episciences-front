import { useState } from 'react';

import caretUp from '/icons/caret-up-red.svg';
import caretDown from '/icons/caret-down-red.svg';
import { IArticle } from '../../../../types/article'
import './VolumeArticleCard.scss'

interface IVolumeArticleCardProps {
  article: IArticle;
}

export default function VolumeArticleCard({ article }: IVolumeArticleCardProps): JSX.Element {
  const [openedAbstract, setOpenedAbstract] = useState(false)

  const toggleAbstract = (): void => setOpenedAbstract(!openedAbstract)

  return (
    <div className="volumeArticleCard">
        {/* TODO */}
        {/* <div className='volumeArticleCard-tag'>{tag}</div> */}
        <div className='volumeArticleCard-title'>D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000</div>
        <div className='volumeArticleCard-authors'>Ilona Sinzelle-Poňavičová</div>
        <div className='volumeArticleCard-abstract'>
        <div className={`volumeArticleCard-abstract-title ${!openedAbstract && 'volumeArticleCard-abstract-title-closed'}`} onClick={toggleAbstract}>
          <div className='volumeArticleCard-abstract-title-text'>Abstract</div>
          {openedAbstract ? (
            <img className='volumeArticleCard-abstract-title-caret' src={caretUp} alt='Caret up icon' />
          ) : (
            <img className='volumeArticleCard-abstract-title-caret' src={caretDown} alt='Caret down icon' />
          )}
        </div>
        <div className={`volumeArticleCard-abstract-content ${openedAbstract && 'volumeArticleCard-abstract-content-opened'}`}>TODO</div>
      </div>
        <div className='volumeArticleCard-publicationDate'>Published on August 18, 2023</div>
    </div>
  )
}