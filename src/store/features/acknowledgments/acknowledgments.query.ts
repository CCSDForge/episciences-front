import { createApi } from '@reduxjs/toolkit/query/react'

import { IPage } from '../../../types/page'
import { createBaseQueryWithJsonAccept } from '../../utils'

export const acknowledgmentsApi = createApi({
  baseQuery: createBaseQueryWithJsonAccept,
  reducerPath: 'acknowledgments',
  tagTypes: ['acknowledgments'],
  endpoints: (build) => ({
    fetchAcknowledgmentsPage: build.query<IPage | undefined, string>({
      query: (rvcode: string) => `pages?page_code=journal-acknowledgments&rvcode=${rvcode}`,
      transformResponse(baseQueryReturnValue: IPage[]) {
        return baseQueryReturnValue.length > 0 ? baseQueryReturnValue[0] : undefined
      },
    }),
  }),
})

export const {
  useFetchAcknowledgmentsPageQuery,
} = acknowledgmentsApi