import type { RootState } from '../..'

export const selectBoardsPages = (state: RootState) => state.boardReducer.pages

export const selectBoardsMembers = (state: RootState) => state.boardReducer.members