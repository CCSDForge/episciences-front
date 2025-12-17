import { createApi } from '@reduxjs/toolkit/query/react';

import { IPage } from '../../../types/page';
import { createBaseQueryWithJsonAccept } from '../../utils';

export const forConferenceOrganisersApi = createApi({
  baseQuery: createBaseQueryWithJsonAccept,
  reducerPath: 'forConferenceOrganisers',
  tagTypes: ['ForConferenceOrganisers'],
  endpoints: build => ({
    fetchForConferenceOrganisersPage: build.query<IPage | undefined, string>({
      query: (rvcode: string) =>
        `pages?page_code=for-conference-organisers&rvcode=${rvcode}`,
      transformResponse(baseQueryReturnValue: IPage[]) {
        return baseQueryReturnValue.length > 0
          ? baseQueryReturnValue[0]
          : undefined;
      },
    }),
  }),
});

export const { useFetchForConferenceOrganisersPageQuery } =
  forConferenceOrganisersApi;
