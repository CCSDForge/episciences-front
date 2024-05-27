import { useState } from 'react';
import ReactMarkdown from 'react-markdown'

import caretUp from '/icons/caret-up-red.svg';
import caretDown from '/icons/caret-down-red.svg';
import { useAppSelector } from "../../../hooks/store";
import { useFetchBoardMembersQuery, useFetchBoardPagesQuery } from '../../../store/features/board/board.query';
import { IBoardMember } from '../../../types/board';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import BoardCard from '../../components/Cards/BoardCard/BoardCard';
import Loader from '../../components/Loader/Loader';
import BoardSidebar from '../../components/Sidebars/BoardSidebar/BoardSidebar';
import './Boards.scss';

interface IBoardPerTitle {
  title: string;
  description: string;
  members: IBoardMember[];
}

export default function Boards(): JSX.Element {
  const language = useAppSelector(state => state.i18nReducer.language)
  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code)

  const { data: pages, isFetching: isFetchingPages } = useFetchBoardPagesQuery(rvcode!, { skip: !rvcode })
  const { data: members, isFetching: isFetchingMembers } = useFetchBoardMembersQuery(rvcode!, { skip: !rvcode })

  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [fullMemberIndex, setFullMemberIndex] = useState(-1);

  const getPagesLabels = (): string [] => {
    if (!pages || !pages.length) return [];

    const labels: string[] = [];

    pages.forEach((page) => {
      labels.push(page.title[language])
    })

    return labels;
  }

  const getBoardsPerTitle = (): IBoardPerTitle[] => {
    if (!pages || !pages.length) return [];
    if (!members || !members.length) return [];

    const boardsPerTitle: IBoardPerTitle[] = [];

    pages.forEach((page) => {
      const title = page.title[language];
      const description = page.content[language];

      const pageMembers = members.filter((member) => member.roles.includes(page.page_code));

      boardsPerTitle.push({
        title,
        description,
        members: pageMembers
      })
    })

    return boardsPerTitle;
  }

  const handleGroupToggle = (index: number): void => {
    setActiveGroupIndex(prev => prev === index ? 0 : index);
  };

  return (
    <main className='boards'>
      <Breadcrumb />
      <div className='boards-title'>
        <h1>Boards</h1>
        {members && members.length > 0 && (
          members.length > 1 ? (
            <div className='boards-title-count'>{members.length} members</div>
        ) : (
            <div className='boards-title-count'>{members.length} member</div>
        ))}
      </div>
      {isFetchingPages || isFetchingMembers ? (
        <Loader />
      ) : (
        <div className='boards-content'>
          <BoardSidebar groups={getPagesLabels()} activeGroupIndex={activeGroupIndex} onSetActiveGroupCallback={handleGroupToggle} />
          <div className='boards-content-groups'>
            {getBoardsPerTitle().map((boardPerTitle, index) => (
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
                  <div className='boards-content-groups-group-content-description'>
                    <ReactMarkdown>{boardPerTitle.description}</ReactMarkdown>
                  </div>
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
      )}
    </main>
  )
}