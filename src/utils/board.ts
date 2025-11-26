import { TFunction } from 'i18next';
import { IBoardMember, BoardPage } from '../types/board';

export enum BOARD_TYPE {
  INTRODUCTION_BOARD = 'introduction-board',
  EDITORIAL_BOARD = 'editorial-board',
  TECHNICAL_BOARD = 'technical-board',
  SCIENTIFIC_ADVISORY_BOARD = 'scientific-advisory-board',
  REVIEWERS_BOARD = 'reviewers-board',
  FORMER_MEMBERS = 'former-members',
  OPERATING_CHARTER_BOARD = 'operating-charter-board'
}
//Define the sort order for board types - order in array determines display order"
export const boardTypes = [
  BOARD_TYPE.INTRODUCTION_BOARD,
  BOARD_TYPE.SCIENTIFIC_ADVISORY_BOARD,
  BOARD_TYPE.EDITORIAL_BOARD,
  BOARD_TYPE.TECHNICAL_BOARD,
  BOARD_TYPE.REVIEWERS_BOARD,
  BOARD_TYPE.FORMER_MEMBERS,
  BOARD_TYPE.OPERATING_CHARTER_BOARD,
]

// Define the sort order for board types based on boardTypes array
const getBoardTypeSortOrder = (boardType: BOARD_TYPE): number => {
  const index = boardTypes.indexOf(boardType);
  return index !== -1 ? index + 1 : 999;
};

/*
 * Sort board pages by defined type order
 * @param pages - Array of board pages to sort
 * @returns Sorted array of board pages
 */
export const sortBoardPages = (pages: BoardPage[]): BoardPage[] => {
  return [...pages].sort((a, b) => {
    const orderA = getBoardTypeSortOrder(a.page_code as BOARD_TYPE);
    const orderB = getBoardTypeSortOrder(b.page_code as BOARD_TYPE);
    return orderA - orderB;
  });
};

export enum BOARD_ROLE {
  MEMBER = 'member',
  GUEST_EDITOR = 'guest-editor',
  EDITOR = 'editor',
  CHIEF_EDITOR = 'chief-editor',
  SECRETARY = 'secretary',
  FORMER_MEMBER = 'former-member',
  ADVISORY_BOARD = 'advisory-board',
  MANAGING_EDITOR = 'managing-editor',
  HANDLING_EDITOR = 'handling-editor'
}

export const defaultBoardRole = (t: TFunction<"translation", undefined>) => {
  return {
    key: BOARD_ROLE.MEMBER,
    label: t('pages.boards.roles.member')
  }
}

export const getBoardRoles = (t: TFunction<"translation", undefined>, roles: string[]): string => {
  const rolesWithLabels = [
    { key: BOARD_TYPE.TECHNICAL_BOARD, label: t('pages.boards.types.technicalBoard') },
    { key: BOARD_TYPE.EDITORIAL_BOARD, label: t('pages.boards.types.editorialBoard') },
    { key: BOARD_TYPE.SCIENTIFIC_ADVISORY_BOARD, label: t('pages.boards.types.scientificAdvisoryBoard') },
    { key: BOARD_TYPE.FORMER_MEMBERS, label: t('pages.boards.types.formerMember') },
    { key: BOARD_ROLE.GUEST_EDITOR, label: t('pages.boards.roles.guestEditor') },
    { key: BOARD_ROLE.EDITOR, label: t('pages.boards.roles.editor') },
    { key: BOARD_ROLE.CHIEF_EDITOR, label: t('pages.boards.roles.chiefEditor') },
    { key: BOARD_ROLE.SECRETARY, label: t('pages.boards.roles.secretary') },
    { key: BOARD_ROLE.FORMER_MEMBER, label: t('pages.boards.roles.formerMember') },
    { key: BOARD_ROLE.ADVISORY_BOARD, label: t('pages.boards.roles.advisoryBoard') },
    { key: BOARD_ROLE.MANAGING_EDITOR, label: t('pages.boards.roles.managingEditor') },
    { key: BOARD_ROLE.HANDLING_EDITOR, label: t('pages.boards.roles.handlingEditor') }

  ]

  return rolesWithLabels.filter(roleWithLabel => roles.includes(roleWithLabel.key)).map(roleWithLabel => roleWithLabel.label).join(', ')
}

/**
 * Sort board members by role priority, then by lastname, then by firstname
 * Priority order: chief-editor (1), managing-editor (2), editor (3), others (4)
 * @param members - Array of board members to sort
 * @returns Sorted array of board members
 */
export const sortBoardMembers = (members: IBoardMember[]): IBoardMember[] => {
  return [...members].sort((a, b) => {
    // Helper function to get role priority
    const getRolePriority = (roles: string[]): number => {
      if (roles.includes(BOARD_ROLE.CHIEF_EDITOR)) return 1;
      if (roles.includes(BOARD_ROLE.MANAGING_EDITOR)) return 2;
      if (roles.includes(BOARD_ROLE.EDITOR)) return 3;
      return 4;
    };

    // Compare by role priority first
    const rolePriorityA = getRolePriority(a.roles);
    const rolePriorityB = getRolePriority(b.roles);

    if (rolePriorityA !== rolePriorityB) {
      return rolePriorityA - rolePriorityB;
    }

    // If same role priority, compare by lastname
    const lastnameCompare = a.lastname.localeCompare(b.lastname, 'fr', { sensitivity: 'base' });
    if (lastnameCompare !== 0) {
      return lastnameCompare;
    }

    // If same lastname, compare by firstname
    return a.firstname.localeCompare(b.firstname, 'fr', { sensitivity: 'base' });
  });
}