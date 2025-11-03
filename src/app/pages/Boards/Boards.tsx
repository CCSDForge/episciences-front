import { useState } from 'react';
import ReactMarkdown from 'react-markdown'
import { useTranslation } from 'react-i18next';

import caretUp from '/icons/caret-up-red.svg';
import caretDown from '/icons/caret-down-red.svg';
import { useAppSelector } from "../../../hooks/store";
import { useFetchBoardMembersQuery, useFetchBoardPagesQuery } from '../../../store/features/board/board.query';
import { IBoardMember } from '../../../types/board';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import BoardCard from '../../components/Cards/BoardCard/BoardCard';
import Loader from '../../components/Loader/Loader';
import BoardsSidebar from '../../components/Sidebars/BoardsSidebar/BoardsSidebar';
import './Boards.scss';
import {Helmet} from "react-helmet-async";

interface IBoardPerTitle {
  title: string;
  description: string;
  members: IBoardMember[];
  pageCode: string;
}

export default function Boards(): JSX.Element {
  const { t } = useTranslation();

  const language = useAppSelector(state => state.i18nReducer.language)
  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code)
  const journalName = useAppSelector(state => state.journalReducer.currentJournal?.name)

  const { data: pages, isFetching: isFetchingPages } = useFetchBoardPagesQuery(rvcode!, { skip: !rvcode })
  const { data: members, isFetching: isFetchingMembers } = useFetchBoardMembersQuery(rvcode!, { skip: !rvcode })

  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [fullMemberIndex, setFullMemberIndex] = useState(-1);

  const getPageSortOrder = (pageCode: string): number => {
    const lowerCode = pageCode.toLowerCase();
    if (lowerCode.includes("introduction")) return 1;
    if (lowerCode.includes("editorial")) return 2;
    if (lowerCode.includes("scientific")) return 3;
    if (lowerCode.includes("technical")) return 4;
    if (lowerCode.includes("partners")) return 5;
    if (lowerCode.includes("reviewers")) return 6;
    if (lowerCode.includes("former")) return 7;
    if (lowerCode.includes("operating")) return 999;

    return 500;
  };

  const getPagesLabels = (): string [] => {
    if (!pages || !pages.length) return [];

    const sortedPages = [...pages].sort((a, b) => {
      const orderA = getPageSortOrder(a.page_code);
      const orderB = getPageSortOrder(b.page_code);
      return orderA - orderB;
    });

    return sortedPages.map(page => page.title[language]);
  }

  const getBoardsPerTitle = (): IBoardPerTitle[] => {
    if (!pages || !pages.length) return [];
    if (!members || !members.length) return [];

    const sortedTitles = getPagesLabels();
    const boardsPerTitle: IBoardPerTitle[] = [];

    sortedTitles.forEach(title => {
      const page = pages.find(p => p.title[language] === title);
      if (page) {
        const description = page.content[language];

        const pageMembers = members.filter((member) => {
          const pluralRoles = member.roles.map((role) => `${role}s`)
          return member.roles.includes(page.page_code) || pluralRoles.includes(page.page_code);
        });

        boardsPerTitle.push({
          title: title,
          description: description,
          members: pageMembers,
          pageCode: page.page_code,
        });
      }
    });

    return boardsPerTitle;
  }

  const handleGroupToggle = (index: number): void => {
    setActiveGroupIndex(prev => prev === index ? 0 : index);
  };

  return (
    <main className='boards'>

      <Helmet>
        <title>{t('pages.boards.title')} | {journalName ?? ''}</title>
      </Helmet>

      <Breadcrumb parents={[
        { path: 'home', label: `${t('pages.home.title')} >` }
      ]} crumbLabel={t('pages.boards.title')} />
      <div className='boards-title'>
        <h1 className='boards-title-text'>{t('pages.boards.title')}</h1>
        {members && members.length > 0 && (
          members.length > 1 ? (
            <div className='boards-title-count'>{members.length} {t('common.members')}</div>
        ) : (
            <div className='boards-title-count'>{members.length} {t('common.member')}</div>
        ))}
      </div>
      {isFetchingPages || isFetchingMembers ? (
        <Loader />
      ) : (
        <div className='boards-content'>
          <BoardsSidebar t={t} groups={getPagesLabels()} activeGroupIndex={activeGroupIndex} onSetActiveGroupCallback={handleGroupToggle} />
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
                        language={language}
                        t={t}
                        member={member}
                        currentPageCode={boardPerTitle.pageCode}
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