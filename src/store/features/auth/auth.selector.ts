import type { RootState } from '../../'

export const selectCurrentToken = (state: RootState) => state.authReducer.token