import { Link } from 'react-router-dom';

import caretRight from '/icons/caret-right-grey.svg';
import close from '/icons/close-red.svg';
import { PATHS } from '../../../config/paths';
import { IAuthor } from "../../../types/author";
import './AuthorDetails.scss'

export interface IAuthorDetailsProps extends IAuthor {
  onCloseDetailsCallback: () => void;
}

export default function AuthorDetails ({ name, onCloseDetailsCallback }: IAuthorDetailsProps): JSX.Element {
  // TODO: remove mock
  // TODO: type hint in author ?
  const articles = [
    { id: 1, title: "D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000", publicationDate: 'Published on August 18, 2021', doi: 'ttps://doi.org/10.46298/jtcam.10304' },
    { id: 2, title: "D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000", publicationDate: 'Published on August 18, 2021', doi: 'ttps://doi.org/10.46298/jtcam.10304' },
    { id: 3, title: "D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000", publicationDate: 'Published on August 18, 2021', doi: 'ttps://doi.org/10.46298/jtcam.10304' },
    { id: 4, title: "D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000", publicationDate: 'Published on August 18, 2021', doi: 'ttps://doi.org/10.46298/jtcam.10304' },
    { id: 5, title: "D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000", publicationDate: 'Published on August 18, 2021', doi: 'ttps://doi.org/10.46298/jtcam.10304' }
  ]

  return (
    <div className="authorDetails">
      <img className='authorDetails-close' src={close} alt='Close icon' onClick={onCloseDetailsCallback} />
      <div className="authorDetails-content">
        <div className="authorDetails-content-name">{name}</div>
        {articles.map((article) => (
          <div className="authorDetails-content-article">
            <div className="authorDetails-content-article-title">{article.title}</div>
            <div className="authorDetails-content-article-publicationDate">{article.publicationDate}</div>
            <div className="authorDetails-content-article-doi">
              <div className="authorDetails-content-article-doi-text">DOI :</div>
              <div className="authorDetails-content-article-doi-link">{article.doi}</div>
            </div>
            <Link to={PATHS.home}>
              <div className="authorDetails-content-article-seeMore">
                <div className="authorDetails-content-article-seeMore-text">See more</div>
                <img className="authorDetails-content-article-seeMore-icon" src={caretRight} alt='Caret right icon' />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}