import { createApi } from '@reduxjs/toolkit/query/react'

import { IPage } from '../../../types/page'
import { createBaseQueryWithJsonAccept } from '../../utils'

export const forReviewersApi = createApi({
  baseQuery: createBaseQueryWithJsonAccept,
  reducerPath: 'forReviewers',
  tagTypes: ['ForReviewers'],
  endpoints: (build) => ({
    fetchForReviewersPage: build.query<IPage | undefined, string>({
      query: (rvcode: string) => `pages?page_code=for-reviewers&rvcode=${rvcode}`,
      transformResponse(baseQueryReturnValue: IPage[]) {
        return baseQueryReturnValue.length > 0 ? baseQueryReturnValue[0] : undefined
      },
    }),
  }),
})

export const {
  useFetchForReviewersPageQuery,
} = forReviewersApi