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
  { label: 'Proceedings', value: 'proceedings' }
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
export const getBoardRoles = (roles: string[]): string => {

  const rolesWithLabels = [
    { key: 'technical-board', label: 'Technical board' },
    { key: 'editorial-board', label: 'Editorial board' },
    { key: 'scientific-board', label: 'Scientific board' },
    { key: 'former-member', label: 'Former member' },
    { key: 'guest-editor', label: 'Guest editor' },
    { key: 'editor', label: 'Editor' },
    { key: 'chief-editor', label: 'Chief editor' },
    { key: 'secretary', label: 'Secretary' }
  ]

  return rolesWithLabels.filter(roleWithLabel => roles.includes(roleWithLabel.key)).map(roleWithLabel => roleWithLabel.label).join(', ')
}