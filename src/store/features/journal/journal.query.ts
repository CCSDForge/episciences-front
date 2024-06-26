import { createApi } from '@reduxjs/toolkit/query/react'

import { RawJournal, IJournal } from '../../../types/journal'
import { createBaseQueryWithJsonAccept } from '../../utils'

export const journalApi = createApi({
  baseQuery: createBaseQueryWithJsonAccept,
  reducerPath: 'journal',
  tagTypes: ['Journal'],
  endpoints: (build) => ({
    fetchJournals: build.query<IJournal[], null>({
      query: () => 'journals?pagination=false',
      transformResponse(baseQueryReturnValue: RawJournal[]) {
        return baseQueryReturnValue.map((journal) => ({
          ...journal,
          id: journal.rvid
        }))
      },
    }),
  }),
})

export const {
  useFetchJournalsQuery,
} = journalApi
