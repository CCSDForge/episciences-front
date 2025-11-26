import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown'
import { useTranslation } from 'react-i18next';

import caretUp from '/icons/caret-up-red.svg';
import caretDown from '/icons/caret-down-red.svg';
import { useAppSelector } from "../../../hooks/store";
import { useFetchBoardMembersQuery, useFetchBoardPagesQuery } from '../../../store/features/board/board.query';
import { IBoardMember } from '../../../types/board';
import { sortBoardPages } from '../../../utils/board';
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

  const [openPanels, setOpenPanels] = useState<number[]>([0]);
  const [fullMemberIndex, setFullMemberIndex] = useState(-1);

  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const getPagesLabels = (): string [] => {
    if (!pages || !pages.length) return [];
    return sortBoardPages(pages).map(page => page.title[language]);
  }

  const getBoardsPerTitle = (): IBoardPerTitle[] => {
    if (!pages || !pages.length) return [];
    if (!members || !members.length) return [];

    return sortBoardPages(pages).map(page => {
      const pageMembers = members.filter((member) => {
        const pluralRoles = member.roles.map((role) => `${role}s`)
        const hasMatchingRole = member.roles.includes(page.page_code) || pluralRoles.includes(page.page_code);

        // Include advisory-board in scientific-advisory-board
        const isScientificAdvisoryBoard = page.page_code === 'scientific-advisory-board';
        const hasAdvisoryBoardRole = member.roles.includes('advisory-board');

        // Include managing-editor and handling-editor in editorial-board
        const isEditorialBoard = page.page_code === 'editorial-board';
        const hasManagingOrHandlingRole = member.roles.includes('managing-editor') || member.roles.includes('handling-editor');

        return hasMatchingRole || (isScientificAdvisoryBoard && hasAdvisoryBoardRole) || (isEditorialBoard && hasManagingOrHandlingRole);
      });

      return {
        title: page.title[language],
        description: page.content[language],
        members: pageMembers,
        pageCode: page.page_code,
      };
    });
  }

  const handleGroupToggle = (index: number): void => {
    setOpenPanels(prev => {
      if (prev.includes(index)) {
        // Retirer le panel du tableau s'il est déjà ouvert
        return prev.filter(i => i !== index);
      } else {
        // Ajouter le panel au tableau s'il est fermé
        return [...prev, index];
      }
    });

    // Scroller vers le panel après un léger délai pour laisser l'animation d'ouverture se faire
    setTimeout(() => {
      panelRefs.current[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleSidebarClick = (index: number): void => {
    // Ouvrir le panel s'il est fermé, ne rien faire s'il est déjà ouvert
    setOpenPanels(prev => {
      if (!prev.includes(index)) {
        return [...prev, index];
      }
      return prev;
    });

    // Toujours scroller vers le panel
    setTimeout(() => {
      panelRefs.current[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
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
          <BoardsSidebar t={t} groups={getPagesLabels()} openPanels={openPanels} onSetActiveGroupCallback={handleSidebarClick} />
          <div className='boards-content-groups'>
            {getBoardsPerTitle().map((boardPerTitle, index) => (
              <div key={index} className='boards-content-groups-group' ref={(el): void => { panelRefs.current[index] = el; }}>
                <div className='boards-content-groups-group-title' onClick={(): void => handleGroupToggle(index)}>
                  <h2>{boardPerTitle.title}</h2>
                  {openPanels.includes(index) ? (
                    <img className='boards-content-groups-group-caret' src={caretUp} alt='Caret up icon' />
                  ) : (
                    <img className='boards-content-groups-group-caret' src={caretDown} alt='Caret down icon' />
                  )}
                </div>
                <div className={`boards-content-groups-group-content ${openPanels.includes(index) && 'boards-content-groups-group-content-active'}`}>
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