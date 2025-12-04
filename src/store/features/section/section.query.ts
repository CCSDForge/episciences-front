import { createApi } from '@reduxjs/toolkit/query/react'

import { RawSection, ISection } from '../../../types/section'
import { PaginatedResponseWithCount } from '../../../utils/pagination'
import { createBaseQueryWithLdJsonAccept } from '../../utils'

export const sectionApi = createApi({
  baseQuery: createBaseQueryWithLdJsonAccept,
  reducerPath: 'section',
  tagTypes: ['Section'],
  endpoints: (build) => ({
    fetchSections: build.query<{ data: ISection[], totalItems: number, articlesCount?: number }, { rvcode: string, page: number, itemsPerPage: number }>({
      query: ({ rvcode, page, itemsPerPage } :{ rvcode: string, page: number, itemsPerPage: number }) => `sections?page=${page}&itemsPerPage=${itemsPerPage}&rvcode=${rvcode}`,
      transformResponse(baseQueryReturnValue: PaginatedResponseWithCount<RawSection>, _, { rvcode }) {
        const articlesCount = baseQueryReturnValue['hydra:totalPublishedArticles']

        const totalItems = baseQueryReturnValue['hydra:totalItems'];
        const formattedData = (baseQueryReturnValue['hydra:member']).map((section) => ({
          ...section,
          id: section['sid'],
          rvid: section['rvid'],
          rvcode: rvcode,
          title: section['titles'],
          description: section['descriptions'],
          articles: section['papers']
        }))

        return {
          data: formattedData,
          totalItems,
          articlesCount
        }
      },
    }),
    fetchSection: build.query<ISection, { sid: string, rvcode: string }>({
      query: ({ sid, rvcode } :{ sid: string; rvcode: string; }) => `sections/${sid}?rvcode=${rvcode}`,
      transformResponse(baseQueryReturnValue: RawSection, _, { rvcode }) {
        return {
          ...baseQueryReturnValue,
          id: baseQueryReturnValue['sid'],
          rvid: baseQueryReturnValue['rvid'],
          rvcode: rvcode,
          title: baseQueryReturnValue['titles'],
          description: baseQueryReturnValue['descriptions'],
          articles: baseQueryReturnValue['papers']
        };
      }
    }),
  }),
})

export const {
  useFetchSectionsQuery,
  useFetchSectionQuery
} = sectionApi
