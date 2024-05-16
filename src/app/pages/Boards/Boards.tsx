import { useState } from 'react';

import logo from '/logo.svg';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import BoardCard from '../../components/Cards/BoardCard/BoardCard';
import BoardSidebar from '../../components/Sidebars/BoardSidebar/BoardSidebar';
import './Boards.scss';

export default function Boards(): JSX.Element {
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [fullMemberIndex, setFullMemberIndex] = useState(-1);

  // TODO : remove mocks
  const titles = ['Editorial board', 'Technical board', 'Scientific Advisory Board'];
  const boards = [
    {
      title: titles[0],
      description: 'The Associate Editors form the Editorial Board and represent the community. They handle submissions assigned to them by the authors, following the Editorial Policy of the journal.',
      members: [
        { id: 1, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
        { id: 2, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
        { id: 3, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
        { id: 4, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics', full: true },
        { id: 5, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
        { id: 6, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
      ],
    },
    {
      title: titles[1],
      description: 'The Associate Editors form the Editorial Board and represent the community. They handle submissions assigned to them by the authors, following the Editorial Policy of the journal.',
      members: [
        { id: 7, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
        { id: 8, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
        { id: 9, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
        { id: 10, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
        { id: 11, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
        { id: 12, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
        { id: 13, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
        { id: 14, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
      ]
    },
    {
      title: titles[2],
      description: 'The Associate Editors form the Editorial Board and represent the community. They handle submissions assigned to them by the authors, following the Editorial Policy of the journal.',
      members: [
        { id: 15, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
        { id: 16, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
        { id: 17, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
        { id: 18, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' }
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
          {boards.map((board, index) => (
            <div key={index} className='boards-content-groups-group'>
              <div className='boards-content-groups-group-title'>
                <h2>{board.title}</h2>
                {activeGroupIndex === index ? (
                  <img className='boards-content-groups-group-caret' src={logo} alt='Caret up icon' onClick={(): void => handleGroupToggle(-1)} />
                ) : (
                  <img className='boards-content-groups-group-caret' src={logo} alt='Caret down icon' onClick={(): void => handleGroupToggle(index)} />
                )}
              </div>
              <div className={`boards-content-groups-group-content ${activeGroupIndex === index && 'boards-content-groups-group-content-active'}`}>
                <p className='boards-content-groups-group-content-description'>{board.description}</p>
                <div className='boards-content-groups-group-content-grid'>
                  {board.members.map((member, index) => (
                    <BoardCard key={index} {...member} fullCard={fullMemberIndex === index} blurCard={fullMemberIndex !== -1 && fullMemberIndex !== index} />
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