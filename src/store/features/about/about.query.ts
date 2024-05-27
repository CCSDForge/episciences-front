import { createApi } from '@reduxjs/toolkit/query/react'

import { IAboutPage } from '../../../types/about'
import { createBaseQueryWithJsonAccept } from '../../utils'

export const aboutApi = createApi({
  baseQuery: createBaseQueryWithJsonAccept,
  reducerPath: 'about',
  tagTypes: ['About'],
  endpoints: (build) => ({
    fetchAboutPage: build.query<IAboutPage | undefined, string>({
      query: (rvcode: string) => ({ url: `pages?page_code=about&rvcode=${rvcode}` }),
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
