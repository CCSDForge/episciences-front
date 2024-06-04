import { createApi } from '@reduxjs/toolkit/query/react'

import { IPage } from '../../../types/page'
import { createBaseQueryWithJsonAccept } from '../../utils'

export const forAuthorApi = createApi({
  baseQuery: createBaseQueryWithJsonAccept,
  reducerPath: 'forAuthor',
  tagTypes: ['For author'],
  endpoints: (build) => ({
    fetchEditorialWorkflowPage: build.query<IPage | undefined, string>({
      query: (rvcode: string) => `pages?page_code=editorial-workflow&rvcode=${rvcode}`,
      transformResponse(baseQueryReturnValue: IPage[]) {
        return baseQueryReturnValue.length > 0 ? baseQueryReturnValue[0] : undefined
      },
    }),
    fetchEthicalCharterPage: build.query<IPage | undefined, string>({
      query: (rvcode: string) => `pages?page_code=ethical-charter&rvcode=${rvcode}`,
      transformResponse(baseQueryReturnValue: IPage[]) {
        return baseQueryReturnValue.length > 0 ? baseQueryReturnValue[0] : undefined
      },
    }),
    fetchPrepareSubmissionPage: build.query<IPage | undefined, string>({
      query: (rvcode: string) => `pages?page_code=prepare-submission&rvcode=${rvcode}`,
      transformResponse(baseQueryReturnValue: IPage[]) {
        return baseQueryReturnValue.length > 0 ? baseQueryReturnValue[0] : undefined
      },
    }),
  }),
})

export const {
  useFetchEditorialWorkflowPageQuery,
  useFetchEthicalCharterPageQuery,
  useFetchPrepareSubmissionPageQuery
} = forAuthorApi
