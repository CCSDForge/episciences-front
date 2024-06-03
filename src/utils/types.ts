export const boardTypes = ['editorial-board', 'technical-board', 'scientific-advisory-board', 'former-members']

// TODO: translate
export const volumeTypes: { label: string; value: string; }[] = [
  { label: 'Volumes', value: 'volume' },
  { label: 'Special Issues', value: 'special_issue' },
  { label: 'Proceedings', value: 'proceeding' }
]

//TODO: translate
export const sectionTypes: { label: string; value: string; }[] = [
  { label: 'Compte-rendus', value: 'report' },
  { label: 'Book reviews', value: 'book_review' },
  { label: 'Proceedings', value: 'proceeding' },
  { label: 'Varia', value: 'varia' },
  { label: 'Symposium', value: 'symposium' }
]

export const defaultBoardRole = { key: 'member', label: 'Member' }

// TODO: translate
export const getBoardRole = (roleKey: string): string => {
  const roles = [
    { key: 'author', label: 'Author' },
    { key: 'reviewer', label: 'Reviewer' },
  ]

  return roles.find(role => role.key === roleKey)?.label ?? defaultBoardRole.label
}