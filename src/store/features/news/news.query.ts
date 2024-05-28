import { createApi } from '@reduxjs/toolkit/query/react'

import { INews } from '../../../types/news'
import { PaginatedResponse } from '../../../utils/pagination'
import { createBaseQueryWithLdJsonAccept } from '../../utils'

export const newsApi = createApi({
  baseQuery: createBaseQueryWithLdJsonAccept,
  reducerPath: 'news',
  tagTypes: ['News'],
  endpoints: (build) => ({
    fetchNews: build.query<{ data: INews[], totalItems: number }, { rvcode: string, page: number }>({
      query: ({ rvcode, page } :{ rvcode: string, page: number }) => ({ url: `news?page=${page}&rvcode=${rvcode}` }),
      transformResponse(baseQueryReturnValue: PaginatedResponse<INews>) {
        const totalItems = baseQueryReturnValue['hydra:totalItems'];
        const formattedData = (baseQueryReturnValue['hydra:member'] as (INews & { date_creation: string; creator: { screenName: string; }})[]).map((news) => ({
          ...news,
          publicationDate: news['date_creation'],
          author: news['creator']['screenName']
        }))

        return {
          data: formattedData,
          totalItems
        }
      },
    }),
  }),
})

export const {
  useFetchNewsQuery,
} = newsApi
