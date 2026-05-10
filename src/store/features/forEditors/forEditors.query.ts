import { createApi } from '@reduxjs/toolkit/query/react';

import { IPage } from '../../../types/page';
import { createBaseQueryWithJsonAccept } from '../../utils';

export const forEditorsApi = createApi({
  baseQuery: createBaseQueryWithJsonAccept,
  reducerPath: 'forEditors',
  tagTypes: ['ForEditors'],
  endpoints: build => ({
    fetchForEditorsPage: build.query<IPage | undefined, string>({
      query: (rvcode: string) =>
        `pages?page_code=for-editors&rvcode=${rvcode}`,
      transformResponse(baseQueryReturnValue: IPage[]) {
        return baseQueryReturnValue.length > 0
          ? baseQueryReturnValue[0]
          : undefined;
      },
    }),
  }),
});

export const { useFetchForEditorsPageQuery } = forEditorsApi;
