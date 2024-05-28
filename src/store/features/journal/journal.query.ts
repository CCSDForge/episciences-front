import { createApi } from '@reduxjs/toolkit/query/react'

import { IJournal } from '../../../types/journal'
import { createBaseQueryWithJsonAccept } from '../../utils'

export const journalApi = createApi({
  baseQuery: createBaseQueryWithJsonAccept,
  reducerPath: 'journal',
  tagTypes: ['Journal'],
  endpoints: (build) => ({
    fetchJournals: build.query<IJournal[], null>({
      query: () => ({ url: 'journals?pagination=false' }),
      transformResponse(baseQueryReturnValue: IJournal[]) {
        return baseQueryReturnValue
      },
    }),
  }),
})

export const {
  useFetchJournalsQuery,
} = journalApi
