import { createApi } from '@reduxjs/toolkit/query/react'

import { RawVolume, IVolume } from '../../../types/volume'
import { AvailableLanguage } from '../../../utils/i18n'
import { PaginatedResponseWithCount, Range } from '../../../utils/pagination'
import { formatVolume } from '../../../utils/volume'
import { createBaseQueryWithLdJsonAccept } from '../../utils'

export const volumeApi = createApi({
  baseQuery: createBaseQueryWithLdJsonAccept,
  reducerPath: 'volume',
  tagTypes: ['Volume'],
  endpoints: (build) => ({
    fetchVolumes: build.query<{ data: IVolume[], totalItems: number, articlesCount?: number, range?: Range }, { rvcode: string, language: AvailableLanguage, page: number, itemsPerPage: number, years?: number[], types?: string[] }>({
      query: ({ rvcode, page, itemsPerPage, years, types } :{ rvcode: string, page: number, itemsPerPage: number; years?: number[]; types?: string[]; }) => {
        const baseUrl = `volumes?page=${page}&itemsPerPage=${itemsPerPage}&rvcode=${rvcode}`
        let queryParams = '';

        if (types && types.length > 0) {
          const typesQuery = types.map(type => `type[]=${type}`).join('&')
          queryParams += `&${typesQuery}`;
        }
        
        if (years && years.length > 0) {
          const yearsQuery = years.map(year => `year[]=${year}`).join('&')
          queryParams += `&${yearsQuery}`;
        }
        
        return `${baseUrl}${queryParams}`;
      },
      transformResponse(baseQueryReturnValue: PaginatedResponseWithCount<RawVolume>, _, { rvcode, language }) {
        const articlesCount = baseQueryReturnValue['hydra:totalPublishedArticles']
        const range = (baseQueryReturnValue['hydra:range'] as { year: number[] });

        const totalItems = baseQueryReturnValue['hydra:totalItems'];
        const formattedData = (baseQueryReturnValue['hydra:member']).map((volume) => formatVolume(rvcode, language, volume))

        return {
          data: formattedData,
          totalItems,
          articlesCount,
          range: {
            ...range,
            years: range.year
          }
        }
      },
    }),
    fetchVolume: build.query<IVolume, { rvcode: string; vid: string; language: AvailableLanguage }>({
      query: ({ vid, rvcode } :{ vid: string; rvcode: string }) => `volumes/${vid}?rvcode=${rvcode}`,
      transformResponse(baseQueryReturnValue: RawVolume, _, { rvcode, language }) {
        return formatVolume(rvcode, language, baseQueryReturnValue);
      }
    }),
  }),
})

export const {
  useFetchVolumesQuery,
  useFetchVolumeQuery,
} = volumeApi
