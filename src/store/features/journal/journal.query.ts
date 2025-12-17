import { createApi } from '@reduxjs/toolkit/query/react';

import { RawJournal, IJournal } from '../../../types/journal';
import { createBaseQueryWithJsonAccept } from '../../utils';

export const journalApi = createApi({
  baseQuery: createBaseQueryWithJsonAccept,
  reducerPath: 'journal',
  tagTypes: ['Journal'],
  endpoints: build => ({
    fetchJournal: build.query<IJournal, string>({
      query: (rvcode: string) => `journals/${rvcode}`,
      transformResponse(baseQueryReturnValue: RawJournal) {
        return {
          ...baseQueryReturnValue,
          id: baseQueryReturnValue.rvid,
          rvid: baseQueryReturnValue.rvid,
        };
      },
    }),
  }),
});

export const { useFetchJournalQuery } = journalApi;
