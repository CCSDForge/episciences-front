import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { ISection } from '../../../types/section'

export const sectionApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_ROOT_ENDPOINT,
  }),
  reducerPath: 'section',
  tagTypes: ['Section'],
  endpoints: (build) => ({
    fetchSections: build.query<ISection[], null>({
      query: () => ({ url: 'sections' }),
      transformResponse(baseQueryReturnValue) {
        return (baseQueryReturnValue as { data: ISection[] }).data
      },
    }),
  }),
})

export const {
  useFetchSectionsQuery,
} = sectionApi
