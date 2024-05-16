import Swiper from '../../components/Swiper/Swiper';
import './Home.scss';

export default function Home(): JSX.Element {
  // TODO : remove mocks
  const articles = [
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

  const boards = [
    { id: 1, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 2, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 3, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 4, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 5, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 6, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 7, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 8, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 9, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 10, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 11, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 12, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 13, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 14, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 15, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 16, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 17, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
    { id: 18, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' }
  ]

  return (
    <main className='home'>
      <h1 className='home-title'>Home</h1>
      <h2 className='home-subtitle'>Latest articles</h2>
      <Swiper id='articles-swiper' type='article' cards={articles}/>
      <h2 className='home-subtitle'>News</h2>
      <h2 className='home-subtitle'>Members</h2>
      <Swiper id='boards-swiper' type='board' cards={boards}/>
      <h2 className='home-subtitle'>Journal indexation</h2>
      <h2 className='home-subtitle'>Special issues</h2>
    </main>
  )
}