import { createApi } from '@reduxjs/toolkit/query/react'

import { PartialVolumeArticle } from '../../../types/article'
import { IVolume } from '../../../types/volume'
import { AvailableLanguage } from "../../../utils/i18n"
import { PaginatedResponse } from '../../../utils/pagination'
import { createBaseQueryWithLdJsonAccept } from '../../utils'

export const volumeApi = createApi({
  baseQuery: createBaseQueryWithLdJsonAccept,
  reducerPath: 'volume',
  tagTypes: ['Volume'],
  endpoints: (build) => ({
    fetchVolumes: build.query<{ data: IVolume[], totalItems: number }, { rvcode: string, page: number, itemsPerPage: number, year?: number, type?: string; }>({
      query: ({ rvcode, page, itemsPerPage, year, type } :{ rvcode: string, page: number, itemsPerPage: number; year?: number, type?: string; }) => {
        if (year && type) {
          return `volumes?page=${page}&itemsPerPage=${itemsPerPage}&rvcode=${rvcode}&year=${year}&type=${type}`
        } else if (year) {
          return `volumes?page=${page}&itemsPerPage=${itemsPerPage}&rvcode=${rvcode}&year=${year}`
        } else if (type) {
          return `volumes?page=${page}&itemsPerPage=${itemsPerPage}&rvcode=${rvcode}&type=${type}`
        } else {
          return `volumes?page=${page}&itemsPerPage=${itemsPerPage}&rvcode=${rvcode}`
        }
      },
      transformResponse(baseQueryReturnValue: PaginatedResponse<IVolume>) {
        const totalItems = baseQueryReturnValue['hydra:totalItems'];
        const formattedData = (baseQueryReturnValue['hydra:member'] as (IVolume & { titles?: Record<AvailableLanguage, string>; descriptions?: Record<AvailableLanguage, string>; vol_year?: number; papers: PartialVolumeArticle[] })[]).map((volume) => ({
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
    fetchVolume: build.query<IVolume, { vid: string }>({
      query: ({ vid } :{ vid: string; }) => `volumes/${vid}`,
      transformResponse(baseQueryReturnValue: IVolume & { titles?: Record<AvailableLanguage, string>; descriptions?: Record<AvailableLanguage, string>; vol_year?: number; papers: PartialVolumeArticle[] }) {
        return {
          ...baseQueryReturnValue,
          title: baseQueryReturnValue['titles'],
          description: baseQueryReturnValue['descriptions'],
          year: baseQueryReturnValue['vol_year'],
          articles: baseQueryReturnValue['papers']
        };
      }
    }),
  }),
})

export const {
  useFetchVolumesQuery,
  useFetchVolumeQuery
} = volumeApi
