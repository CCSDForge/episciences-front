export const boardTypes = ['editorial-board', 'technical-board', 'scientific-advisory-board', 'former-members']

// TODO: translate
export const articleTypes: { label: string; value: string; }[] = [
  { label: 'Articles', value: 'article' },
  { label: 'Data papers', value: 'data_paper' },
  { label: 'Software', value: 'software' }
]

// TODO: translate
export const articleSections: { label: string; value: string; }[] = [
  { label: 'Awards', value: 'award' },
  { label: 'Special Issues', value: 'special_issue' },
  { label: 'To be published', value: 'to_be_published' },
  { label: 'Online first', value: 'online_first' },
  { label: 'Varia', value: 'varia' }
]

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