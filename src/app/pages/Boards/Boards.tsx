import { useState } from 'react';

import BoardCard from '../../components/Cards/BoardCard/BoardCard';
import BoardSidebar from '../../components/Sidebars/BoardSidebar/BoardSidebar';

import './Boards.scss';

export default function Boards(): JSX.Element {
  const [fullMember, setFullMember] = useState(-1);
  // TODO : remove mocks
  const [titles, setTitles] = useState([
    {
      text: 'Editorial board', isActive: true,
    },
    {
      text: 'Technical board', isActive: false
    },
    {
      text: 'Scientific Advisory Board', isActive: false
    }
  ])

  // TODO : remove mocks
  const boards = [
    {
      title: titles[0].text,
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
      title: titles[1].text,
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
      title: titles[2].text,
      description: 'The Associate Editors form the Editorial Board and represent the community. They handle submissions assigned to them by the authors, following the Editorial Policy of the journal.',
      members: [
        { id: 15, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
        { id: 16, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
        { id: 17, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' },
        { id: 18, picture: 'TODO', name: 'Laurence Brassart', role: 'Editor in chief', university: 'University of Oxford, United Kingdom', skills: 'micromechanics, multiscale modelling, homogenisation theory, constitutive modelling, multiphysics couplings in materials, computational mechanics' }
      ]
    }
  ]

  const onSetActiveLink = (index: number) => {
    const updatedTitles = titles.map((title, i) => {
      if (i === index) {
        return {...title, isActive: true };
      }

      return {...title, isActive: false };
    });
  
    setTitles(updatedTitles);
  }

  return (
    <main className='boards'>
      <h1 className='boards-title'>Boards</h1>
      <div className='boards-content'>
        <BoardSidebar links={titles} onSetActiveLinkCallback={onSetActiveLink} />
        <div className='boards-content-groups'>
          {boards.map((board, index) => (
            <div key={index} className='boards-content-groups-group'>
              <h2 className='boards-content-groups-group-title'>{board.title}</h2>
              <p className='boards-content-groups-group-description'>{board.description}</p>
              <div className='boards-content-groups-group-grid'>
                {board.members.map((member, index) => (
                  <BoardCard key={index} {...member} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}