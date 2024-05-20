import { useTranslation } from 'react-i18next';

import fakeProfile from '/icons/fake-profile.svg';
import { IArticle } from '../../../types/article';
import { IBoard } from '../../../types/board';
import { INews } from '../../../types/news';
import { IStat } from '../../../types/stat';
import NewsSection from '../../components/HomeSections/NewsSection/NewsSection';
import StatisticsSection from '../../components/HomeSections/StatisticsSection/StatisticsSection';
import Swiper from '../../components/Swiper/Swiper';
import './Home.scss';

export default function Home(): JSX.Element {
  const { t } = useTranslation();  

  // TODO : remove mocks
  const articles: IArticle[] = [
    { id: 1, title: "D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000", authors: 'Adrien Martin ; Andrea Opreni ; Alessandra Vizzaccaro et al.', publicationDate: 'Published on Aug. 18th, 2023', tag: 'Compte-rendu' },
    { id: 2, title: "D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000", authors: 'Adrien Martin ; Andrea Opreni ; Alessandra Vizzaccaro et al.', publicationDate: 'Published on Aug. 18th, 2023', tag: 'Compte-rendu' },
    { id: 3, title: "D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000", authors: 'Adrien Martin ; Andrea Opreni ; Alessandra Vizzaccaro et al.', publicationDate: 'Published on Aug. 18th, 2023', tag: 'Compte-rendu' },
    { id: 4, title: "D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000", authors: 'Adrien Martin ; Andrea Opreni ; Alessandra Vizzaccaro et al.', publicationDate: 'Published on Aug. 18th, 2023', tag: 'Compte-rendu' },
    { id: 5, title: "D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000", authors: 'Adrien Martin ; Andrea Opreni ; Alessandra Vizzaccaro et al.', publicationDate: 'Published on Aug. 18th, 2023', tag: 'Compte-rendu' },
    { id: 6, title: "D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000", authors: 'Adrien Martin ; Andrea Opreni ; Alessandra Vizzaccaro et al.', publicationDate: 'Published on Aug. 18th, 2023', tag: 'Compte-rendu' },
    { id: 7, title: "D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000", authors: 'Adrien Martin ; Andrea Opreni ; Alessandra Vizzaccaro et al.', publicationDate: 'Published on Aug. 18th, 2023', tag: 'Compte-rendu' },
    { id: 8, title: "D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000", authors: 'Adrien Martin ; Andrea Opreni ; Alessandra Vizzaccaro et al.', publicationDate: 'Published on Aug. 18th, 2023', tag: 'Compte-rendu' },
    { id: 9, title: "D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000", authors: 'Adrien Martin ; Andrea Opreni ; Alessandra Vizzaccaro et al.', publicationDate: 'Published on Aug. 18th, 2023', tag: 'Compte-rendu' },
    { id: 10, title: "D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000", authors: 'Adrien Martin ; Andrea Opreni ; Alessandra Vizzaccaro et al.', publicationDate: 'Published on Aug. 18th, 2023', tag: 'Compte-rendu' },
    { id: 11, title: "D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000", authors: 'Adrien Martin ; Andrea Opreni ; Alessandra Vizzaccaro et al.', publicationDate: 'Published on Aug. 18th, 2023', tag: 'Compte-rendu' },
    { id: 12, title: "D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000", authors: 'Adrien Martin ; Andrea Opreni ; Alessandra Vizzaccaro et al.', publicationDate: 'Published on Aug. 18th, 2023', tag: 'Compte-rendu' },
    { id: 13, title: "D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000", authors: 'Adrien Martin ; Andrea Opreni ; Alessandra Vizzaccaro et al.', publicationDate: 'Published on Aug. 18th, 2023', tag: 'Compte-rendu' },
    { id: 14, title: "D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000", authors: 'Adrien Martin ; Andrea Opreni ; Alessandra Vizzaccaro et al.', publicationDate: 'Published on Aug. 18th, 2023', tag: 'Compte-rendu' },
    { id: 15, title: "D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000", authors: 'Adrien Martin ; Andrea Opreni ; Alessandra Vizzaccaro et al.', publicationDate: 'Published on Aug. 18th, 2023', tag: 'Compte-rendu' },
    { id: 16, title: "D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000", authors: 'Adrien Martin ; Andrea Opreni ; Alessandra Vizzaccaro et al.', publicationDate: 'Published on Aug. 18th, 2023', tag: 'Compte-rendu' },
    { id: 17, title: "D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000", authors: 'Adrien Martin ; Andrea Opreni ; Alessandra Vizzaccaro et al.', publicationDate: 'Published on Aug. 18th, 2023', tag: 'Compte-rendu' },
    { id: 18, title: "D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000", authors: 'Adrien Martin ; Andrea Opreni ; Alessandra Vizzaccaro et al.', publicationDate: 'Published on Aug. 18th, 2023', tag: 'Compte-rendu' }
  ]

  const news: INews[] = [
    { id: 1, title: "Articles scientifiques : nouveaux modèles économiques et nouvelles formes de publication", publicationDate: 'Published on Aug. 18th, 2023'},
    { id: 2, title: "Episciences Days. Publishing another way: the epic of Episciences and overlay journals", publicationDate: 'Published on Aug. 18th, 2023' },
    { id: 3, title: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam", publicationDate: 'Published on Aug. 18th, 2023' },
  ]

  const boards: IBoard[] = [
    { id: 1, picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 2, picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 3, picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 4, picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 5, picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 6, picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 7, picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 8, picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 9, picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 10, picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 11, picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 12, picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 13, picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 14, picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 15, picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 16, picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 17, picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 18, picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' }
  ]

  const stats: IStat[] = [
    { stat: '62.07%', title: 'Acceptance rate' },
    { stat: '29', title: 'Published articles' },
    { stat: '2 weeks', title: 'Submission-publication time' }
  ]

  return (
    <main className='home'>
      <h1 className='home-title'>{t('pages.home.title')}</h1>
      <h2 className='home-subtitle'>Latest articles</h2>
      <Swiper id='articles-swiper' type='article' slidesPerView={3} cards={articles}/>
      <h2 className='home-subtitle'>News</h2>
      <NewsSection news={news} />
      <h2 className='home-subtitle'>Members</h2>
      <Swiper id='boards-swiper' type='board' slidesPerView={4} cards={boards}/>
      <StatisticsSection stats={stats} />
      <h2 className='home-subtitle'>Journal indexation</h2>
      <h2 className='home-subtitle'>Special issues</h2>
    </main>
  )
}