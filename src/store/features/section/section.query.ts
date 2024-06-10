import { createApi } from '@reduxjs/toolkit/query/react'

import { RawSection, ISection } from '../../../types/section'
import { PaginatedResponse } from '../../../utils/pagination'
import { createBaseQueryWithLdJsonAccept } from '../../utils'

export const sectionApi = createApi({
  baseQuery: createBaseQueryWithLdJsonAccept,
  reducerPath: 'section',
  tagTypes: ['Section'],
  endpoints: (build) => ({
    fetchSections: build.query<{ data: ISection[], totalItems: number }, { rvcode: string, page: number, itemsPerPage: number, type?: string; }>({
      query: ({ rvcode, page, itemsPerPage, type } :{ rvcode: string, page: number, itemsPerPage: number, type?: string; }) => type ? `sections?page=${page}&itemsPerPage=${itemsPerPage}&rvcode=${rvcode}&year=${type}` : `sections?page=${page}&itemsPerPage=${itemsPerPage}&rvcode=${rvcode}`,
      transformResponse(baseQueryReturnValue: PaginatedResponse<RawSection>) {
        const totalItems = baseQueryReturnValue['hydra:totalItems'];
        const formattedData = (baseQueryReturnValue['hydra:member']).map((section) => ({
          ...section,
          id: section['sid'],
          title: section['titles'],
          description: section['descriptions'],
          articles: section['papers']
        }))

        return {
          data: formattedData,
          totalItems
        }
      },
    }),
    fetchSection: build.query<ISection, { sid: string }>({
      query: ({ sid } :{ sid: string; }) => `sections/${sid}`,
      transformResponse(baseQueryReturnValue: RawSection) {
        return {
          ...baseQueryReturnValue,
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
