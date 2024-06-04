import type { RootState } from '../..'

export const selectEditorialWorkflowPage = (state: RootState) => state.forAuthorReducer.editorialWorkflow

export const selectEthicalCharterPage = (state: RootState) => state.forAuthorReducer.ethicalCharter

export const selectPrepareSubmissionPage = (state: RootState) => state.forAuthorReducer.prepareSubmission