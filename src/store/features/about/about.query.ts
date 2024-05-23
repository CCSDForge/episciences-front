import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { IAboutPage } from '../../../types/about'

export const aboutApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_ROOT_ENDPOINT,
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json')

      return headers;
    }
  }),
  reducerPath: 'about',
  tagTypes: ['About'],
  endpoints: (build) => ({
    fetchAboutPage: build.query<IAboutPage | undefined, null>({
      query: () => ({ url: 'pages?page_code=about' }),
      transformResponse(baseQueryReturnValue) {
        const typedBaseQueryReturnValue = baseQueryReturnValue as IAboutPage[]
        return typedBaseQueryReturnValue.length > 0 ? typedBaseQueryReturnValue[0] : undefined
      },
    }),
  }),
})

export const {
  useFetchAboutPageQuery,
} = aboutApi
