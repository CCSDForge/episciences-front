import { createApi } from '@reduxjs/toolkit/query/react'

import { IArticle } from '../../../types/article'
import { IVolume } from '../../../types/volume'
import { AvailableLanguage } from "../../../utils/i18n"
import { PaginatedResponse } from '../../../utils/pagination'
import { createBaseQueryWithLdJsonAccept } from '../../utils'

export const volumeApi = createApi({
  baseQuery: createBaseQueryWithLdJsonAccept,
  reducerPath: 'volume',
  tagTypes: ['Volume'],
  endpoints: (build) => ({
    fetchVolumes: build.query<{ data: IVolume[], totalItems: number }, { rvcode: string, page: number, year?: number, type?: string; }>({
      query: ({ rvcode, page, year, type } :{ rvcode: string, page: number, year?: number, type?: string; }) => {
        if (year && type) {
          return `volumes?page=${page}&rvcode=${rvcode}&year=${year}&type=${type}`
        } else if (year) {
          return `volumes?page=${page}&rvcode=${rvcode}&year=${year}`
        } else if (type) {
          return `volumes?page=${page}&rvcode=${rvcode}&type=${type}`
        } else {
          return `volumes?page=${page}&rvcode=${rvcode}`
        }
      },
      transformResponse(baseQueryReturnValue: PaginatedResponse<IVolume>) {
        const totalItems = baseQueryReturnValue['hydra:totalItems'];
        const formattedData = (baseQueryReturnValue['hydra:member'] as (IVolume & { titles?: Record<AvailableLanguage, string>; descriptions?: Record<AvailableLanguage, string>; vol_year?: number; papers: IArticle[] })[]).map((volume) => ({
          ...volume,
          title: volume['titles'],
          description: volume['descriptions'],
          year: volume['vol_year'],
          articles: volume['papers']
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
  useFetchVolumesQuery,
} = volumeApi
