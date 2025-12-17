import { createApi } from '@reduxjs/toolkit/query/react';

import { IPage } from '../../../types/page';
import { createBaseQueryWithJsonAccept } from '../../utils';

export const acknowledgementsApi = createApi({
  baseQuery: createBaseQueryWithJsonAccept,
  reducerPath: 'acknowledgements',
  tagTypes: ['acknowledgements'],
  endpoints: build => ({
    fetchAcknowledgementsPage: build.query<IPage | undefined, string>({
      query: (rvcode: string) =>
        `pages?page_code=journal-acknowledgements&rvcode=${rvcode}`,
      transformResponse(baseQueryReturnValue: IPage[]) {
        return baseQueryReturnValue.length > 0
          ? baseQueryReturnValue[0]
          : undefined;
      },
    }),
  }),
});

export const { useFetchAcknowledgementsPageQuery } = acknowledgementsApi;
