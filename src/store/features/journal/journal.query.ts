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
      transformResponse(baseQueryReturnValue) {
        return baseQueryReturnValue as IJournal[]
      },
    }),
  }),
})

export const {
  useFetchJournalsQuery,
} = journalApi
