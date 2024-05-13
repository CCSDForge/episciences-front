import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { IVolume } from '../../../types/volume'

export const volumeApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_ROOT_ENDPOINT,
  }),
  reducerPath: 'volume',
  tagTypes: ['Volume'],
  endpoints: (build) => ({
    fetchVolumes: build.query<IVolume[], null>({
      query: () => ({ url: 'volumes' }),
      transformResponse(baseQueryReturnValue) {
        return (baseQueryReturnValue as { data: IVolume[] }).data
      },
    }),
  }),
})

export const {
  useFetchVolumesQuery,
} = volumeApi
