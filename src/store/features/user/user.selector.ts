import type { RootState } from '../../'

export const selectCurrentUser = (state: RootState) => state.userReducer.user