import { createApi } from '@reduxjs/toolkit/query/react'

import { ISection } from '../../../types/section'
import { PaginatedResponse } from '../../../utils/pagination'
import { createBaseQueryWithLdJsonAccept } from '../../utils'

export const sectionApi = createApi({
  baseQuery: createBaseQueryWithLdJsonAccept,
  reducerPath: 'section',
  tagTypes: ['Section'],
  endpoints: (build) => ({
    fetchSections: build.query<{ data: ISection[], totalItems: number }, { rvcode: string, page: number }>({
      query: ({ rvcode, page } :{ rvcode: string, page: number }) => `sections?page=${page}&rvcode=${rvcode}`,
      transformResponse(baseQueryReturnValue: PaginatedResponse<ISection>) {
        return {
          data: baseQueryReturnValue['hydra:member'],
          totalItems: baseQueryReturnValue['hydra:totalItems']
        }
      },
    }),
  }),
})

export const {
  useFetchSectionsQuery,
} = sectionApi
