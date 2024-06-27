import { createApi } from '@reduxjs/toolkit/query/react'

import { RawVolume, IVolume } from '../../../types/volume'
import { PaginatedResponse } from '../../../utils/pagination'
import { formatVolume } from '../../../utils/volume'
import { createBaseQueryWithLdJsonAccept } from '../../utils'

export const volumeApi = createApi({
  baseQuery: createBaseQueryWithLdJsonAccept,
  reducerPath: 'volume',
  tagTypes: ['Volume'],
  endpoints: (build) => ({
    fetchVolumes: build.query<{ data: IVolume[], totalItems: number }, { rvid: number, page: number, itemsPerPage: number, years: number[], types: string[] }>({
      query: ({ rvid, page, itemsPerPage, years, types } :{ rvid: number, page: number, itemsPerPage: number; years: number[]; types: string[]; }) => {
        const baseUrl = `volumes?page=${page}&itemsPerPage=${itemsPerPage}&rvid=${rvid}`
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
      transformResponse(baseQueryReturnValue: PaginatedResponse<RawVolume>) {
        const totalItems = baseQueryReturnValue['hydra:totalItems'];
        const formattedData = (baseQueryReturnValue['hydra:member']).map((volume) => formatVolume(volume))

        return {
          data: formattedData,
          totalItems
        }
      },
    }),
    fetchVolumesRange: build.query<{ years: number[], types: string[] }, { rvcode: string }>({
      query: ({ rvcode } :{ rvcode: string }) => `volumes-range?rvcode=${rvcode}`,
      transformResponse(baseQueryReturnValue: { years: number[], types: string[] }) {
        return baseQueryReturnValue;
      },
    }),
    fetchVolume: build.query<IVolume, { vid: string }>({
      query: ({ vid } :{ vid: string; }) => `volumes/${vid}`,
      transformResponse(baseQueryReturnValue: RawVolume) {
        return formatVolume(baseQueryReturnValue);
      }
    }),
  }),
})

export const {
  useFetchVolumesQuery,
  useFetchVolumesRangeQuery,
  useFetchVolumeQuery,
} = volumeApi
