import { createApi } from '@reduxjs/toolkit/query/react'

import { IArticle } from '../../../types/article'
import { ISection } from '../../../types/section'
import { AvailableLanguage } from "../../../utils/i18n"
import { PaginatedResponse } from '../../../utils/pagination'
import { createBaseQueryWithLdJsonAccept } from '../../utils'

export const sectionApi = createApi({
  baseQuery: createBaseQueryWithLdJsonAccept,
  reducerPath: 'section',
  tagTypes: ['Section'],
  endpoints: (build) => ({
    fetchSections: build.query<{ data: ISection[], totalItems: number }, { rvcode: string, page: number, itemsPerPage: number, type?: string; }>({
      query: ({ rvcode, page, itemsPerPage, type } :{ rvcode: string, page: number, itemsPerPage: number, type?: string; }) => type ? `sections?page=${page}&itemsPerPage=${itemsPerPage}&rvcode=${rvcode}&year=${type}` : `sections?page=${page}&itemsPerPage=${itemsPerPage}&rvcode=${rvcode}`,
      transformResponse(baseQueryReturnValue: PaginatedResponse<ISection>) {
        const totalItems = baseQueryReturnValue['hydra:totalItems'];
        const formattedData = (baseQueryReturnValue['hydra:member'] as (ISection & { titles?: Record<AvailableLanguage, string>; descriptions?: Record<AvailableLanguage, string>; papers: IArticle[] })[]).map((section) => ({
          ...section,
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
  }),
})

export const {
  useFetchSectionsQuery,
} = sectionApi
