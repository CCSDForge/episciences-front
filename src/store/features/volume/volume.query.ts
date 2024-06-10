import { createApi } from '@reduxjs/toolkit/query/react'

import { RawVolume, IVolume } from '../../../types/volume'
import { PaginatedResponse } from '../../../utils/pagination'
import { createBaseQueryWithLdJsonAccept } from '../../utils'

export const volumeApi = createApi({
  baseQuery: createBaseQueryWithLdJsonAccept,
  reducerPath: 'volume',
  tagTypes: ['Volume'],
  endpoints: (build) => ({
    fetchVolumes: build.query<{ data: IVolume[], totalItems: number }, { rvcode: string, page: number, itemsPerPage: number, year?: number, type?: string; }>({
      query: ({ rvcode, page, itemsPerPage, year, type } :{ rvcode: string, page: number, itemsPerPage: number; year?: number, type?: string; }) => {
        const baseUrl = `volumes?page=${page}&itemsPerPage=${itemsPerPage}&rvcode=${rvcode}`
        let queryParams = '';

        if (type) queryParams += `&type=${type}`;
        
        if (year) queryParams += `&year=${year}`;
        
        return `${baseUrl}${queryParams}`;
      },
      transformResponse(baseQueryReturnValue: PaginatedResponse<RawVolume>) {
        const totalItems = baseQueryReturnValue['hydra:totalItems'];
        const formattedData = (baseQueryReturnValue['hydra:member']).map((volume) => ({
          ...volume,
          id: volume['vid'],
          title: volume['titles'],
          description: volume['descriptions'],
          year: volume['vol_year'],
          types: volume['vol_type'],
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
      transformResponse(baseQueryReturnValue: RawVolume) {
        return {
          ...baseQueryReturnValue,
          title: baseQueryReturnValue['titles'],
          description: baseQueryReturnValue['descriptions'],
          year: baseQueryReturnValue['vol_year'],
          types: baseQueryReturnValue['vol_type'],
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
