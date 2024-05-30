import { createApi } from '@reduxjs/toolkit/query/react'

import { IVolume } from '../../../types/volume'
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
        return {
          data: baseQueryReturnValue['hydra:member'],
          totalItems: baseQueryReturnValue['hydra:totalItems']
        }
      },
    }),
  }),
})

export const {
  useFetchVolumesQuery,
} = volumeApi
