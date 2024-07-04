export enum BOARD_TYPE {
  EDITORIAL_BOARD = 'editorial-board',
  TECHNICAL_BOARD = 'technical-board',
  SCIENTIFIC_ADVISORY_BOARD = 'scientific-advisory-board',
  FORMER_MEMBERS = 'former-members'
}

export const boardTypes = [
  BOARD_TYPE.EDITORIAL_BOARD,
  BOARD_TYPE.TECHNICAL_BOARD,
  BOARD_TYPE.SCIENTIFIC_ADVISORY_BOARD,
  BOARD_TYPE.FORMER_MEMBERS
]

export enum BOARD_ROLE {
  MEMBER = 'member',
  GUEST_EDITOR = 'guest-editor',
  EDITOR = 'editor',
  CHIEF_EDITOR = 'chief-editor',
  SECRETARY = 'secretary'
}

// TODO: translate
export const defaultBoardRole = {
  key: BOARD_ROLE.MEMBER,
  label: 'Member'
}

// TODO: translate
export const getBoardRoles = (roles: string[]): string => {

  const rolesWithLabels = [
    { key: BOARD_TYPE.TECHNICAL_BOARD, label: 'Technical board' },
    { key: BOARD_TYPE.EDITORIAL_BOARD, label: 'Editorial board' },
    { key: BOARD_TYPE.SCIENTIFIC_ADVISORY_BOARD, label: 'Scientific board' },
    { key: BOARD_TYPE.FORMER_MEMBERS, label: 'Former member' },
    { key: BOARD_ROLE.GUEST_EDITOR, label: 'Guest editor' },
    { key: BOARD_ROLE.EDITOR, label: 'Editor' },
    { key: BOARD_ROLE.CHIEF_EDITOR, label: 'Chief editor' },
    { key: BOARD_ROLE.SECRETARY, label: 'Secretary' }
  ]

  return rolesWithLabels.filter(roleWithLabel => roles.includes(roleWithLabel.key)).map(roleWithLabel => roleWithLabel.label).join(', ')
}