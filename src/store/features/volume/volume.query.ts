import { createApi } from '@reduxjs/toolkit/query/react'

import { IVolume } from '../../../types/volume'
import { createBaseQuery } from '../../utils'

export const volumeApi = createApi({
  baseQuery: createBaseQuery,
  reducerPath: 'volume',
  tagTypes: ['Volume'],
  endpoints: (build) => ({
    fetchVolumes: build.query<IVolume[], null>({
      query: () => ({ url: 'volumes' }),
      transformResponse(baseQueryReturnValue: { data: IVolume[] }) {
        return baseQueryReturnValue.data
      },
    }),
  }),
})

export const {
  useFetchVolumesQuery,
} = volumeApi
