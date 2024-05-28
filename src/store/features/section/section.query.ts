import { createApi } from '@reduxjs/toolkit/query/react'

import { ISection } from '../../../types/section'
import { createBaseQuery } from '../../utils'

export const sectionApi = createApi({
  baseQuery: createBaseQuery,
  reducerPath: 'section',
  tagTypes: ['Section'],
  endpoints: (build) => ({
    fetchSections: build.query<ISection[], null>({
      query: () => ({ url: 'sections' }),
      transformResponse(baseQueryReturnValue: { data: ISection[] }) {
        return baseQueryReturnValue.data
      },
    }),
  }),
})

export const {
  useFetchSectionsQuery,
} = sectionApi
