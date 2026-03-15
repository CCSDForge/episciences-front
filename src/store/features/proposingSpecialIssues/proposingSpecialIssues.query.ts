import { createApi } from '@reduxjs/toolkit/query/react';

import { IPage } from '../../../types/page';
import { createBaseQueryWithJsonAccept } from '../../utils';

export const proposingSpecialIssuesApi = createApi({
  baseQuery: createBaseQueryWithJsonAccept,
  reducerPath: 'proposingSpecialIssues',
  tagTypes: ['ProposingSpecialIssues'],
  endpoints: build => ({
    fetchProposingSpecialIssuesPage: build.query<IPage | undefined, string>({
      query: (rvcode: string) =>
        `pages?page_code=proposing-special-issues&rvcode=${rvcode}`,
      transformResponse(baseQueryReturnValue: IPage[]) {
        return baseQueryReturnValue.length > 0
          ? baseQueryReturnValue[0]
          : undefined;
      },
    }),
  }),
});

export const { useFetchProposingSpecialIssuesPageQuery } =
  proposingSpecialIssuesApi;
