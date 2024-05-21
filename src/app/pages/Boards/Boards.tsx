import { useState } from 'react';

import fakeProfile from '/icons/fake-profile.svg';
import caretUp from '/icons/caret-up-red.svg';
import caretDown from '/icons/caret-down-red.svg';
import { IBoard } from '../../../types/board';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import BoardCard from '../../components/Cards/BoardCard/BoardCard';
import BoardSidebar from '../../components/Sidebars/BoardSidebar/BoardSidebar';
import './Boards.scss';

interface IBoardPerTitle {
  title: string;
  description: string;
  members: IBoard[];
}

export default function Boards(): JSX.Element {
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [fullMemberIndex, setFullMemberIndex] = useState(-1);

  // TODO : remove mocks
  const titles = ['Editorial board', 'Technical board', 'Scientific Advisory Board'];
  
  const boardsPerTitle: IBoardPerTitle[] = [
    {
      title: titles[0],
      description: 'The Associate Editors form the Editorial Board and represent the community. They handle submissions assigned to them by the authors, following the Editorial Policy of the journal.',
      members: [
        { id: 1, email: 'emailadresse@episciences.org', picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics', description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr', socialNetworks: [], website: 'https://www.episciences.org/fr/accueil' },
        { id: 2, email: 'emailadresse@episciences.org', picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics', description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr', socialNetworks: [], website: 'https://www.episciences.org/fr/accueil' },
        { id: 3, email: 'emailadresse@episciences.org', picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics', description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr', socialNetworks: [], website: 'https://www.episciences.org/fr/accueil' },
        { id: 4, email: 'emailadresse@episciences.org', picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics', description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr', socialNetworks: [], website: 'https://www.episciences.org/fr/accueil' },
        { id: 5, email: 'emailadresse@episciences.org', picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics', description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr', socialNetworks: [], website: 'https://www.episciences.org/fr/accueil' },
        { id: 6, email: 'emailadresse@episciences.org', picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics', description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr', socialNetworks: [], website: 'https://www.episciences.org/fr/accueil' },
      ],
    },
    {
      title: titles[1],
      description: 'The Associate Editors form the Editorial Board and represent the community. They handle submissions assigned to them by the authors, following the Editorial Policy of the journal.',
      members: [
        { id: 7, email: 'emailadresse@episciences.org', picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics', description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr', socialNetworks: [], website: 'https://www.episciences.org/fr/accueil' },
        { id: 8, email: 'emailadresse@episciences.org', picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics', description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr', socialNetworks: [], website: 'https://www.episciences.org/fr/accueil' },
        { id: 9, email: 'emailadresse@episciences.org', picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics', description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr', socialNetworks: [], website: 'https://www.episciences.org/fr/accueil' },
        { id: 10, email: 'emailadresse@episciences.org', picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics', description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr', socialNetworks: [], website: 'https://www.episciences.org/fr/accueil' },
        { id: 11, email: 'emailadresse@episciences.org', picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics', description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr', socialNetworks: [], website: 'https://www.episciences.org/fr/accueil' },
        { id: 12, email: 'emailadresse@episciences.org', picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics', description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr', socialNetworks: [], website: 'https://www.episciences.org/fr/accueil' },
        { id: 13, email: 'emailadresse@episciences.org', picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics', description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr', socialNetworks: [], website: 'https://www.episciences.org/fr/accueil' },
        { id: 14, email: 'emailadresse@episciences.org', picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics', description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr', socialNetworks: [], website: 'https://www.episciences.org/fr/accueil' },
      ]
    },
    {
      title: titles[2],
      description: 'The Associate Editors form the Editorial Board and represent the community. They handle submissions assigned to them by the authors, following the Editorial Policy of the journal.',
      members: [
        { id: 15, email: 'emailadresse@episciences.org', picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics', description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr', socialNetworks: [], website: 'https://www.episciences.org/fr/accueil' },
        { id: 16, email: 'emailadresse@episciences.org', picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics', description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr', socialNetworks: [], website: 'https://www.episciences.org/fr/accueil' },
        { id: 17, email: 'emailadresse@episciences.org', picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics', description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr', socialNetworks: [], website: 'https://www.episciences.org/fr/accueil' },
        { id: 18, email: 'emailadresse@episciences.org', picture: fakeProfile, name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics', description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr', socialNetworks: [], website: 'https://www.episciences.org/fr/accueil' }
      ]
    }
  ]

  const handleGroupToggle = (index: number): void => {
    setActiveGroupIndex(prev => prev === index ? 0 : index);
  };

  return (
    <main className='boards'>
      <Breadcrumb />
      <div className='boards-title'>
        <h1>Boards</h1>
        <div className='boards-title-count'>35 members</div>
      </div>
      <div className='boards-content'>
        <BoardSidebar groups={titles} activeGroupIndex={activeGroupIndex} onSetActiveGroupCallback={handleGroupToggle} />
        <div className='boards-content-groups'>
          {boardsPerTitle.map((boardPerTitle, index) => (
            <div key={index} className='boards-content-groups-group'>
              <div className='boards-content-groups-group-title' onClick={(): void => activeGroupIndex === index ? handleGroupToggle(-1) : handleGroupToggle(index)}>
                <h2>{boardPerTitle.title}</h2>
                {activeGroupIndex === index ? (
                  <img className='boards-content-groups-group-caret' src={caretUp} alt='Caret up icon' />
                ) : (
                  <img className='boards-content-groups-group-caret' src={caretDown} alt='Caret down icon' />
                )}
              </div>
              <div className={`boards-content-groups-group-content ${activeGroupIndex === index && 'boards-content-groups-group-content-active'}`}>
                <p className='boards-content-groups-group-content-description'>{boardPerTitle.description}</p>
                <div className='boards-content-groups-group-content-grid'>
                  {boardPerTitle.members.map((member, index) => (
                    <BoardCard
                      key={index}
                      {...member}
                      fullCard={fullMemberIndex === index}
                      blurCard={fullMemberIndex !== -1 && fullMemberIndex !== index}
                      setFullMemberIndexCallback={(): void => fullMemberIndex !== index ? setFullMemberIndex(index) : setFullMemberIndex(-1)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}