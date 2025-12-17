import { createApi } from '@reduxjs/toolkit/query/react';

import { IPage } from '../../../types/page';
import { createBaseQueryWithJsonAccept } from '../../utils';

export const ethicalCharterApi = createApi({
  baseQuery: createBaseQueryWithJsonAccept,
  reducerPath: 'ethicalCharter',
  tagTypes: ['EthicalCharter'],
  endpoints: build => ({
    fetchEthicalCharterPage: build.query<IPage | undefined, string>({
      query: (rvcode: string) =>
        `pages?page_code=ethical-charter&rvcode=${rvcode}`,
      transformResponse(baseQueryReturnValue: IPage[]) {
        return baseQueryReturnValue.length > 0
          ? baseQueryReturnValue[0]
          : undefined;
      },
    }),
  }),
});

export const { useFetchEthicalCharterPageQuery } = ethicalCharterApi;
