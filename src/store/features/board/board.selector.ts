import type { RootState } from '../..'

export const selectBoardsDescriptions = (state: RootState) => state.boardReducer.descriptions

export const selectBoardsMembers = (state: RootState) => state.boardReducer.members