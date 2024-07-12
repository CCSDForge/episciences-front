import { createApi } from '@reduxjs/toolkit/query/react'

import { IStat } from '../../../types/stat'
import { PaginatedResponseWithRange, Range } from '../../../utils/pagination'
import { createBaseQueryWithLdJsonAccept } from '../../utils'

export const statApi = createApi({
  baseQuery: createBaseQueryWithLdJsonAccept,
  reducerPath: 'stat',
  tagTypes: ['Stat'],
  endpoints: (build) => ({
    fetchStats: build.query<{ data: IStat[], totalItems: number, range?: Range }, { rvcode: string, page: number, itemsPerPage: number }>({
      query: ({ rvcode, page, itemsPerPage } :{ rvcode: string, page: number, itemsPerPage: number; }) => `statistics?page=${page}&itemsPerPage=${itemsPerPage}&rvcode=${rvcode}`,
      transformResponse: (baseQueryReturnValue: PaginatedResponseWithRange<IStat>) => {
        return {
          data: baseQueryReturnValue['hydra:member'],
          totalItems: baseQueryReturnValue['hydra:totalItems'],
          range: baseQueryReturnValue['hydra:range'],
        }
      },
    }),
  }),
})

export const {
  useFetchStatsQuery,
} = statApi
