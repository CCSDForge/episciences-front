import { createApi } from '@reduxjs/toolkit/query/react'

import { RawNews, INews } from '../../../types/news'
import { PaginatedResponse } from '../../../utils/pagination'
import { createBaseQueryWithLdJsonAccept } from '../../utils'

export const newsApi = createApi({
  baseQuery: createBaseQueryWithLdJsonAccept,
  reducerPath: 'news',
  tagTypes: ['News'],
  endpoints: (build) => ({
    fetchNews: build.query<{ data: INews[], totalItems: number }, { rvcode: string, page: number, itemsPerPage: number; years: number[] }>({
      query: ({ rvcode, page, itemsPerPage, years } :{ rvcode: string, page: number, itemsPerPage: number; years: number[] }) => {
        if (years && years.length > 0) {
          const yearsQuery = years.map(year => `year[]=${year}`).join('&')
          return `news?page=${page}&itemsPerPage=${itemsPerPage}&rvcode=${rvcode}&${yearsQuery}`
         }
         
        return `news?page=${page}&itemsPerPage=${itemsPerPage}&rvcode=${rvcode}`
      },
      transformResponse(baseQueryReturnValue: PaginatedResponse<RawNews>) {
        const totalItems = baseQueryReturnValue['hydra:totalItems'];
        const formattedData = (baseQueryReturnValue['hydra:member']).map((news) => ({
          ...news,
          publicationDate: news['date_creation'],
          author: news['creator']['screenName'],
          link: news['link'] ? news['link']['und'] : undefined
        }))

        return {
          data: formattedData,
          totalItems
        }
      },
    }),
    fetchNewsRange: build.query<number[], { rvcode: string }>({
      query: ({ rvcode } :{ rvcode: string }) => `news-range?rvcode=${rvcode}`,
      transformResponse(baseQueryReturnValue: { years: number[] }) {
        return baseQueryReturnValue.years;
      },
    }),
  }),
})

export const {
  useFetchNewsQuery,
  useFetchNewsRangeQuery
} = newsApi
